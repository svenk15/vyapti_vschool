import {randomUUID} from 'node:crypto';
import type {Prisma} from '../../../../generated/prisma/client';
import {AccessError} from '../../access/contracts/index';
import type {TeacherProfileInput,TeacherProfilePort,TeacherTransaction} from '../contracts/teacher-profile';
function txOf(transaction:TeacherTransaction){return transaction as Prisma.TransactionClient;}
export class PrismaTeacherProfile implements TeacherProfilePort{
 async enable(transaction:TeacherTransaction,input:TeacherProfileInput){
  const tx=txOf(transaction),employee=await tx.employee.findFirst({where:{id:input.employeeId,organizationId:input.organizationId,schoolId:input.schoolId,status:'ACTIVE',OR:[{employedTo:null},{employedTo:{gt:new Date(input.occurredAt)}}]},select:{id:true}});if(!employee)throw new AccessError('CONFLICT');
  if(await tx.teacher.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,employeeId:input.employeeId},select:{id:true}}))throw new AccessError('CONFLICT');
  const row=await tx.teacher.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,employeeId:input.employeeId,active:true,version:1}});
  await tx.outboxEvent.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,module:'academics',type:'TeacherEligibilityEnabled.v1',schemaVersion:1,aggregateId:row.id,aggregateVersion:row.version,occurredAt:input.occurredAt,payload:{schemaVersion:1,teacherId:row.id,employeeId:row.employeeId},state:'PENDING',attempts:0,availableAt:input.occurredAt}});
  return {teacherId:row.id,version:row.version};
 }
 async disable(transaction:TeacherTransaction,input:TeacherProfileInput&{employmentEndExclusive:string}){
  const tx=txOf(transaction),row=await tx.teacher.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,employeeId:input.employeeId,active:true},select:{id:true,version:true}});if(!row)return null;
  if(input.employmentEndExclusive&&await tx.teacherAssignment.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,teacherId:row.id,validTo:{gt:new Date(`${input.employmentEndExclusive}T00:00:00.000Z`)}},select:{id:true}}))throw new AccessError('CONFLICT');
  const changed=await tx.teacher.updateMany({where:{id:row.id,organizationId:input.organizationId,schoolId:input.schoolId,version:row.version,active:true},data:{active:false,version:{increment:1}}});if(changed.count!==1)throw new AccessError('STALE_VERSION');
  await tx.outboxEvent.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,module:'academics',type:'TeacherEligibilityEnded.v1',schemaVersion:1,aggregateId:row.id,aggregateVersion:row.version+1,occurredAt:input.occurredAt,payload:{schemaVersion:1,teacherId:row.id,employeeId:input.employeeId},state:'PENDING',attempts:0,availableAt:input.occurredAt}});
  return {teacherId:row.id,version:row.version+1};
 }
}
