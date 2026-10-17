import type {Prisma} from '../../../../generated/prisma/client';
import type {AssessmentAcademicPlanningPort} from '../contracts/assessment-planning';

const day=(value:Date)=>value.toISOString().slice(0,10);
export class PrismaAssessmentAcademicPlanning implements AssessmentAcademicPlanningPort{
 async list(transaction:object,input:{organizationId:string;schoolId:string}){
  const tx=transaction as Prisma.TransactionClient;
  const [years,subjects]=await Promise.all([
   tx.academicYear.findMany({where:{...input,status:{in:['OPEN','PLANNED']}},orderBy:[{startsOn:'desc'},{id:'asc'}],include:{sections:{where:{active:true},orderBy:[{grade:{sortOrder:'asc'}},{name:'asc'},{id:'asc'}],select:{id:true,code:true,name:true,grade:{select:{name:true}}}}}}),
   tx.subject.findMany({where:{...input,active:true},orderBy:[{name:'asc'},{id:'asc'}],select:{id:true,code:true,name:true}})
  ]);
  return {years:years.map(year=>({id:year.id,code:year.code,name:year.name,startsOn:day(year.startsOn),endsOn:day(year.endsOn),sections:year.sections.map(section=>({id:section.id,code:section.code,name:section.name,gradeName:section.grade.name}))})),subjects};
 }
 async assertPlan(transaction:object,input:{organizationId:string;schoolId:string;academicYearId:string;sectionId:string;subjectIds:readonly string[];sourceCutoffDate:string}){
  const tx=transaction as Prisma.TransactionClient;
  const [section,subjects]=await Promise.all([
   tx.section.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,id:input.sectionId,yearId:input.academicYearId,active:true,year:{status:{in:['OPEN','PLANNED']},startsOn:{lte:new Date(`${input.sourceCutoffDate}T00:00:00.000Z`)},endsOn:{gt:new Date(`${input.sourceCutoffDate}T00:00:00.000Z`)}}},select:{id:true}}),
   tx.subject.count({where:{organizationId:input.organizationId,schoolId:input.schoolId,id:{in:[...input.subjectIds]},active:true}})
  ]);
  if(!section||subjects!==new Set(input.subjectIds).size)throw new Error('ASSESSMENT_SOURCE_NOT_FOUND');
 }
}
