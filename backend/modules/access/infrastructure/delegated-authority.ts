import type {Prisma} from '../../../../generated/prisma/client';
import type {Identity,LeadershipDelegationAction} from '../../../../shared/contracts/access';
import type {EmployeeAccessVerificationPort} from '../../people/contracts/employee-access';
import type {DelegatedAuthorityPort,DelegatedAuthorityTransaction} from '../contracts/delegated-authority';
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';

function txOf(transaction:DelegatedAuthorityTransaction){return transaction as Prisma.TransactionClient;}
function schoolDate(at:Date,timezone:string){
  const values=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(at);
  const part=(type:string)=>values.find(value=>value.type===type)?.value??'';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export class PrismaDelegatedAuthority implements DelegatedAuthorityPort {
  constructor(
    private readonly context:VerifiedDatabaseContextPort,
    private readonly employees:EmployeeAccessVerificationPort,
  ){}

  async resolve(transaction:DelegatedAuthorityTransaction,actor:Identity,input:{organizationId:string;schoolId:string;requiredAction:LeadershipDelegationAction;at:Date}){
    const tx=txOf(transaction);
    if(!await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:input.organizationId,branchId:input.schoolId}))return null;
    const [account,membership,school,binding]=await Promise.all([
      tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
      tx.schoolMembership.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{id:true}}),
      tx.school.findFirst({where:{organizationId:input.organizationId,id:input.schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{timezone:true}}),
      tx.accountPersonBinding.findFirst({where:{organizationId:input.organizationId,accountId:actor.accountId},select:{personId:true}}),
    ]);
    if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion||!membership||!school||!binding)return null;
    const employee=await this.employees.findActiveEmployeeByPerson(tx,{organizationId:input.organizationId,schoolId:input.schoolId,personId:binding.personId,schoolDate:schoolDate(input.at,school.timezone)});
    if(!employee)return null;
    const delegation=await tx.accessLeadershipDelegation.findFirst({
      where:{organizationId:input.organizationId,schoolId:input.schoolId,accountId:actor.accountId,membershipId:membership.id,employeeId:employee.employeeId,revokedAt:null,startsAt:{lte:input.at},endsAt:{gt:input.at},actions:{some:{action:input.requiredAction}}},
      orderBy:[{endsAt:'asc'},{id:'asc'}],
      include:{actions:{select:{action:true},orderBy:{action:'asc'}}},
    });
    if(!delegation)return null;
    return {delegationId:delegation.id,membershipId:delegation.membershipId,startsAt:delegation.startsAt,endsAt:delegation.endsAt,actions:delegation.actions.map(row=>row.action as LeadershipDelegationAction)};
  }
}
