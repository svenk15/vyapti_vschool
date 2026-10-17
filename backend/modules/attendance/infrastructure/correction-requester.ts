import type {Prisma} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {GuardianChildAccessVerifier} from '../../guardians/contracts/access-verification';
import type {StudentSelfAccessVerifier} from '../../students/contracts/student-portal-access';
import type {AttendanceCorrectionRequesterPort} from '../contracts/correction-requester';
import {AttendanceCorrectionRequestError} from '../domain/correction-requests';
export class PrismaAttendanceCorrectionRequester implements AttendanceCorrectionRequesterPort{
 constructor(private readonly guardian:GuardianChildAccessVerifier,private readonly student:StudentSelfAccessVerifier){}
 async verify(transaction:object,actor:Identity,input:Parameters<AttendanceCorrectionRequesterPort['verify']>[2]){
  const tx=transaction as Prisma.TransactionClient;
  if(input.kind==='GUARDIAN'){const result=await this.guardian.verify(tx,actor,{studentId:input.studentId,purpose:'attendance.correction.request_child',moduleId:'attendance'});return {organizationId:result.organizationId,schoolId:result.schoolId,studentId:result.studentId};}
  if(input.kind==='STUDENT'){const result=await this.student.verify(tx,actor,{studentId:input.studentId,purpose:'attendance.correction.request_self',moduleId:'attendance'});return {organizationId:result.organizationId,schoolId:result.schoolId,studentId:result.studentId};}
  const session=await tx.attendanceSession.findFirst({where:{id:input.sessionId,status:'SUBMITTED',rosterEntries:{some:{studentId:input.studentId}}},select:{organizationId:true,schoolId:true,schoolDate:true,offeringId:true}});if(!session)throw new AttendanceCorrectionRequestError('NOT_FOUND');
  const membership=await tx.schoolMembership.findFirst({where:{organizationId:session.organizationId,schoolId:session.schoolId,accountId:actor.accountId,status:'ACTIVE',grants:{some:{code:'TEACHER'}}},select:{id:true}}),binding=membership?await tx.accountPersonBinding.findFirst({where:{organizationId:session.organizationId,accountId:actor.accountId},select:{personId:true}}):null,teacher=binding?await tx.teacher.findFirst({where:{organizationId:session.organizationId,schoolId:session.schoolId,active:true,employee:{personId:binding.personId,status:'ACTIVE'}},select:{id:true}}):null;if(!teacher)throw new AttendanceCorrectionRequestError('FORBIDDEN');
  const assignment=await tx.teacherAssignment.findFirst({where:{organizationId:session.organizationId,schoolId:session.schoolId,offeringId:session.offeringId,teacherId:teacher.id,validFrom:{lte:session.schoolDate},validTo:{gt:session.schoolDate}},select:{id:true}});if(!assignment)throw new AttendanceCorrectionRequestError('FORBIDDEN');return {organizationId:session.organizationId,schoolId:session.schoolId,studentId:input.studentId};
 }
}
