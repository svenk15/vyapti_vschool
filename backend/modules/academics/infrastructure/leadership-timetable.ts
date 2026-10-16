import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {LeadershipTimetableException,LeadershipTimetableOverview} from '../../../../shared/contracts/timetable';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';
import type {LeadershipTimetableRepository} from '../application/leadership-timetable';

const date=(value:Date)=>value.toISOString().slice(0,10);
const at=(value:string)=>new Date(`${value}T00:00:00.000Z`);
const exceptionOutcomes=['BLOCKED_MANUAL_CONFLICT','BLOCKED_DOMAIN_RULE','FAILED_TECHNICAL'] as const;
const empty=()=>({created:0,alreadyReconciled:0,blockedManualConflict:0,blockedDomainRule:0,failedTechnical:0,cancelledRemoved:0});

export class PrismaLeadershipTimetableRepository implements LeadershipTimetableRepository {
 constructor(private readonly db:PrismaClient,private readonly manifest:ReleaseManifest,private readonly context:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date()){}

 private async guard(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string){
  await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId,branchId:schoolId});
  const [account,school,membership]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.school.findFirst({where:{organizationId,id:schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{timezone:true}}),
   tx.schoolMembership.findFirst({where:{organizationId,schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}}),
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!school)throw new AccessError('NOT_FOUND');
  if(!membership||!capabilitiesFor(membership.grants.map(row=>row.code as 'SCHOOL_ADMIN'|'TEACHER'|'PRINCIPAL')).includes('timetable.read_leadership'))throw new AccessError('FORBIDDEN');
  const modules=['timetable','academic_core','staff_core','attendance'] as const,now=this.now(),[entitlements,activations]=await Promise.all([
   tx.organizationEntitlement.findMany({where:{organizationId,moduleId:{in:[...modules]},state:'ACTIVE',startsAt:{lte:now},OR:[{endsAt:null},{endsAt:{gt:now}}]},select:{moduleId:true}}),
   tx.branchActivation.findMany({where:{organizationId,schoolId,moduleId:{in:[...modules]},state:'ACTIVE'},select:{moduleId:true}}),
  ]);
  if(!modules.every(moduleId=>this.manifest[moduleId]))throw new AccessError('RELEASE_UNAVAILABLE');
  if(new Set(entitlements.map(row=>row.moduleId)).size!==modules.length)throw new AccessError('MODULE_NOT_LICENSED');
  if(new Set(activations.map(row=>row.moduleId)).size!==modules.length)throw new AccessError('MODULE_DISABLED');
  return school;
 }

 async overview(actor:Identity,organizationId:string,schoolId:string,input:{cursor:string|null;limit:number}):Promise<LeadershipTimetableOverview>{
  try{return await this.db.$transaction(async tx=>{
   const school=await this.guard(tx,actor,organizationId,schoolId),asOf=this.now(),today=at(new Intl.DateTimeFormat('en-CA',{timeZone:school.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(asOf));
   const publication=await tx.timetableRevision.findFirst({where:{organizationId,schoolId,state:'PUBLISHED',effectiveFrom:{lte:today},OR:[{effectiveUntil:null},{effectiveUntil:{gt:today}}]},orderBy:[{effectiveFrom:'desc'},{revisionNo:'desc'}],select:{id:true,revisionNo:true,effectiveFrom:true,effectiveUntil:true,validatedUntil:true,publishedAt:true,academicYear:{select:{name:true}}}});
   if(!publication?.publishedAt)return {definitionVersion:'timetable-exceptions.v1',asOf:asOf.toISOString(),timezone:school.timezone,publication:null,reconciliation:null,counts:empty(),exceptions:{items:[],total:0,nextCursor:null}};
   const checkpoint=await tx.timetableGenerationCheckpoint.findFirst({where:{organizationId,schoolId,sourceRevisionId:publication.id},select:{state:true,horizonFrom:true,horizonUntil:true,cursorDate:true,counts:true}}),groups=await tx.lessonOccurrence.groupBy({by:['lastOutcome'],where:{organizationId,schoolId,sourceRevisionId:publication.id},_count:{_all:true}}),counts=groups.reduce((sum,row)=>{const amount=row._count._all;if(row.lastOutcome==='CREATED')sum.created=amount;else if(row.lastOutcome==='ALREADY_RECONCILED')sum.alreadyReconciled=amount;else if(row.lastOutcome==='BLOCKED_MANUAL_CONFLICT')sum.blockedManualConflict=amount;else if(row.lastOutcome==='BLOCKED_DOMAIN_RULE')sum.blockedDomainRule=amount;else if(row.lastOutcome==='FAILED_TECHNICAL')sum.failedTechnical=amount;return sum;},empty());
   counts.cancelledRemoved=Number((checkpoint?.counts as {cancelledRemoved?:unknown}|null)?.cancelledRemoved??0);
   let after:Prisma.LessonOccurrenceWhereInput|undefined;
   if(input.cursor){const row=await tx.lessonOccurrence.findFirst({where:{organizationId,schoolId,sourceRevisionId:publication.id,id:input.cursor,lastOutcome:{in:[...exceptionOutcomes]}},select:{localDate:true,startsAt:true,id:true}});if(!row)throw new AccessError('VALIDATION');after={OR:[{localDate:{gt:row.localDate}},{localDate:row.localDate,startsAt:{gt:row.startsAt}},{localDate:row.localDate,startsAt:row.startsAt,id:{gt:row.id}}]};}
   const allExceptions={organizationId,schoolId,sourceRevisionId:publication.id,lastOutcome:{in:[...exceptionOutcomes]}},where:Prisma.LessonOccurrenceWhereInput={...allExceptions,...after},[total,rows]=await Promise.all([tx.lessonOccurrence.count({where:allExceptions}),tx.lessonOccurrence.findMany({where,orderBy:[{localDate:'asc'},{startsAt:'asc'},{id:'asc'}],take:input.limit+1})]),page=rows.slice(0,input.limit),offeringIds=[...new Set(page.map(row=>row.subjectOfferingId))],assignmentIds=[...new Set(page.map(row=>row.effectiveTeacherAssignmentId))],manual=page.filter(row=>row.lastOutcome==='BLOCKED_MANUAL_CONFLICT');
   const [offerings,assignments,sessions]=await Promise.all([
    tx.courseOffering.findMany({where:{organizationId,schoolId,id:{in:offeringIds}},select:{id:true,subject:{select:{name:true}},section:{select:{id:true,name:true}}}}),
    tx.teacherAssignment.findMany({where:{organizationId,schoolId,id:{in:assignmentIds}},select:{id:true,teacher:{select:{employee:{select:{personId:true,person:{select:{firstName:true,lastName:true}}}}}}}}),
    manual.length?tx.attendanceSession.findMany({where:{organizationId,schoolId,sourceOccurrenceId:null,OR:manual.map(row=>({schoolDate:row.localDate,startsAt:{lt:row.endsAt},endsAt:{gt:row.startsAt}}))},orderBy:[{startsAt:'asc'},{id:'asc'}],include:{offering:{include:{section:{select:{id:true,name:true}},subject:{select:{name:true}},assignments:{include:{teacher:{include:{employee:{select:{personId:true}}}}}}}}}}):Promise.resolve([]),
   ]),offeringMap=new Map(offerings.map(row=>[row.id,row])),assignmentMap=new Map(assignments.map(row=>[row.id,row]));
   const items:LeadershipTimetableException[]=page.map(row=>{const offering=offeringMap.get(row.subjectOfferingId),assignment=assignmentMap.get(row.effectiveTeacherAssignmentId),teacherPersonId=assignment?.teacher.employee.personId,conflict=row.lastOutcome==='BLOCKED_MANUAL_CONFLICT'?sessions.find(session=>session.schoolDate.getTime()===row.localDate.getTime()&&session.startsAt<row.endsAt&&session.endsAt>row.startsAt&&(session.offering.section.id===row.classSectionId||session.offering.assignments.some(candidate=>candidate.validFrom<=row.localDate&&candidate.validTo>row.localDate&&candidate.teacher.employee.personId===teacherPersonId))):undefined;return {occurrenceId:row.id,occurrenceVersion:row.version,schoolDate:date(row.localDate),startsAt:row.startsAt.toISOString(),endsAt:row.endsAt.toISOString(),sectionName:offering?.section.name??'Class unavailable',subjectName:offering?.subject.name??'Subject unavailable',teacherName:assignment?`${assignment.teacher.employee.person.firstName} ${assignment.teacher.employee.person.lastName}`.trim()||null:null,outcome:row.lastOutcome as LeadershipTimetableException['outcome'],errorCode:row.lastErrorCode,updatedAt:row.updatedAt.toISOString(),existingSession:conflict?{id:conflict.id,status:conflict.status as 'SCHEDULED'|'OPEN'|'SUBMITTED',schoolDate:date(conflict.schoolDate),startsAt:conflict.startsAt.toISOString(),endsAt:conflict.endsAt.toISOString(),sectionName:conflict.offering.section.name,subjectName:conflict.offering.subject.name,reviewHref:`/leadership/attendance/sessions/${conflict.id}?date=${date(conflict.schoolDate)}`}:null};});
   return {definitionVersion:'timetable-exceptions.v1',asOf:asOf.toISOString(),timezone:school.timezone,publication:{id:publication.id,revisionNo:publication.revisionNo,academicYearName:publication.academicYear.name,effectiveFrom:date(publication.effectiveFrom),effectiveUntil:publication.effectiveUntil?date(publication.effectiveUntil):null,validatedUntil:publication.validatedUntil?date(publication.validatedUntil):null,publishedAt:publication.publishedAt.toISOString()},reconciliation:checkpoint?{state:checkpoint.state as 'PENDING'|'RUNNING'|'PARTIAL'|'COMPLETE'|'FAILED',horizonFrom:date(checkpoint.horizonFrom),horizonUntil:date(checkpoint.horizonUntil),cursorDate:date(checkpoint.cursorDate)}:null,counts,exceptions:{items,total,nextCursor:rows.length>input.limit?page.at(-1)!.id:null}};
  },{isolationLevel:'RepeatableRead'});}catch(error){if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');}
 }
}
