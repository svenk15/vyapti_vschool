import {createHash,randomUUID} from 'node:crypto';
import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity,LeadershipDelegationAction,LeadershipDelegationResult,LeadershipDelegationStatus,LeadershipDelegationSummary,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {EmployeeAccessVerificationPort} from '../../people/contracts/employee-access';
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';
import type {LeadershipDelegationRepository} from '../application/delegations';
import type {DelegatedAuthorityPort} from '../contracts/delegated-authority';
import {AccessError} from '../domain/policy';

function canonical(value:unknown):string{if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;if(value&&typeof value==='object')return `{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;return JSON.stringify(value);}
function digest(value:unknown){return createHash('sha256').update(canonical(value)).digest('hex');}
function schoolDate(at:Date,timezone:string){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(at),part=(type:string)=>parts.find(value=>value.type===type)?.value??'';return `${part('year')}-${part('month')}-${part('day')}`;}
function status(row:{startsAt:Date;endsAt:Date;revokedAt:Date|null},now:Date):LeadershipDelegationStatus{return row.revokedAt?'REVOKED':row.startsAt>now?'SCHEDULED':row.endsAt<=now?'EXPIRED':'ACTIVE';}
function fail(error:unknown):never{if(error instanceof AccessError)throw error;const code=error&&typeof error==='object'&&'code' in error?String(error.code):'';if(code==='P2002')throw new AccessError('CONFLICT');throw new AccessError('UNAVAILABLE');}

export class PrismaLeadershipDelegationRepository implements LeadershipDelegationRepository {
  constructor(
    private readonly db:PrismaClient,
    private readonly context:VerifiedDatabaseContextPort,
    private readonly employees:EmployeeAccessVerificationPort,
    private readonly authority:DelegatedAuthorityPort,
    private readonly now:()=>Date=()=>new Date(),
  ){}

  private summary(row:{id:string;organizationId:string;schoolId:string;accountId:string;employeeId:string;startsAt:Date;endsAt:Date;reason:string;revokedAt:Date|null;version:number;actions:readonly {action:string}[]},displayName:string,at:Date):LeadershipDelegationSummary{return {delegationId:row.id,organizationId:row.organizationId,schoolId:row.schoolId,accountId:row.accountId,employeeId:row.employeeId,displayName,actions:row.actions.map(item=>item.action as LeadershipDelegationAction),startsAt:row.startsAt.toISOString(),endsAt:row.endsAt.toISOString(),status:status(row,at),version:row.version,reason:row.reason,revokedAt:row.revokedAt?.toISOString()??null};}

  async issue(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;employeeId:string;actions:LeadershipDelegationAction[];startsAt:Date;endsAt:Date;reason:string;key:string},requestId:string):Promise<LeadershipDelegationResult>{
    void requestId;
    if(!operator.verified)throw new AccessError('FORBIDDEN');
    try{return await this.db.$transaction(async tx=>{
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${'leadership-delegation:'+input.organizationId+':'+input.schoolId+':'+input.employeeId},0))`;
      const command='IssueLeadershipDelegation',inputHash=digest({schemaVersion:1,...input,startsAt:input.startsAt.toISOString(),endsAt:input.endsAt.toISOString()}),existingReceipt=await tx.accessLeadershipDelegationReceipt.findUnique({where:{organizationId_schoolId_operatorId_command_key:{organizationId:input.organizationId,schoolId:input.schoolId,operatorId:operator.operatorId,command,key:input.key}}});
      if(existingReceipt){if(existingReceipt.inputHash!==inputHash)throw new AccessError('IDEMPOTENCY_CONFLICT');return {...existingReceipt.response as unknown as LeadershipDelegationResult,replayed:true};}
      const school=await tx.school.findFirst({where:{organizationId:input.organizationId,id:input.schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{timezone:true}});if(!school)throw new AccessError('NOT_FOUND');
      const employee=await this.employees.findActiveEmployee(tx,{organizationId:input.organizationId,schoolId:input.schoolId,employeeId:input.employeeId,schoolDate:schoolDate(input.startsAt,school.timezone)});if(!employee)throw new AccessError('NOT_FOUND');
      const binding=await tx.accountPersonBinding.findFirst({where:{organizationId:input.organizationId,personId:employee.personId},select:{accountId:true}});if(!binding)throw new AccessError('NOT_FOUND');
      if(binding.accountId===operator.operatorId)throw new AccessError('FORBIDDEN');
      const membership=await tx.schoolMembership.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,accountId:binding.accountId,status:'ACTIVE'},select:{id:true,account:{select:{status:true}}}});if(!membership||membership.account.status!=='ACTIVE')throw new AccessError('NOT_FOUND');
      const overlap=await tx.accessLeadershipDelegation.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,accountId:binding.accountId,revokedAt:null,startsAt:{lt:input.endsAt},endsAt:{gt:input.startsAt},actions:{some:{action:{in:input.actions}}}},select:{id:true}});if(overlap)throw new AccessError('CONFLICT');
      const at=this.now(),created=await tx.accessLeadershipDelegation.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,membershipId:membership.id,accountId:binding.accountId,employeeId:employee.employeeId,startsAt:input.startsAt,endsAt:input.endsAt,reason:input.reason,issuedByOperatorId:operator.operatorId,issuedAt:at,version:1,actions:{create:input.actions.map(action=>({id:randomUUID(),action}))}},include:{actions:{select:{action:true},orderBy:{action:'asc'}}}}),response:LeadershipDelegationResult={...this.summary(created,employee.displayName,at),replayed:false};
      await tx.accessLeadershipDelegationEvent.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,delegationId:created.id,operatorId:operator.operatorId,kind:'ISSUED',version:1,reason:input.reason,safeDetails:{actions:input.actions,startsAt:input.startsAt.toISOString(),endsAt:input.endsAt.toISOString(),employeeId:employee.employeeId},occurredAt:at}});
      await tx.accessLeadershipDelegationReceipt.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,operatorId:operator.operatorId,command,key:input.key,inputHash,response:response as unknown as Prisma.InputJsonObject,createdAt:at}});
      await tx.outboxEvent.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,module:'access',type:'LeadershipDelegationIssued.v1',schemaVersion:1,aggregateId:created.id,aggregateVersion:1,occurredAt:at,payload:{delegationId:created.id,actions:input.actions,startsAt:input.startsAt.toISOString(),endsAt:input.endsAt.toISOString()},state:'PENDING',attempts:0,availableAt:at}});
      return response;
    },{isolationLevel:'Serializable',timeout:15000,maxWait:10000});}catch(error){return fail(error);}
  }

  async revoke(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;delegationId:string;expectedVersion:number;reason:string;key:string},requestId:string):Promise<LeadershipDelegationResult>{
    void requestId;if(!operator.verified)throw new AccessError('FORBIDDEN');
    try{return await this.db.$transaction(async tx=>{
      const command='RevokeLeadershipDelegation',inputHash=digest({schemaVersion:1,...input}),existingReceipt=await tx.accessLeadershipDelegationReceipt.findUnique({where:{organizationId_schoolId_operatorId_command_key:{organizationId:input.organizationId,schoolId:input.schoolId,operatorId:operator.operatorId,command,key:input.key}}});
      if(existingReceipt){if(existingReceipt.inputHash!==inputHash)throw new AccessError('IDEMPOTENCY_CONFLICT');return {...existingReceipt.response as unknown as LeadershipDelegationResult,replayed:true};}
      await tx.$queryRaw`SELECT id FROM vs_access_leadership_delegation WHERE organization_id=${input.organizationId}::uuid AND school_id=${input.schoolId}::uuid AND id=${input.delegationId}::uuid FOR UPDATE`;
      const current=await tx.accessLeadershipDelegation.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,id:input.delegationId},include:{actions:{select:{action:true},orderBy:{action:'asc'}}}});if(!current)throw new AccessError('NOT_FOUND');if(current.version!==input.expectedVersion)throw new AccessError('STALE_VERSION');if(current.revokedAt)throw new AccessError('CONFLICT');
      const at=this.now(),updated=await tx.accessLeadershipDelegation.update({where:{id:current.id},data:{revokedAt:at,revokedByOperatorId:operator.operatorId,revokeReason:input.reason,version:{increment:1}},include:{actions:{select:{action:true},orderBy:{action:'asc'}}}}),school=await tx.school.findFirst({where:{organizationId:input.organizationId,id:input.schoolId},select:{timezone:true}}),employee=school?await this.employees.findActiveEmployee(tx,{organizationId:input.organizationId,schoolId:input.schoolId,employeeId:updated.employeeId,schoolDate:schoolDate(at,school.timezone)}):null,response:LeadershipDelegationResult={...this.summary(updated,employee?.displayName??'Staff member',at),replayed:false};
      await tx.accessLeadershipDelegationEvent.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,delegationId:current.id,operatorId:operator.operatorId,kind:'REVOKED',version:updated.version,reason:input.reason,safeDetails:{actions:updated.actions.map(row=>row.action),previousVersion:current.version},occurredAt:at}});
      await tx.accessLeadershipDelegationReceipt.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,operatorId:operator.operatorId,command,key:input.key,inputHash,response:response as unknown as Prisma.InputJsonObject,createdAt:at}});
      await tx.outboxEvent.create({data:{id:randomUUID(),organizationId:input.organizationId,schoolId:input.schoolId,module:'access',type:'LeadershipDelegationRevoked.v1',schemaVersion:1,aggregateId:current.id,aggregateVersion:updated.version,occurredAt:at,payload:{delegationId:current.id},state:'PENDING',attempts:0,availableAt:at}});
      return response;
    },{isolationLevel:'Serializable',timeout:15000,maxWait:10000});}catch(error){return fail(error);}
  }

  async listOwn(identity:Identity):Promise<readonly LeadershipDelegationSummary[]>{
    try{return await this.db.$transaction(async tx=>{
      if(!await this.context.establishAccount(tx,identity.accountId,identity.tokenVersion))throw new AccessError('UNAUTHENTICATED');
      const account=await tx.userAccount.findUnique({where:{id:identity.accountId},select:{status:true,tokenVersion:true}});if(!account||account.status!=='ACTIVE'||account.tokenVersion!==identity.tokenVersion)throw new AccessError('UNAUTHENTICATED');
      const at=this.now(),rows=await tx.accessLeadershipDelegation.findMany({where:{accountId:identity.accountId},orderBy:[{issuedAt:'desc'},{id:'desc'}],take:100,include:{actions:{select:{action:true},orderBy:{action:'asc'}}}}),result:LeadershipDelegationSummary[]=[];
      for(const row of rows){const school=await tx.school.findFirst({where:{organizationId:row.organizationId,id:row.schoolId},select:{timezone:true}}),employee=school?await this.employees.findActiveEmployee(tx,{organizationId:row.organizationId,schoolId:row.schoolId,employeeId:row.employeeId,schoolDate:schoolDate(at,school.timezone)}):null;result.push(this.summary(row,employee?.displayName??'Staff member',at));}
      return result;
    },{isolationLevel:'RepeatableRead'});}catch(error){return fail(error);}
  }

  runtime(){return this.authority;}
}
