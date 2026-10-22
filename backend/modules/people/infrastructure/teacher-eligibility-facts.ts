import type {Prisma} from '../../../../generated/prisma/client';
import type {TeacherEligibilityEmployeeFactsPort,TeacherEligibilityTransaction} from '../../academics/contracts/teacher-eligibility';
const civil=(value:Date)=>value.toISOString().slice(0,10);
export class PrismaTeacherEligibilityEmployeeFacts implements TeacherEligibilityEmployeeFactsPort {
 async read(transaction:TeacherEligibilityTransaction,input:{organizationId:string;schoolId:string;employeeId:string}){
  const tx=transaction as Prisma.TransactionClient,row=await tx.employee.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,id:input.employeeId},select:{id:true,status:true,employedFrom:true,employedTo:true}});
  return row?{employeeId:row.id,status:row.status as 'ACTIVE'|'ENDED',employedFrom:civil(row.employedFrom),employedTo:row.employedTo?civil(row.employedTo):null}:null;
 }
}
