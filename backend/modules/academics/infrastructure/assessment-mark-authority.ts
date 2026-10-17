import type {Prisma} from '../../../../generated/prisma/client';
import type {AssessmentMarkAuthorityPort} from '../contracts/assessment-mark-authority';

export class PrismaAssessmentMarkAuthority implements AssessmentMarkAuthorityPort{
 async resolve(transaction:object,input:{organizationId:string;schoolId:string;accountId:string;academicYearId:string;sectionId:string;subjectId:string;schoolDate:string}){
  const tx=transaction as Prisma.TransactionClient,date=new Date(`${input.schoolDate}T00:00:00.000Z`),binding=await tx.accountPersonBinding.findFirst({where:{organizationId:input.organizationId,accountId:input.accountId},select:{personId:true}});
  if(!binding)return null;
  const assignment=await tx.teacherAssignment.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,validFrom:{lte:date},validTo:{gt:date},teacher:{active:true,employee:{personId:binding.personId,status:'ACTIVE',employedFrom:{lte:date},OR:[{employedTo:null},{employedTo:{gt:date}}]}},offering:{active:true,yearId:input.academicYearId,sectionId:input.sectionId,subjectId:input.subjectId}},orderBy:[{validFrom:'desc'},{id:'asc'}],select:{id:true,teacherId:true,offeringId:true}});
  return assignment?{teacherAssignmentId:assignment.id,teacherId:assignment.teacherId,offeringId:assignment.offeringId}:null;
 }
}
