import {createHash,randomUUID} from 'node:crypto';
import {Prisma,type PrismaClient} from '../../../../generated/prisma/client';
import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AssessmentCycleResult,AssessmentCycleState,AssessmentFreezeResult,AssessmentOutcomeState,AssessmentPlanningCommandStatus,AssessmentPlanningResult,AssessmentPlanningWorkspace,AssessmentReadiness,AssessmentScaleResult} from '../../../../shared/contracts/assessments';
import type {AssessmentAcademicPlanningPort} from '../../academics/contracts/assessment-planning';
import type {AssessmentCohortPort} from '../../students/contracts/assessment-cohort';
import type {ReleaseManifest} from '../../tenancy/domain/entitlements';
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';
import type {AssessmentsRepository} from '../application/assessments';
import type {CreateCycleInput,CreateScaleInput,FreezeCohortInput} from '../domain/planning';
import {AssessmentsError,reconcile} from '../domain/readiness';

type Scope={organizationId:string;schoolId:string};
type PlanningCommand='CreateAssessmentScale'|'CreateAssessmentCyclePlan'|'FreezeAssessmentCohort';
const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const day=(value:Date)=>value.toISOString().slice(0,10);
const serializationConflict=(error:unknown)=>{const value=error as {code?:string;meta?:{code?:string;driverAdapterError?:{cause?:{originalCode?:string}}}};return [value.code,value.meta?.code,value.meta?.driverAdapterError?.cause?.originalCode].some(code=>['P2034','40001','40P01'].includes(code??''))||error instanceof Error&&/(?:40001|40P01|could not serialize|deadlock detected)/i.test(error.message);};

export class PrismaAssessmentsRepository implements AssessmentsRepository{
 constructor(private readonly db:PrismaClient,private readonly context:VerifiedDatabaseContextPort,private readonly releases:ReleaseManifest,private readonly mode:'disabled'|'synthetic',private readonly academics:AssessmentAcademicPlanningPort,private readonly students:AssessmentCohortPort,private readonly now:()=>Date=()=>new Date()){}
 private enabled(){if(this.mode!=='synthetic'||!this.releases.assessments)throw new AssessmentsError('UNAVAILABLE');}
 private async write<T>(work:(tx:Prisma.TransactionClient)=>Promise<T>){for(let attempt=0;attempt<3;attempt++)try{return await this.db.$transaction(work,{isolationLevel:'Serializable',timeout:15_000,maxWait:10_000});}catch(error){if(serializationConflict(error)&&attempt<2)continue;if(error instanceof AssessmentsError)throw error;const code=(error as {code?:string}).code;if(code==='P2002'||code==='P2003')throw new AssessmentsError('CONFLICT');if(serializationConflict(error))throw new AssessmentsError('STALE_VERSION');throw new AssessmentsError('UNAVAILABLE');}throw new AssessmentsError('UNAVAILABLE');}
 private async module(tx:Prisma.TransactionClient,scope:Scope){
  const at=this.now(),[school,entitlement,activation]=await Promise.all([
   tx.school.findFirst({where:{organizationId:scope.organizationId,id:scope.schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{timezone:true}}),
   tx.organizationEntitlement.findFirst({where:{organizationId:scope.organizationId,moduleId:'assessments',state:'ACTIVE',startsAt:{lte:at},OR:[{endsAt:null},{endsAt:{gt:at}}]},select:{id:true}}),
   tx.branchActivation.findFirst({where:{...scope,moduleId:'assessments',state:'ACTIVE'},select:{id:true}})
  ]);
  if(!school)throw new AssessmentsError('NOT_FOUND');
  if(!entitlement||!activation)throw new AssessmentsError('FORBIDDEN');
  return school;
 }
 private async oversight(tx:Prisma.TransactionClient,actor:Identity,scope:Scope){
  this.enabled();
  if(!await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:scope.organizationId,branchId:scope.schoolId}))throw new AssessmentsError('UNAUTHENTICATED');
  const school=await this.module(tx,scope),[membership,grant]=await Promise.all([
   tx.schoolMembership.findFirst({where:{...scope,accountId:actor.accountId,status:'ACTIVE',grants:{some:{code:'PRINCIPAL'}}},select:{id:true}}),
   tx.assessmentsOversightGrant.findFirst({where:{...scope,accountId:actor.accountId,revokedAt:null},select:{membershipId:true}})
  ]);
  if(!membership||!grant||grant.membershipId!==membership.id)throw new AssessmentsError('FORBIDDEN');
  return school;
 }
 private async planning(tx:Prisma.TransactionClient,actor:Identity,scope:Scope,locks=false){
  this.enabled();
  if(!await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:scope.organizationId,branchId:scope.schoolId}))throw new AssessmentsError('UNAUTHENTICATED');
  if(locks){
   await tx.$queryRaw(Prisma.sql`SELECT id FROM vs_access_user_account WHERE id=${actor.accountId}::uuid FOR UPDATE`);
   await tx.$queryRaw(Prisma.sql`SELECT id FROM vs_access_organization WHERE id=${scope.organizationId}::uuid FOR SHARE`);
   await tx.$queryRaw(Prisma.sql`SELECT id FROM vs_access_school WHERE organization_id=${scope.organizationId}::uuid AND id=${scope.schoolId}::uuid FOR UPDATE`);
  }
  const school=await this.module(tx,scope),membership=await tx.schoolMembership.findFirst({where:{...scope,accountId:actor.accountId,status:'ACTIVE',grants:{some:{code:'SCHOOL_ADMIN'}}},select:{id:true}});
  if(!membership)throw new AssessmentsError('FORBIDDEN');
  const grant=await tx.assessmentsPlanningGrant.findFirst({where:{...scope,accountId:actor.accountId,membershipId:membership.id,revokedAt:null},select:{id:true}});
  if(!grant)throw new AssessmentsError('FORBIDDEN');
  return school;
 }
 private async prior(tx:Prisma.TransactionClient,actor:Identity,scope:Scope,command:PlanningCommand,key:string,inputHash:string){
  const receipt=await tx.assessmentsCommandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:{...scope,actorAccountId:actor.accountId,command,key}}});
  if(!receipt)return null;
  if(receipt.inputHash!==inputHash)throw new AssessmentsError('IDEMPOTENCY_CONFLICT');
  return {...receipt.response as AssessmentPlanningResult,replayed:true} as AssessmentPlanningResult;
 }
 private async evidence(tx:Prisma.TransactionClient,actor:Identity,scope:Scope,command:PlanningCommand,key:string,inputHash:string,result:AssessmentPlanningResult,resourceType:string,resourceId:string,before:Prisma.InputJsonValue,after:Prisma.InputJsonValue){
  const at=this.now();
  await tx.assessmentsCommandReceipt.create({data:{id:randomUUID(),...scope,actorAccountId:actor.accountId,command,key,inputHash,response:result,createdAt:at}});
  await tx.auditEntry.create({data:{id:randomUUID(),...scope,actorAccountId:actor.accountId,module:'assessments',command,resourceType,resourceId,before,after,reason:null,requestId:key,occurredAt:at}});
 }
 async leadershipReadiness(actor:Identity,scope:Scope,cycleId:string|null):Promise<AssessmentReadiness>{return this.db.$transaction(async tx=>{
  const school=await this.oversight(tx,actor,scope),cycle=await tx.assessmentsCycle.findFirst({where:{...scope,...(cycleId?{id:cycleId}:{})},orderBy:[{updatedAt:'desc'},{id:'desc'}]});if(!cycle)throw new AssessmentsError('NOT_FOUND');
  const [scale,year,section,plans,cohort,outcomes,moderations,reports]=await Promise.all([tx.assessmentsScale.findFirst({where:{...scope,id:cycle.scaleId}}),tx.academicYear.findFirst({where:{...scope,id:cycle.academicYearId},select:{name:true}}),tx.section.findFirst({where:{...scope,id:cycle.sectionId},select:{name:true,grade:{select:{name:true}}}}),tx.assessmentsPlanItem.findMany({where:{...scope,cycleId:cycle.id},orderBy:[{position:'asc'},{id:'asc'}]}),tx.assessmentsCohortMember.findMany({where:{...scope,cycleId:cycle.id,state:'ACTIVE'},select:{id:true}}),tx.assessmentsOutcome.findMany({where:{...scope,cycleId:cycle.id},select:{planItemId:true,cohortMemberId:true,state:true}}),tx.assessmentsModeration.findMany({where:{...scope,cycleId:cycle.id},select:{planItemId:true,status:true}}),tx.assessmentsReportRevision.findMany({where:{...scope,cycleId:cycle.id},orderBy:[{number:'desc'}],select:{cohortMemberId:true,status:true,number:true}})]);if(!scale||!year||!section)throw new AssessmentsError('UNAVAILABLE');
  const active=new Set(cohort.map(x=>x.id)),subjectIds=plans.map(x=>x.subjectId),subjects=await tx.subject.findMany({where:{...scope,id:{in:subjectIds}},select:{id:true,name:true}}),subjectName=new Map(subjects.map(x=>[x.id,x.name])),moderationByPlan=new Map(moderations.map(x=>[x.planItemId,x.status])),required=plans.filter(x=>x.required),requiredPlanIds=new Set(required.map(x=>x.id)),requiredOutcomes=outcomes.filter(x=>requiredPlanIds.has(x.planItemId)&&active.has(x.cohortMemberId)),base=reconcile(required.length*cohort.length,requiredOutcomes.map(x=>x.state as AssessmentOutcomeState)),latestReports=new Map<string,string>();for(const report of reports)if(!latestReports.has(report.cohortMemberId))latestReports.set(report.cohortMemberId,report.status);
  const mod=(status:string)=>moderations.filter(x=>x.status===status).length,rep=(status:string)=>[...latestReports.values()].filter(x=>x===status).length,blockers:AssessmentReadiness['blockers'][number][]=[];if(base.missing)blockers.push('MISSING_REQUIRED_OUTCOMES');if(mod('PENDING'))blockers.push('MODERATION_PENDING');if(mod('RETURNED'))blockers.push('MODERATION_RETURNED');if(mod('REJECTED'))blockers.push('MODERATION_REJECTED');
  return {definitionVersion:'assessment-readiness.v1',asOf:this.now().toISOString(),timezone:school.timezone,cycle:{id:cycle.id,code:cycle.code,name:cycle.name,state:cycle.state as AssessmentCycleState,schemeVersion:cycle.schemeVersion,version:cycle.version,academicYearName:year.name,sectionName:`${section.grade.name} · ${section.name}`,sourceCutoff:cycle.sourceCutoff.toISOString()},scale:{name:scale.name,minimumScaled:scale.minimumScaled,maximumScaled:scale.maximumScaled,precision:scale.precision,rounding:scale.rounding as 'HALF_UP'|'HALF_EVEN'},counts:{requiredSlots:required.length*cohort.length,optionalSlots:plans.filter(x=>!x.required).length*cohort.length,...base,moderationPending:mod('PENDING'),moderationApproved:mod('APPROVED'),moderationReturned:mod('RETURNED'),moderationRejected:mod('REJECTED'),reportsWithheld:rep('WITHHELD'),reportsApproved:rep('APPROVED'),reportsPublished:rep('PUBLISHED'),reportsWithdrawn:rep('WITHDRAWN')},blockers,readyForApproval:blockers.length===0,subjects:plans.map(plan=>{const rows=outcomes.filter(x=>x.planItemId===plan.id&&active.has(x.cohortMemberId)),r=reconcile(cohort.length,rows.map(x=>x.state as AssessmentOutcomeState));return {planItemId:plan.id,subjectName:subjectName.get(plan.subjectId)??'Subject unavailable',required:plan.required,maximumScaled:plan.maximumScaled,weightBasisPoints:plan.weightBasisPoints,...r,moderationStatus:(moderationByPlan.get(plan.id)??null) as 'PENDING'|'APPROVED'|'RETURNED'|'REJECTED'|null};})};
 },{isolationLevel:'RepeatableRead'});}
 async planningWorkspace(actor:Identity,scope:Scope):Promise<AssessmentPlanningWorkspace>{return this.db.$transaction(async tx=>{
  const school=await this.planning(tx,actor,scope),[sources,scales,cycles]=await Promise.all([this.academics.list(tx,scope),tx.assessmentsScale.findMany({where:{...scope,status:'ACTIVE'},orderBy:[{name:'asc'},{id:'asc'}]}),tx.assessmentsCycle.findMany({where:scope,orderBy:[{updatedAt:'desc'},{id:'desc'}]})]);
  const ids=cycles.map(row=>row.id),[plans,cohorts]=ids.length?await Promise.all([tx.assessmentsPlanItem.groupBy({by:['cycleId'],where:{...scope,cycleId:{in:ids}},_count:{_all:true}}),tx.assessmentsCohortMember.groupBy({by:['cycleId'],where:{...scope,cycleId:{in:ids},state:'ACTIVE'},_count:{_all:true}})]):[[],[]],planCounts=new Map(plans.map(row=>[row.cycleId,row._count._all])),cohortCounts=new Map(cohorts.map(row=>[row.cycleId,row._count._all])),yearById=new Map(sources.years.map(row=>[row.id,row])),sectionById=new Map(sources.years.flatMap(row=>row.sections).map(row=>[row.id,row])),scaleById=new Map(scales.map(row=>[row.id,row]));
  return {definitionVersion:'assessment-planning.v1',asOf:this.now().toISOString(),timezone:school.timezone,scales:scales.map(row=>({id:row.id,code:row.code,name:row.name,minimumScaled:row.minimumScaled,maximumScaled:row.maximumScaled,precision:row.precision,rounding:row.rounding as 'HALF_UP'|'HALF_EVEN',version:row.version})),years:sources.years,subjects:sources.subjects,cycles:cycles.map(row=>({id:row.id,code:row.code,name:row.name,state:row.state as AssessmentCycleState,version:row.version,schemeVersion:row.schemeVersion,sourceCutoff:row.sourceCutoff.toISOString(),academicYearId:row.academicYearId,academicYearName:yearById.get(row.academicYearId)?.name??'Year unavailable',sectionId:row.sectionId,sectionName:sectionById.get(row.sectionId)?.name??'Section unavailable',scaleId:row.scaleId,scaleName:scaleById.get(row.scaleId)?.name??'Scale unavailable',planItemCount:planCounts.get(row.id)??0,cohortCount:cohortCounts.get(row.id)??0}))};
 },{isolationLevel:'RepeatableRead'});}
 async createScale(actor:Identity,scope:Scope,input:CreateScaleInput):Promise<AssessmentScaleResult>{return this.write(async tx=>{
  await this.planning(tx,actor,scope,true);const command='CreateAssessmentScale' as const,inputHash=digest(input),prior=await this.prior(tx,actor,scope,command,input.key,inputHash);if(prior)return prior as AssessmentScaleResult;
  const id=randomUUID(),at=this.now(),result:AssessmentScaleResult={command,scaleId:id,version:1,replayed:false};
  await tx.assessmentsScale.create({data:{id,...scope,code:input.code,name:input.name,minimumScaled:input.minimumScaled,maximumScaled:input.maximumScaled,precision:input.precision,rounding:input.rounding,status:'ACTIVE',version:1,createdAt:at}});
  await this.evidence(tx,actor,scope,command,input.key,inputHash,result,'AssessmentsScale',id,{},result);return result;
 });}
 async createCycle(actor:Identity,scope:Scope,input:CreateCycleInput):Promise<AssessmentCycleResult>{return this.write(async tx=>{
  await this.planning(tx,actor,scope,true);const command='CreateAssessmentCyclePlan' as const,inputHash=digest(input),prior=await this.prior(tx,actor,scope,command,input.key,inputHash);if(prior)return prior as AssessmentCycleResult;
  const scale=await tx.assessmentsScale.findFirst({where:{...scope,id:input.scaleId,status:'ACTIVE'}});if(!scale||input.items.some(item=>item.maximumScaled>scale.maximumScaled||item.maximumScaled<=scale.minimumScaled))throw new AssessmentsError('VALIDATION');
  await this.academics.assertPlan(tx,{...scope,academicYearId:input.academicYearId,sectionId:input.sectionId,subjectIds:input.items.map(item=>item.subjectId),sourceCutoffDate:input.sourceCutoff.slice(0,10)});
  const id=randomUUID(),at=this.now(),result:AssessmentCycleResult={command,cycleId:id,version:1,state:'DRAFT',planItemCount:input.items.length,replayed:false};
  await tx.assessmentsCycle.create({data:{id,...scope,academicYearId:input.academicYearId,sectionId:input.sectionId,scaleId:input.scaleId,code:input.code,name:input.name,schemeVersion:1,state:'DRAFT',sourceCutoff:new Date(input.sourceCutoff),version:1,createdAt:at,updatedAt:at}});await tx.assessmentsPlanItem.createMany({data:input.items.map((item,index)=>({id:randomUUID(),...scope,cycleId:id,...item,position:index+1}))});
  await this.evidence(tx,actor,scope,command,input.key,inputHash,result,'AssessmentsCycle',id,{},result);return result;
 });}
 async freezeCohort(actor:Identity,scope:Scope,input:FreezeCohortInput):Promise<AssessmentFreezeResult>{return this.write(async tx=>{
  await this.planning(tx,actor,scope,true);const command='FreezeAssessmentCohort' as const,inputHash=digest(input),prior=await this.prior(tx,actor,scope,command,input.key,inputHash);if(prior)return prior as AssessmentFreezeResult;
  await tx.$queryRaw(Prisma.sql`SELECT id FROM vs_assessments_cycle WHERE organization_id=${scope.organizationId}::uuid AND school_id=${scope.schoolId}::uuid AND id=${input.cycleId}::uuid FOR UPDATE`);
  const cycle=await tx.assessmentsCycle.findFirst({where:{...scope,id:input.cycleId}});if(!cycle)throw new AssessmentsError('NOT_FOUND');if(cycle.version!==input.expectedVersion)throw new AssessmentsError('STALE_VERSION');if(cycle.state!=='DRAFT')throw new AssessmentsError('CONFLICT');
  const planCount=await tx.assessmentsPlanItem.count({where:{...scope,cycleId:cycle.id,required:true}});if(!planCount)throw new AssessmentsError('CONFLICT');
  const candidates=await this.students.listAtCutoff(tx,{...scope,academicYearId:cycle.academicYearId,sectionId:cycle.sectionId,cutoffDate:day(cycle.sourceCutoff)});if(!candidates.length)throw new AssessmentsError('CONFLICT');
  const at=this.now();await tx.assessmentsCohortMember.createMany({data:candidates.map((row,index)=>({id:randomUUID(),...scope,cycleId:cycle.id,...row,state:'ACTIVE',position:index+1,frozenAt:at}))});
  const updated=await tx.assessmentsCycle.updateMany({where:{...scope,id:cycle.id,state:'DRAFT',version:input.expectedVersion},data:{state:'OPEN',version:{increment:1},updatedAt:at}});if(updated.count!==1)throw new AssessmentsError('STALE_VERSION');
  const result:AssessmentFreezeResult={command,cycleId:cycle.id,version:cycle.version+1,state:'OPEN',cohortCount:candidates.length,replayed:false};await this.evidence(tx,actor,scope,command,input.key,inputHash,result,'AssessmentsCycle',cycle.id,{state:'DRAFT',version:cycle.version},{state:'OPEN',version:cycle.version+1,cohortCount:candidates.length});return result;
 });}
 async commandStatus(actor:Identity,scope:Scope,input:{command:PlanningCommand;key:string}):Promise<AssessmentPlanningCommandStatus>{return this.db.$transaction(async tx=>{
  await this.planning(tx,actor,scope);const receipt=await tx.assessmentsCommandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:{...scope,actorAccountId:actor.accountId,...input}}});if(!receipt)return {state:'UNKNOWN'};return {state:'FOUND',result:{...receipt.response as AssessmentPlanningResult,replayed:true}};
 },{isolationLevel:'RepeatableRead'});}
 async grantOversight(operator:OperatorPrincipal,input:Scope&{accountId:string}){this.enabled();if(!operator.verified)throw new AssessmentsError('FORBIDDEN');await this.db.$transaction(async tx=>{const membership=await tx.schoolMembership.findFirst({where:{...input,status:'ACTIVE',grants:{some:{code:'PRINCIPAL'}},school:{status:'ACTIVE',organization:{status:'ACTIVE'}}},select:{id:true}});if(!membership)throw new AssessmentsError('NOT_FOUND');await tx.assessmentsOversightGrant.upsert({where:{organizationId_schoolId_accountId:{...input}},create:{id:randomUUID(),...input,membershipId:membership.id,grantedByOperatorId:operator.operatorId,grantedAt:this.now(),version:1},update:{membershipId:membership.id,grantedByOperatorId:operator.operatorId,grantedAt:this.now(),revokedAt:null,version:{increment:1}}});await tx.operatorAuditEntry.create({data:{id:randomUUID(),operatorId:operator.operatorId,command:'GrantAssessmentsOversight',resourceType:'AssessmentsOversightGrant',resourceId:input.accountId,occurredAt:this.now(),details:{schemaVersion:1,...input}}});});}
 async grantPlanning(operator:OperatorPrincipal,input:Scope&{accountId:string}){this.enabled();if(!operator.verified)throw new AssessmentsError('FORBIDDEN');await this.db.$transaction(async tx=>{const membership=await tx.schoolMembership.findFirst({where:{...input,status:'ACTIVE',grants:{some:{code:'SCHOOL_ADMIN'}},school:{status:'ACTIVE',organization:{status:'ACTIVE'}}},select:{id:true}});if(!membership)throw new AssessmentsError('NOT_FOUND');await tx.assessmentsPlanningGrant.upsert({where:{organizationId_schoolId_accountId:{...input}},create:{id:randomUUID(),...input,membershipId:membership.id,grantedByOperatorId:operator.operatorId,grantedAt:this.now(),version:1},update:{membershipId:membership.id,grantedByOperatorId:operator.operatorId,grantedAt:this.now(),revokedAt:null,version:{increment:1}}});await tx.operatorAuditEntry.create({data:{id:randomUUID(),operatorId:operator.operatorId,command:'GrantAssessmentsPlanning',resourceType:'AssessmentsPlanningGrant',resourceId:input.accountId,occurredAt:this.now(),details:{schemaVersion:1,...input}}});});}
}
