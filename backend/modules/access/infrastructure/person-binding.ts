import {randomUUID} from 'node:crypto';
import type {Prisma} from '../../../../generated/prisma/client';
import {AccessError} from '../contracts/index';
import type {BindingTransaction,VerifiedPersonBindingInput,VerifiedPersonBindingPort} from '../contracts/person-binding';
function txOf(transaction:BindingTransaction){return transaction as Prisma.TransactionClient;}
export class PrismaVerifiedPersonBinding implements VerifiedPersonBindingPort{
 async bind(transaction:BindingTransaction,input:VerifiedPersonBindingInput){
  const tx=txOf(transaction),account=await tx.userAccount.findFirst({where:{id:input.accountId,status:'ACTIVE',emailVerifiedAt:{not:null}},select:{id:true}});
  if(!account)throw new AccessError('CONFLICT');
  const person=await tx.person.findFirst({where:{id:input.personId,organizationId:input.organizationId},select:{id:true}});if(!person)throw new AccessError('NOT_FOUND');
  const membership=await tx.schoolMembership.findFirst({where:{accountId:input.accountId,organizationId:input.organizationId,schoolId:input.schoolId,status:'ACTIVE',grants:{some:{code:'TEACHER'}}},select:{id:true}});if(!membership)throw new AccessError('CONFLICT');
  if(await tx.accountPersonBinding.findFirst({where:{organizationId:input.organizationId,OR:[{accountId:input.accountId},{personId:input.personId}]},select:{id:true}}))throw new AccessError('CONFLICT');
  const binding=await tx.accountPersonBinding.create({data:{id:randomUUID(),organizationId:input.organizationId,accountId:input.accountId,personId:input.personId,verifiedAt:new Date(input.occurredAt),verifiedBy:input.verifiedBy}});
  await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:input.accountId,actorAccountId:input.verifiedBy,kind:'PERSON_BINDING_VERIFIED',occurredAt:new Date(input.occurredAt),requestId:input.requestId,decision:'ALLOW',safeReason:'IDENTITY_CHECK_RECORDED',policySnapshot:{schemaVersion:1,organizationId:input.organizationId,personId:input.personId,verificationReference:input.verificationReference}}});
  return {bindingId:binding.id};
 }
}
