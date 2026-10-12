import {randomUUID} from 'node:crypto';
import type {Prisma} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import {capabilitiesFor,AccessError} from '../../access/contracts/index';
import type {ReleaseManifest} from '../../tenancy/contracts/index';
import type {AttendancePlannedOccurrence,AttendancePlanningResult,AttendanceTimetablePlanningPort} from '../contracts/timetable-planning';

const day=(value:string)=>new Date(`${value}T00:00:00.000Z`);
export class PrismaAttendanceTimetablePlanning implements AttendanceTimetablePlanningPort {
 constructor(private readonly manifest:ReleaseManifest,private readonly now:()=>Date=()=>new Date()){}
 private async assertAuthorized(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string){
  const [account,school,member,entitlement,activation]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.school.findFirst({where:{organizationId,id:schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{id:true}}),
   tx.schoolMembership.findFirst({where:{organizationId,schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}}),
   tx.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId,moduleId:'attendance'}}}),
   tx.branchActivation.findUnique({where:{organizationId_schoolId_moduleId:{organizationId,schoolId,moduleId:'attendance'}}})
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!school)throw new AccessError('NOT_FOUND');
  if(!member||!capabilitiesFor(member.grants.map(row=>row.code as 'SCHOOL_ADMIN'|'TEACHER')).includes('timetable.manage'))throw new AccessError('FORBIDDEN');
  if(!this.manifest.attendance)throw new AccessError('RELEASE_UNAVAILABLE');
  const now=this.now();if(!entitlement||entitlement.state!=='ACTIVE'||entitlement.startsAt>now||(entitlement.endsAt!==null&&entitlement.endsAt<=now))throw new AccessError('MODULE_NOT_LICENSED');
  if(!activation||activation.state!=='ACTIVE')throw new AccessError('MODULE_DISABLED');
 }
 async authorize(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string}){await this.assertAuthorized(transaction as Prisma.TransactionClient,actor,input.organizationId,input.schoolId);}
 async reconcile(transaction:object,actor:Identity,input:AttendancePlannedOccurrence):Promise<AttendancePlanningResult>{
  const tx=transaction as Prisma.TransactionClient;await this.assertAuthorized(tx,actor,input.organizationId,input.schoolId);
  const occurrence=await tx.lessonOccurrence.findFirst({where:{id:input.occurrenceId,organizationId:input.organizationId,schoolId:input.schoolId,academicYearId:input.academicYearId,classSectionId:input.sectionId,subjectOfferingId:input.offeringId,effectiveTeacherAssignmentId:input.teacherAssignmentId,localDate:day(input.schoolDate),startsAt:new Date(input.startsAt),endsAt:new Date(input.endsAt)},select:{id:true}});
  if(!occurrence)throw new AccessError('NOT_FOUND');
  const linked=await tx.attendanceSession.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,sourceOccurrenceId:input.occurrenceId},select:{id:true,status:true,offeringId:true,schoolDate:true,startsAt:true,endsAt:true,calendarRevisionId:true}});
  if(linked){
   const unchanged=linked.offeringId===input.offeringId&&linked.schoolDate.getTime()===day(input.schoolDate).getTime()&&linked.startsAt.getTime()===new Date(input.startsAt).getTime()&&linked.endsAt.getTime()===new Date(input.endsAt).getTime()&&linked.calendarRevisionId===input.calendarRevisionId;
   if(unchanged)return {outcome:'ALREADY_RECONCILED',sessionId:linked.id,existingSession:null,errorCode:null};
   if(linked.status!=='SCHEDULED')return {outcome:'BLOCKED_DOMAIN_RULE',sessionId:linked.id,existingSession:null,errorCode:'FROZEN_SESSION'};
  }
  const at=day(input.schoolDate),assignment=await tx.teacherAssignment.findFirst({where:{id:input.teacherAssignmentId,organizationId:input.organizationId,schoolId:input.schoolId,offeringId:input.offeringId,validFrom:{lte:at},validTo:{gt:at},teacher:{active:true,employee:{status:'ACTIVE',employedFrom:{lte:at},OR:[{employedTo:null},{employedTo:{gt:at}}]}}},select:{teacher:{select:{employee:{select:{personId:true}}}}}});
  const offering=await tx.courseOffering.findFirst({where:{id:input.offeringId,organizationId:input.organizationId,schoolId:input.schoolId,sectionId:input.sectionId,active:true},select:{id:true,subject:{select:{name:true}},section:{select:{name:true}}}}),calendar=await tx.calendarRevision.findFirst({where:{id:input.calendarRevisionId,organizationId:input.organizationId,schoolId:input.schoolId},select:{id:true}});
  if(!assignment||!offering||!calendar)return {outcome:'BLOCKED_DOMAIN_RULE',sessionId:null,existingSession:null,errorCode:'SOURCE_NOT_ELIGIBLE'};
  const startsAt=new Date(input.startsAt),endsAt=new Date(input.endsAt),candidates=await tx.attendanceSession.findMany({where:{organizationId:input.organizationId,schoolId:input.schoolId,schoolDate:at,status:{not:'CANCELLED'},startsAt:{lt:endsAt},endsAt:{gt:startsAt},...(linked?{id:{not:linked.id}}:{})},orderBy:[{startsAt:'asc'},{id:'asc'}],include:{offering:{include:{section:{select:{id:true,name:true}},subject:{select:{name:true}},assignments:{where:{validFrom:{lte:at},validTo:{gt:at}},include:{teacher:{include:{employee:{select:{personId:true}}}}}}}}}});
  const clash=candidates.find(session=>session.offering.section.id===input.sectionId||session.offering.assignments.some(row=>row.teacher.employee.personId===assignment.teacher.employee.personId));
  if(clash){const existing={id:clash.id,status:clash.status as 'SCHEDULED'|'OPEN'|'SUBMITTED',schoolDate:input.schoolDate,startsAt:clash.startsAt.toISOString(),endsAt:clash.endsAt.toISOString(),sectionName:clash.offering.section.name,subjectName:clash.offering.subject.name,reviewHref:`/admin/attendance/sessions/${clash.id}`};return {outcome:clash.sourceOccurrenceId===null?'BLOCKED_MANUAL_CONFLICT':'BLOCKED_DOMAIN_RULE',sessionId:null,existingSession:existing,errorCode:clash.sourceOccurrenceId===null?'MANUAL_SESSION_CONFLICT':'GENERATED_SESSION_CONFLICT'};}
  if(linked){await tx.attendanceSession.update({where:{id:linked.id},data:{offeringId:input.offeringId,schoolDate:at,startsAt,endsAt,calendarRevisionId:input.calendarRevisionId,version:{increment:1}}});return {outcome:'ALREADY_RECONCILED',sessionId:linked.id,existingSession:null,errorCode:null};}
  const id=randomUUID();await tx.attendanceSession.create({data:{id,organizationId:input.organizationId,schoolId:input.schoolId,offeringId:input.offeringId,schoolDate:at,startsAt,endsAt,occurrenceKey:`tt:${input.occurrenceId}`,calendarRevisionId:input.calendarRevisionId,status:'SCHEDULED',version:1,sourceOccurrenceId:input.occurrenceId}});
  return {outcome:'CREATED',sessionId:id,existingSession:null,errorCode:null};
 }
 async cancelRemoved(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string;occurrenceId:string;reason:string}){
  const tx=transaction as Prisma.TransactionClient;await this.assertAuthorized(tx,actor,input.organizationId,input.schoolId);const session=await tx.attendanceSession.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,sourceOccurrenceId:input.occurrenceId},select:{id:true,status:true,version:true}});if(!session||session.status==='CANCELLED')return 'ALREADY_CANCELLED' as const;if(session.status!=='SCHEDULED')return 'BLOCKED' as const;const now=this.now(),revision=(await tx.attendanceRevision.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,sessionId:session.id},orderBy:{number:'desc'},select:{number:true}}))?.number??0;await tx.attendanceRevision.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,sessionId:session.id,number:revision+1,kind:'CANCEL',actorAccountId:actor.accountId,occurredAt:now,reason:input.reason,changes:{schemaVersion:1,fromStatus:'SCHEDULED',toStatus:'CANCELLED',source:'TIMETABLE_RECONCILIATION'}}});await tx.attendanceSession.update({where:{id:session.id},data:{status:'CANCELLED',cancelledAt:now,version:{increment:1}}});return 'CANCELLED' as const;
 }
}
