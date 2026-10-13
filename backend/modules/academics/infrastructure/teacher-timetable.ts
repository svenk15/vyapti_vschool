import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherTimetableLesson,TeacherTimetableWeek} from '../../../../shared/contracts/timetable';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';
import type {TeacherTimetableRepository} from '../application/teacher-timetable';

const atDate=(value:string)=>new Date(`${value}T00:00:00.000Z`),civil=(value:Date)=>value.toISOString().slice(0,10);
const plusDays=(value:string,days:number)=>{const result=atDate(value);result.setUTCDate(result.getUTCDate()+days);return civil(result);};
const fail=(error:unknown):never=>{if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');};

export class PrismaTeacherTimetableRepository implements TeacherTimetableRepository{
 constructor(private db:PrismaClient,private manifest:ReleaseManifest,private context:VerifiedDatabaseContextPort,private now:()=>Date=()=>new Date()){}
 private async guard(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string){
  await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId,branchId:schoolId});
  const [account,school,membership]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.school.findFirst({where:{organizationId,id:schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{timezone:true}}),
   tx.schoolMembership.findFirst({where:{organizationId,schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}})
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!school)throw new AccessError('NOT_FOUND');
  if(!membership||!capabilitiesFor(membership.grants.map(row=>row.code as 'SCHOOL_ADMIN'|'TEACHER')).includes('timetable.read'))throw new AccessError('FORBIDDEN');
  const modules=['timetable','academic_core','staff_core'] as const,now=this.now();
  if(!modules.every(moduleId=>this.manifest[moduleId]))throw new AccessError('RELEASE_UNAVAILABLE');
  const [entitlements,activations]=await Promise.all([
   tx.organizationEntitlement.findMany({where:{organizationId,moduleId:{in:[...modules]},state:'ACTIVE',startsAt:{lte:now},OR:[{endsAt:null},{endsAt:{gt:now}}]},select:{moduleId:true}}),
   tx.branchActivation.findMany({where:{organizationId,schoolId,moduleId:{in:[...modules]},state:'ACTIVE'},select:{moduleId:true}})
  ]);
  if(new Set(entitlements.map(row=>row.moduleId)).size!==modules.length)throw new AccessError('MODULE_NOT_LICENSED');
  if(new Set(activations.map(row=>row.moduleId)).size!==modules.length)throw new AccessError('MODULE_DISABLED');
  return school;
 }
 async week(actor:Identity,organizationId:string,schoolId:string,weekStart:string):Promise<TeacherTimetableWeek>{try{return await this.db.$transaction(async tx=>{
  const school=await this.guard(tx,actor,organizationId,schoolId),start=atDate(weekStart),weekEndExclusive=plusDays(weekStart,7),end=atDate(weekEndExclusive),binding=await tx.accountPersonBinding.findFirst({where:{organizationId,accountId:actor.accountId},select:{personId:true}});
  if(!binding)throw new AccessError('FORBIDDEN');
  const teacher=await tx.teacher.findFirst({where:{organizationId,schoolId,active:true,employee:{personId:binding.personId,status:'ACTIVE',employedFrom:{lt:end},OR:[{employedTo:null},{employedTo:{gt:start}}]}},select:{id:true}});
  if(!teacher)throw new AccessError('FORBIDDEN');
  const revisions=await tx.timetableRevision.findMany({where:{organizationId,schoolId,state:'PUBLISHED',effectiveFrom:{lt:end},OR:[{effectiveUntil:null},{effectiveUntil:{gt:start}}]},orderBy:[{effectiveFrom:'asc'},{revisionNo:'asc'}],include:{academicYear:{select:{id:true,code:true,name:true,startsOn:true,endsOn:true}},dayPattern:{include:{periods:{orderBy:{position:'asc'}}}},slots:{where:{assignment:{teacherId:teacher.id}},include:{section:{select:{name:true}},offering:{include:{subject:{select:{name:true}}}},assignment:{select:{validFrom:true,validTo:true}}}}}});
  const publicationIds=revisions.map(row=>row.id),occurrences=publicationIds.length?await tx.lessonOccurrence.findMany({where:{organizationId,schoolId,sourceRevisionId:{in:publicationIds},localDate:{gte:start,lt:end},effectiveTeacherAssignmentId:{in:revisions.flatMap(row=>row.slots.map(slot=>slot.teacherAssignmentId))}},orderBy:[{localDate:'asc'},{startsAt:'asc'}]}):[],occurrenceIds=occurrences.map(row=>row.id),sessions=occurrenceIds.length?await tx.attendanceSession.findMany({where:{organizationId,schoolId,sourceOccurrenceId:{in:occurrenceIds}},select:{id:true,sourceOccurrenceId:true,status:true}}):[];
  const occurrenceByKey=new Map(occurrences.map(row=>[`${row.sourceRevisionId}:${row.sourceSlotKey}:${civil(row.localDate)}`,row])),sessionByOccurrence=new Map(sessions.filter(row=>row.sourceOccurrenceId).map(row=>[row.sourceOccurrenceId!,row])),displayPeriods:TeacherTimetableWeek['periods'][number][]=[],lessons:TeacherTimetableLesson[]=[];
  for(let offset=0;offset<7;offset++){
   const lessonDate=plusDays(weekStart,offset),day=atDate(lessonDate),weekday=day.getUTCDay()||7,revision=[...revisions].reverse().find(row=>row.effectiveFrom<=day&&(!row.effectiveUntil||row.effectiveUntil>day)&&row.academicYear.startsOn<=day&&row.academicYear.endsOn>day);
   if(!revision)continue;
   if(revision.slots.length&&revision.dayPattern.teachingDays.includes(weekday))for(const period of revision.dayPattern.periods)displayPeriods.push({date:lessonDate,startsAt:period.startLocal.toISOString().slice(11,16),endsAt:period.endLocal.toISOString().slice(11,16),label:period.label,kind:period.kind as 'LESSON'|'BREAK',position:period.position});
   const periods=new Map(revision.dayPattern.periods.map(period=>[period.periodKey,period]));
   for(const slot of revision.slots.filter(row=>row.dayOfWeek===weekday&&row.assignment.validFrom<=day&&row.assignment.validTo>day)){
    const period=periods.get(slot.periodKey);if(!period)continue;
    const occurrence=occurrenceByKey.get(`${revision.id}:${slot.slotKey}:${lessonDate}`),session=occurrence?sessionByOccurrence.get(occurrence.id):undefined,status=session?.status;
    lessons.push({date:lessonDate,startsAt:period.startLocal.toISOString().slice(11,16),endsAt:period.endLocal.toISOString().slice(11,16),periodLabel:period.label,subjectName:slot.offering.subject.name,sectionName:slot.section.name,locationName:null,publicationId:revision.id,publicationRevision:revision.revisionNo,occurrenceId:occurrence?.id??null,state:occurrence?.state==='CANCELLED'?'CANCELLED':occurrence?.state==='BLOCKED'?'BLOCKED':occurrence?'RECONCILED':'PUBLISHED_ONLY',attendance:session&&status!=='CANCELLED'?{id:session.id,status:status as 'SCHEDULED'|'OPEN'|'SUBMITTED',href:`/teacher/sessions/${session.id}`}:null});
   }
  }
  const year=revisions.find(row=>row.slots.length)?.academicYear??revisions[0]?.academicYear??null;
  return {weekStart,weekEndExclusive,timezone:school.timezone,academicYear:year?{id:year.id,code:year.code,name:year.name}:null,publications:revisions.map(row=>({id:row.id,revisionNo:row.revisionNo,effectiveFrom:civil(row.effectiveFrom),effectiveUntil:row.effectiveUntil?civil(row.effectiveUntil):null,validatedUntil:row.validatedUntil?civil(row.validatedUntil):null,publishedAt:row.publishedAt?.toISOString()??row.createdAt.toISOString()})),periods:displayPeriods,lessons};
 },{isolationLevel:'RepeatableRead'});}catch(error){return fail(error);}}
}
