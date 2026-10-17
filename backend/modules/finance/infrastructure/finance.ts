import {createHash,randomUUID} from 'node:crypto';
import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {FinanceActor,FinanceCapability,FinanceCommandResult,FinanceExceptionDetail,FinanceExceptionState,FinanceExceptionSummary,FinanceReviewer,FinanceSummary} from '../../../../shared/contracts/finance';
import {AccessError} from '../../access/contracts/index';
import type {ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';
import type {FinanceRepository} from '../application/finance';
import {nextFinanceExceptionState} from '../domain/finance';

type Scope={organizationId:string;schoolId:string};
type Tx=Prisma.TransactionClient;
const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fail=(error:unknown):never=>{if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');};
const money=(currency:string,value:bigint)=>({currency,minorUnits:value.toString()});

export class PrismaFinanceRepository implements FinanceRepository{
 constructor(private readonly db:PrismaClient,private readonly manifest:ReleaseManifest,private readonly context:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date()){}

 private async module(tx:Tx,scope:Scope){
  if(!this.manifest.fees)throw new AccessError('RELEASE_UNAVAILABLE');
  const at=this.now();
  const [entitlement,activation]=await Promise.all([
   tx.organizationEntitlement.findFirst({where:{organizationId:scope.organizationId,moduleId:'fees',state:'ACTIVE',startsAt:{lte:at},OR:[{endsAt:null},{endsAt:{gt:at}}]}}),
   tx.branchActivation.findFirst({where:{organizationId:scope.organizationId,schoolId:scope.schoolId,moduleId:'fees',state:'ACTIVE'}}),
  ]);
  if(!entitlement)throw new AccessError('MODULE_NOT_LICENSED');
  if(!activation)throw new AccessError('MODULE_DISABLED');
 }
 private async account(tx:Tx,actor:Identity,scope:Scope){
  await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:scope.organizationId,branchId:scope.schoolId});
  const [account,membership,school]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.schoolMembership.findFirst({where:{...scope,accountId:actor.accountId,status:'ACTIVE'},select:{id:true}}),
   tx.school.findFirst({where:{organizationId:scope.organizationId,id:scope.schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{timezone:true}}),
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!membership)throw new AccessError('FORBIDDEN');
  if(!school)throw new AccessError('NOT_FOUND');
  await this.module(tx,{organizationId:scope.organizationId,schoolId:scope.schoolId});
  return {...membership,timezone:school.timezone};
 }
 private async grantRow(tx:Tx,actor:Identity,scope:Scope,capability:FinanceCapability,currency?:string){
  const membership=await this.account(tx,actor,scope);
  const grant=await tx.financeCapabilityGrant.findFirst({where:{...scope,membershipId:membership.id,accountId:actor.accountId,capability,revokedAt:null,...(currency?{currency}:{})}});
  if(!grant)throw new AccessError('FORBIDDEN');
  return grant;
 }
 private async anyGrant(tx:Tx,actor:Identity,scope:Scope){
  const membership=await this.account(tx,actor,scope);
  const grants=await tx.financeCapabilityGrant.findMany({where:{...scope,membershipId:membership.id,accountId:actor.accountId,revokedAt:null}});
  if(!grants.length)throw new AccessError('FORBIDDEN');
  return grants;
 }
 private async locks(tx:Tx,actor:Identity,scope:Scope){
  await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${actor.accountId}::uuid FOR UPDATE`;
  await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${scope.organizationId}::uuid FOR SHARE`;
  await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${scope.organizationId}::uuid AND id=${scope.schoolId}::uuid FOR UPDATE`;
 }
 private async person(tx:Tx,organizationId:string,accountId:string):Promise<FinanceActor>{
  const row=await tx.accountPersonBinding.findUnique({where:{organizationId_accountId:{organizationId,accountId}},select:{person:{select:{firstName:true,lastName:true}}}});
  return {accountId,displayName:row?[row.person.firstName,row.person.lastName].filter(Boolean).join(' '):'Authorized staff'};
 }
 private async receipt(tx:Tx,actor:Identity,scope:Scope,command:string,key:string,inputHash:string){
  const row=await tx.commandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:{...scope,actorAccountId:actor.accountId,command,key}}});
  if(!row)return null;
  if(row.inputHash!==inputHash)throw new AccessError('IDEMPOTENCY_CONFLICT');
  return {...row.response as FinanceCommandResult,replayed:true};
 }
 private async record(tx:Tx,actor:Identity,scope:Scope,command:string,key:string,inputHash:string,result:FinanceCommandResult,requestId:string,after:Prisma.InputJsonValue){
  const at=this.now();
  await tx.auditEntry.create({data:{id:randomUUID(),...scope,actorAccountId:actor.accountId,module:'finance',command,resourceType:'FinanceException',resourceId:result.exceptionId,before:{},after,requestId,occurredAt:at}});
  await tx.commandReceipt.create({data:{id:randomUUID(),...scope,actorAccountId:actor.accountId,command,key,inputHash,response:result,createdAt:at}});
 }
 private async operatorSchool(tx:Tx,operator:OperatorPrincipal,scope:Scope){
  if(!operator.verified)throw new AccessError('FORBIDDEN');
  const school=await tx.school.findFirst({where:{organizationId:scope.organizationId,id:scope.schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{id:true}});
  if(!school)throw new AccessError('NOT_FOUND');
  await this.module(tx,{organizationId:scope.organizationId,schoolId:scope.schoolId});
 }
 private async operatorAudit(tx:Tx,operator:OperatorPrincipal,command:string,resourceType:string,resourceId:string,details:Prisma.InputJsonValue){
  await tx.operatorAuditEntry.create({data:{id:randomUUID(),operatorId:operator.operatorId,command,resourceType,resourceId,occurredAt:this.now(),details}});
 }

 async grant(operator:OperatorPrincipal,input:Scope&{accountId:string;capability:FinanceCapability;currency:string|null;approvalLimitMinor:bigint|null}){
  if(!operator.verified)throw new AccessError('FORBIDDEN');
  try{return await this.db.$transaction(async tx=>{
   const membership=await tx.schoolMembership.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,accountId:input.accountId,status:'ACTIVE',school:{status:'ACTIVE',organization:{status:'ACTIVE'}}}});
   if(!membership)throw new AccessError('NOT_FOUND');
   const where={organizationId:input.organizationId,schoolId:input.schoolId,accountId:input.accountId,capability:input.capability,currency:input.currency,revokedAt:null};
   const existing=await tx.financeCapabilityGrant.findFirst({where});
   const at=this.now(),row=existing?await tx.financeCapabilityGrant.update({where:{id:existing.id},data:{membershipId:membership.id,approvalLimitMinor:input.approvalLimitMinor,version:{increment:1}}}):await tx.financeCapabilityGrant.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,membershipId:membership.id,accountId:input.accountId,capability:input.capability,currency:input.currency,approvalLimitMinor:input.approvalLimitMinor,grantedByOperatorId:operator.operatorId,grantedAt:at,version:1}});
   await this.operatorAudit(tx,operator,'GrantFinanceCapability','FinanceCapabilityGrant',row.id,{schemaVersion:1,organizationId:input.organizationId,schoolId:input.schoolId,accountId:input.accountId,capability:input.capability,currency:input.currency,approvalLimitMinor:input.approvalLimitMinor?.toString()??null});
   return {grantId:row.id,version:row.version};
  },{isolationLevel:'Serializable'});}catch(error){return fail(error);}
 }

 async postSyntheticEntry(operator:OperatorPrincipal,input:Scope&{kind:'CHARGE'|'PAYMENT';currency:string;amountMinor:bigint;sourceRef:string;providerEventId:string|null;occurredAt:Date}){
  try{return await this.db.$transaction(async tx=>{
   await this.operatorSchool(tx,operator,input);
   const existing=await tx.financeLedgerEntry.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,OR:[{sourceKind:'SYNTHETIC',sourceRef:input.sourceRef},...(input.providerEventId?[{providerEventId:input.providerEventId}]:[])]}});
   if(existing){if(existing.kind!==input.kind||existing.currency!==input.currency||existing.amountMinor!==input.amountMinor||existing.sourceRef!==input.sourceRef||existing.providerEventId!==input.providerEventId||existing.occurredAt.getTime()!==input.occurredAt.getTime())throw new AccessError('IDEMPOTENCY_CONFLICT');return {entryId:existing.id,replayed:true};}
   const row=await tx.financeLedgerEntry.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,kind:input.kind,currency:input.currency,amountMinor:input.amountMinor,sourceKind:'SYNTHETIC',sourceRef:input.sourceRef,providerEventId:input.providerEventId,occurredAt:input.occurredAt,createdAt:this.now()}});
   await this.operatorAudit(tx,operator,'PostSyntheticFinanceEntry','FinanceLedgerEntry',row.id,{schemaVersion:1,organizationId:input.organizationId,schoolId:input.schoolId,kind:input.kind,currency:input.currency,amountMinor:input.amountMinor.toString(),sourceRef:input.sourceRef,synthetic:true});
   return {entryId:row.id,replayed:false};
  },{isolationLevel:'Serializable'});}catch(error){return fail(error);}
 }

 async allocateSynthetic(operator:OperatorPrincipal,input:Scope&{paymentEntryId:string;chargeEntryId:string;amountMinor:bigint}){
  try{return await this.db.$transaction(async tx=>{
   await this.operatorSchool(tx,operator,input);
   await tx.$queryRaw`SELECT id FROM vs_finance_ledger_entry WHERE organization_id=${input.organizationId}::uuid AND school_id=${input.schoolId}::uuid AND id IN (${input.paymentEntryId}::uuid,${input.chargeEntryId}::uuid) ORDER BY id FOR UPDATE`;
   const [payment,charge,existing]=await Promise.all([
    tx.financeLedgerEntry.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,id:input.paymentEntryId,kind:'PAYMENT'}}),
    tx.financeLedgerEntry.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,id:input.chargeEntryId,kind:'CHARGE'}}),
    tx.financeAllocation.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,paymentEntryId:input.paymentEntryId,chargeEntryId:input.chargeEntryId}}),
   ]);
   if(!payment||!charge||payment.currency!==charge.currency)throw new AccessError('VALIDATION');
   if(existing){if(existing.amountMinor!==input.amountMinor)throw new AccessError('IDEMPOTENCY_CONFLICT');return {allocationId:existing.id,replayed:true};}
   const [paymentUsed,chargeUsed]=await Promise.all([
    tx.financeAllocation.aggregate({where:{organizationId:input.organizationId,schoolId:input.schoolId,paymentEntryId:payment.id},_sum:{amountMinor:true}}),
    tx.financeAllocation.aggregate({where:{organizationId:input.organizationId,schoolId:input.schoolId,chargeEntryId:charge.id},_sum:{amountMinor:true}}),
   ]);
   if((paymentUsed._sum.amountMinor??BigInt(0))+input.amountMinor>payment.amountMinor||(chargeUsed._sum.amountMinor??BigInt(0))+input.amountMinor>charge.amountMinor)throw new AccessError('CONFLICT');
   const row=await tx.financeAllocation.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,paymentEntryId:payment.id,chargeEntryId:charge.id,currency:payment.currency,amountMinor:input.amountMinor,createdAt:this.now()}});
   await this.operatorAudit(tx,operator,'AllocateSyntheticFinancePayment','FinanceAllocation',row.id,{schemaVersion:1,organizationId:input.organizationId,schoolId:input.schoolId,currency:payment.currency,amountMinor:input.amountMinor.toString(),synthetic:true});
   return {allocationId:row.id,replayed:false};
  },{isolationLevel:'Serializable'});}catch(error){return fail(error);}
 }

 async reconcileSynthetic(operator:OperatorPrincipal,input:Scope&{currency:string;cutoffAt:Date}){
  try{return await this.db.$transaction(async tx=>{
   await this.operatorSchool(tx,operator,input);
   const entries=await tx.financeLedgerEntry.findMany({where:{organizationId:input.organizationId,schoolId:input.schoolId,currency:input.currency,occurredAt:{lte:input.cutoffAt}},orderBy:[{occurredAt:'asc'},{id:'asc'}]});
   const ids=entries.map(item=>item.id),allocations=ids.length?await tx.financeAllocation.findMany({where:{organizationId:input.organizationId,schoolId:input.schoolId,currency:input.currency,paymentEntryId:{in:ids},chargeEntryId:{in:ids},createdAt:{lte:input.cutoffAt}},orderBy:[{createdAt:'asc'},{id:'asc'}]}):[];
   const zero=BigInt(0),charge=entries.filter(item=>item.kind==='CHARGE').reduce((sum,item)=>sum+item.amountMinor,zero),payment=entries.filter(item=>item.kind==='PAYMENT').reduce((sum,item)=>sum+item.amountMinor,zero),allocated=allocations.reduce((sum,item)=>sum+item.amountMinor,zero),unmatchedCharge=charge-allocated,unallocatedPayment=payment-allocated;
   if(unmatchedCharge<zero||unallocatedPayment<zero)throw new AccessError('CONFLICT');
   const exceptionCount=await tx.financeException.count({where:{organizationId:input.organizationId,schoolId:input.schoolId,currency:input.currency,state:'PENDING',requestedAt:{lte:input.cutoffAt}}}),sourceDigest=digest({entries:entries.map(item=>[item.id,item.kind,item.amountMinor.toString(),item.occurredAt.toISOString()]),allocations:allocations.map(item=>[item.id,item.amountMinor.toString()])}),state=unallocatedPayment===zero?'RECONCILED':'UNRECONCILED',at=this.now();
   const row=await tx.financeReconciliation.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,currency:input.currency,cutoffAt:input.cutoffAt,state,chargeMinor:charge,paymentMinor:payment,allocatedMinor:allocated,unmatchedChargeMinor:unmatchedCharge,unallocatedPaymentMinor:unallocatedPayment,exceptionCount,definitionVersion:1,sourceDigest,createdAt:at}});
   await this.operatorAudit(tx,operator,'ReconcileSyntheticFinance','FinanceReconciliation',row.id,{schemaVersion:1,organizationId:input.organizationId,schoolId:input.schoolId,currency:input.currency,cutoffAt:input.cutoffAt.toISOString(),state,synthetic:true});
   return this.reconciliation(row);
  },{isolationLevel:'Serializable'});}catch(error){return fail(error);}
 }

 private reconciliation(row:{id:string;currency:string;cutoffAt:Date;state:string;definitionVersion:number;sourceDigest:string;chargeMinor:bigint;paymentMinor:bigint;allocatedMinor:bigint;unmatchedChargeMinor:bigint;unallocatedPaymentMinor:bigint;exceptionCount:number}):FinanceSummary{return {reconciliationId:row.id,currency:row.currency,cutoffAt:row.cutoffAt.toISOString(),state:row.state as FinanceSummary['state'],definitionVersion:row.definitionVersion,sourceDigestPrefix:row.sourceDigest.slice(0,12),charge:money(row.currency,row.chargeMinor),payment:money(row.currency,row.paymentMinor),allocated:money(row.currency,row.allocatedMinor),unmatchedCharge:money(row.currency,row.unmatchedChargeMinor),unallocatedPayment:money(row.currency,row.unallocatedPaymentMinor),exceptionCount:row.exceptionCount,syntheticOnly:true};}
 async summary(actor:Identity,scope:Scope,currency:string){return this.db.$transaction(async tx=>{const grants=await this.anyGrant(tx,actor,scope);if(!grants.some(item=>item.capability==='SUMMARY_READ'||item.capability==='EXCEPTION_REQUEST'||item.capability==='EXCEPTION_REVIEW'&&item.currency===currency))throw new AccessError('FORBIDDEN');const row=await tx.financeReconciliation.findFirst({where:{...scope,currency},orderBy:[{cutoffAt:'desc'},{id:'desc'}]});if(!row)throw new AccessError('NOT_FOUND');return this.reconciliation(row);},{isolationLevel:'RepeatableRead'});}
 async reviewers(actor:Identity,scope:Scope,reconciliationId:string):Promise<readonly FinanceReviewer[]>{return this.db.$transaction(async tx=>{await this.grantRow(tx,actor,scope,'EXCEPTION_REQUEST');const reconciliation=await tx.financeReconciliation.findFirst({where:{...scope,id:reconciliationId}});if(!reconciliation)throw new AccessError('NOT_FOUND');const grants=await tx.financeCapabilityGrant.findMany({where:{...scope,capability:'EXCEPTION_REVIEW',currency:reconciliation.currency,revokedAt:null,approvalLimitMinor:{gt:BigInt(0)}},orderBy:{accountId:'asc'}}),items:FinanceReviewer[]=[];for(const grant of grants)if(grant.accountId!==actor.accountId&&await tx.schoolMembership.findFirst({where:{...scope,id:grant.membershipId,accountId:grant.accountId,status:'ACTIVE'}}))items.push({...await this.person(tx,scope.organizationId,grant.accountId),currency:reconciliation.currency,approvalLimitMinor:grant.approvalLimitMinor!.toString()});return items;},{isolationLevel:'RepeatableRead'});}

 async request(actor:Identity,input:Scope&{reconciliationId:string;kind:'CONCESSION'|'REFUND_REQUEST';amountMinor:bigint;reviewerAccountId:string;reason:string;key:string;requestId:string}){
  const scope={organizationId:input.organizationId,schoolId:input.schoolId};
  try{return await this.db.$transaction(async tx=>{
   await this.locks(tx,actor,scope);await this.grantRow(tx,actor,scope,'EXCEPTION_REQUEST');
   const command='FinanceRequestException',inputHash=digest({reconciliationId:input.reconciliationId,kind:input.kind,amountMinor:input.amountMinor.toString(),reviewerAccountId:input.reviewerAccountId,reason:input.reason}),replay=await this.receipt(tx,actor,scope,command,input.key,inputHash);if(replay)return replay;
   if(input.reviewerAccountId===actor.accountId)throw new AccessError('CONFLICT');
   const reconciliation=await tx.financeReconciliation.findFirst({where:{...scope,id:input.reconciliationId}});
   if(!reconciliation)throw new AccessError('NOT_FOUND');
   const reviewer=await tx.financeCapabilityGrant.findFirst({where:{...scope,accountId:input.reviewerAccountId,capability:'EXCEPTION_REVIEW',currency:reconciliation.currency,revokedAt:null}});
   if(!reviewer||reviewer.approvalLimitMinor===null||input.amountMinor>reviewer.approvalLimitMinor||!await tx.schoolMembership.findFirst({where:{...scope,id:reviewer.membershipId,accountId:reviewer.accountId,status:'ACTIVE'}}))throw new AccessError('FORBIDDEN');
   const at=this.now(),row=await tx.financeException.create({data:{id:randomUUID(),...scope,reconciliationId:reconciliation.id,currency:reconciliation.currency,kind:input.kind,amountMinor:input.amountMinor,requesterAccountId:actor.accountId,reviewerAccountId:input.reviewerAccountId,reason:input.reason,state:'PENDING',version:1,requestedAt:at,updatedAt:at}});
   await tx.financeExceptionEvent.create({data:{id:randomUUID(),...scope,exceptionId:row.id,number:1,type:'REQUESTED',fromState:null,toState:'PENDING',actorAccountId:actor.accountId,reason:input.reason,exceptionVersion:1,occurredAt:at}});
   const result:FinanceCommandResult={exceptionId:row.id,state:'PENDING',version:1,replayed:false};await this.record(tx,actor,scope,command,input.key,inputHash,result,input.requestId,{state:'PENDING',kind:input.kind,currency:row.currency,amountMinor:row.amountMinor.toString(),reviewerAccountId:row.reviewerAccountId,consequence:'NO_LEDGER_OR_PAYMENT_CHANGE'});return result;
  },{isolationLevel:'Serializable'});}catch(error){return fail(error);}
 }

 private async authorized(tx:Tx,actor:Identity,scope:Scope,row:{requesterAccountId:string;reviewerAccountId:string;currency:string;amountMinor:bigint}){
  const membership=await this.account(tx,actor,scope);
  if(row.requesterAccountId===actor.accountId){const grant=await tx.financeCapabilityGrant.findFirst({where:{...scope,membershipId:membership.id,accountId:actor.accountId,capability:'EXCEPTION_REQUEST',revokedAt:null}});if(!grant)throw new AccessError('NOT_FOUND');return 'REQUESTER' as const;}
  if(row.reviewerAccountId===actor.accountId){const grant=await tx.financeCapabilityGrant.findFirst({where:{...scope,membershipId:membership.id,accountId:actor.accountId,capability:'EXCEPTION_REVIEW',currency:row.currency,revokedAt:null}});if(!grant||grant.approvalLimitMinor===null||grant.approvalLimitMinor<row.amountMinor)throw new AccessError('NOT_FOUND');return 'REVIEWER' as const;}
  throw new AccessError('NOT_FOUND');
 }
 private async exceptionSummary(tx:Tx,row:{id:string;organizationId:string;schoolId:string;reconciliationId:string;currency:string;kind:string;amountMinor:bigint;reason:string;state:string;version:number;requesterAccountId:string;reviewerAccountId:string;requestedAt:Date;updatedAt:Date},actor:Identity,role?:'REQUESTER'|'REVIEWER'):Promise<FinanceExceptionSummary>{return {id:row.id,reference:`FIN-${row.id.toUpperCase()}`,reconciliationId:row.reconciliationId,currency:row.currency,kind:row.kind as FinanceExceptionSummary['kind'],amountMinor:row.amountMinor.toString(),reason:row.reason,state:row.state as FinanceExceptionState,version:row.version,requester:await this.person(tx,row.organizationId,row.requesterAccountId),reviewer:await this.person(tx,row.organizationId,row.reviewerAccountId),requestedAt:row.requestedAt.toISOString(),updatedAt:row.updatedAt.toISOString(),role:role??(row.requesterAccountId===actor.accountId?'REQUESTER':'REVIEWER')};}
 async list(actor:Identity,scope:Scope){return this.db.$transaction(async tx=>{await this.anyGrant(tx,actor,scope);const rows=await tx.financeException.findMany({where:{...scope,OR:[{requesterAccountId:actor.accountId},{reviewerAccountId:actor.accountId}]},orderBy:[{requestedAt:'desc'},{id:'asc'}]});const result:FinanceExceptionSummary[]=[];for(const row of rows){try{const role=await this.authorized(tx,actor,scope,row);result.push(await this.exceptionSummary(tx,row,actor,role));}catch(error){if(!(error instanceof AccessError)||error.code!=='NOT_FOUND')throw error;}}return result;},{isolationLevel:'RepeatableRead'});}
 async get(actor:Identity,scope:Scope,id:string):Promise<FinanceExceptionDetail>{return this.db.$transaction(async tx=>{const row=await tx.financeException.findFirst({where:{...scope,id}});if(!row)throw new AccessError('NOT_FOUND');const role=await this.authorized(tx,actor,scope,row),[base,reconciliation,events]=await Promise.all([this.exceptionSummary(tx,row,actor,role),tx.financeReconciliation.findFirstOrThrow({where:{id:row.reconciliationId}}),tx.financeExceptionEvent.findMany({where:{...scope,exceptionId:id},orderBy:{number:'asc'}})]),actors=new Map<string,FinanceActor>();for(const accountId of new Set(events.map(event=>event.actorAccountId)))actors.set(accountId,await this.person(tx,scope.organizationId,accountId));return {...base,reconciliation:this.reconciliation(reconciliation),decisionReason:row.decisionReason,decidedAt:row.decidedAt?.toISOString()??null,history:events.map(event=>({number:event.number,type:event.type as 'REQUESTED'|'APPROVED'|'REJECTED',fromState:event.fromState as FinanceExceptionState|null,toState:event.toState as FinanceExceptionState,actor:actors.get(event.actorAccountId)!,reason:event.reason,exceptionVersion:event.exceptionVersion,occurredAt:event.occurredAt.toISOString()})),can:{approve:role==='REVIEWER'&&row.state==='PENDING',reject:role==='REVIEWER'&&row.state==='PENDING'},consequence:'APPROVAL_ONLY_NO_PAYMENT_OR_LEDGER_CHANGE'};},{isolationLevel:'RepeatableRead'});}

 async decide(actor:Identity,input:Scope&{id:string;action:'APPROVE'|'REJECT';expectedVersion:number;reason:string|null;key:string;requestId:string}){
  const scope={organizationId:input.organizationId,schoolId:input.schoolId};
  try{return await this.db.$transaction(async tx=>{
   await this.locks(tx,actor,scope);await tx.$queryRaw`SELECT id FROM vs_finance_exception WHERE organization_id=${scope.organizationId}::uuid AND school_id=${scope.schoolId}::uuid AND id=${input.id}::uuid FOR UPDATE`;
   const row=await tx.financeException.findFirst({where:{...scope,id:input.id}});if(!row)throw new AccessError('NOT_FOUND');const role=await this.authorized(tx,actor,scope,row);if(role!=='REVIEWER')throw new AccessError('FORBIDDEN');
   const command=`Finance${input.action}`,inputHash=digest({exceptionId:input.id,expectedVersion:input.expectedVersion,reason:input.reason}),replay=await this.receipt(tx,actor,scope,command,input.key,inputHash);if(replay)return replay;
   if(row.version!==input.expectedVersion)throw new AccessError('STALE_VERSION');const next=nextFinanceExceptionState(row.state,input.action),at=this.now(),version=row.version+1;
   await tx.financeException.update({where:{id:row.id},data:{state:next,version,decisionReason:input.reason,decidedAt:at,updatedAt:at}});await tx.financeExceptionEvent.create({data:{id:randomUUID(),...scope,exceptionId:row.id,number:version,type:input.action==='APPROVE'?'APPROVED':'REJECTED',fromState:'PENDING',toState:next,actorAccountId:actor.accountId,reason:input.reason,exceptionVersion:version,occurredAt:at}});
   const result:FinanceCommandResult={exceptionId:row.id,state:next,version,replayed:false};await this.record(tx,actor,scope,command,input.key,inputHash,result,input.requestId,{state:next,version,consequence:'APPROVAL_ONLY_NO_PAYMENT_OR_LEDGER_CHANGE'});return result;
  },{isolationLevel:'Serializable'});}catch(error){return fail(error);}
 }
 async status(actor:Identity,scope:Scope,id:string,key:string){return this.db.$transaction(async tx=>{const row=await tx.financeException.findFirst({where:{...scope,id}});if(!row)throw new AccessError('NOT_FOUND');await this.authorized(tx,actor,scope,row);const receipt=await tx.commandReceipt.findFirst({where:{...scope,actorAccountId:actor.accountId,key,command:{startsWith:'Finance'}},orderBy:{createdAt:'desc'}});if(receipt)return {state:'FOUND',result:{...receipt.response as FinanceCommandResult,replayed:true}} as const;return row.version>1?{state:'CHANGED',currentVersion:row.version,currentState:row.state as FinanceExceptionState} as const:{state:'UNKNOWN'} as const;},{isolationLevel:'RepeatableRead'});}
}
