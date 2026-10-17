import type {Prisma} from '../../../../generated/prisma/client';
import type {AssessmentCohortPort} from '../contracts/assessment-cohort';

export class PrismaAssessmentCohort implements AssessmentCohortPort{
 async listAtCutoff(transaction:object,input:{organizationId:string;schoolId:string;academicYearId:string;sectionId:string;cutoffDate:string}){
  const tx=transaction as Prisma.TransactionClient,date=new Date(`${input.cutoffDate}T00:00:00.000Z`);
  const rows=await tx.sectionPlacement.findMany({where:{organizationId:input.organizationId,schoolId:input.schoolId,sectionId:input.sectionId,yearId:input.academicYearId,validFrom:{lte:date},validTo:{gt:date},enrollment:{is:{yearId:input.academicYearId,validFrom:{lte:date},validTo:{gt:date},student:{status:'ACTIVE'}}}},orderBy:[{rollNumber:'asc'},{enrollmentId:'asc'}],select:{id:true,yearId:true,enrollment:{select:{id:true,studentId:true}}}});
  return rows.map(row=>({studentId:row.enrollment.studentId,enrollmentId:row.enrollment.id,placementId:row.id,yearId:row.yearId}));
 }
 async describe(transaction:object,input:{organizationId:string;schoolId:string;studentIds:readonly string[]}){
  const tx=transaction as Prisma.TransactionClient,rows=await tx.student.findMany({where:{organizationId:input.organizationId,schoolId:input.schoolId,id:{in:[...input.studentIds]}},orderBy:[{admissionNumber:'asc'},{id:'asc'}],select:{id:true,admissionNumber:true,person:{select:{firstName:true,lastName:true}}}});
  return rows.map(row=>({studentId:row.id,admissionNumber:row.admissionNumber,displayName:`${row.person.firstName} ${row.person.lastName}`.trim()}));
 }
}
