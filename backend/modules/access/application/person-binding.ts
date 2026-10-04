import {AccessError,uuidPattern} from '../contracts/index';
import type {VerifiedPersonBindingInput,VerifiedPersonBindingPort} from '../contracts/person-binding';
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
export function createVerifiedPersonBindingUseCases(port:VerifiedPersonBindingPort){return {
 bind(transaction:object,input:Omit<VerifiedPersonBindingInput,'organizationId'|'schoolId'|'accountId'|'personId'|'verifiedBy'> & {organizationId:unknown;schoolId:unknown;accountId:unknown;personId:unknown;verifiedBy:unknown}){
  if(!transaction||typeof transaction!=='object')throw new AccessError('UNAVAILABLE');
  const reference=input.verificationReference.normalize('NFC').trim();if(reference.length<3||reference.length>80||/[\u0000-\u001f\u007f]/.test(reference))throw new AccessError('VALIDATION');
  if(typeof input.occurredAt!=='string'||!Number.isFinite(Date.parse(input.occurredAt))||typeof input.requestId!=='string'||!uuidPattern.test(input.requestId))throw new AccessError('VALIDATION');
  return port.bind(transaction,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId),personId:id(input.personId),verifiedBy:id(input.verifiedBy),verificationReference:reference,occurredAt:input.occurredAt,requestId:input.requestId});
 }
};}
