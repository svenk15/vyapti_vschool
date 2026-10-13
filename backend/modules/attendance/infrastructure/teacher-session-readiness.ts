import type {Prisma} from '../../../../generated/prisma/client';
import type {TeacherSessionReadinessPort,TeacherSessionReadinessTransaction} from '../../academics/contracts/teacher-session-readiness';

export class PrismaTeacherSessionReadiness implements TeacherSessionReadinessPort{
 async hasCurrentSession(transaction:TeacherSessionReadinessTransaction,input:{organizationId:string;schoolId:string;offeringIds:readonly string[];schoolDate:string}){
  if(!input.offeringIds.length)return false;
  return (await (transaction as Prisma.TransactionClient).attendanceSession.count({where:{organizationId:input.organizationId,schoolId:input.schoolId,offeringId:{in:[...input.offeringIds]},schoolDate:new Date(`${input.schoolDate}T00:00:00.000Z`),status:{not:'CANCELLED'}}}))>0;
 }
}
