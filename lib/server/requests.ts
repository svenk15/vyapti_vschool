import 'server-only';
import type {Identity} from '../../shared/contracts/access';
import {AccessError} from '../../backend/modules/access/contracts';
import {createRequestsServices} from '../../backend/composition/requests';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {accountGateway} from './access';
import {guardiansGateway} from './guardians';
const requests=createRequestsServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),mode:process.env.VSCHOOL_REQUESTS_MODE==='synthetic'?'synthetic':'disabled'});
const scoped=async(identity:Identity|null)=>{const scope=(await accountGateway.getHome(identity)).scope;return {identity,...scope};};
const familyScoped=async(identity:Identity|null,studentId:string)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');const workspace=await guardiansGateway.workspace(identity),child=workspace.children.find(item=>item.studentId===studentId);if(!child)throw new AccessError('NOT_FOUND');return {identity,organizationId:child.organizationId,schoolId:child.schoolId,studentId:child.studentId};};
export const requestsGateway={
 list:async(identity:Identity|null)=>{const s=await scoped(identity);return requests.list(s.identity,s.organizationId,s.schoolId);},
 get:async(identity:Identity|null,id:string)=>{const s=await scoped(identity);return requests.get(s.identity,s.organizationId,s.schoolId,id);},
 create:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return requests.create(s.identity,s.organizationId,s.schoolId,input);},
 acknowledge:async(identity:Identity|null,id:string,input:unknown)=>{const s=await scoped(identity);return requests.acknowledge(s.identity,s.organizationId,s.schoolId,id,input);},
 decide:async(identity:Identity|null,id:string,input:unknown)=>{const s=await scoped(identity);return requests.decide(s.identity,s.organizationId,s.schoolId,id,input);},
 respond:async(identity:Identity|null,id:string,input:unknown)=>{const s=await scoped(identity);return requests.respond(s.identity,s.organizationId,s.schoolId,id,input);},
 withdraw:async(identity:Identity|null,id:string,input:unknown)=>{const s=await scoped(identity);return requests.withdraw(s.identity,s.organizationId,s.schoolId,id,input);},
 familyList:async(identity:Identity|null,studentId:string)=>{const s=await familyScoped(identity,studentId);return requests.list(s.identity,s.organizationId,s.schoolId);},
 familyGet:async(identity:Identity|null,studentId:string,id:string)=>{const s=await familyScoped(identity,studentId);return requests.get(s.identity,s.organizationId,s.schoolId,id);},
 familyCreate:async(identity:Identity|null,studentId:string,input:unknown)=>{const s=await familyScoped(identity,studentId);return requests.create(s.identity,s.organizationId,s.schoolId,{...(input as Record<string,unknown>),categoryCode:'FAMILY_COMPLAINT',studentId:s.studentId});},
 familyAppeal:async(identity:Identity|null,studentId:string,id:string,input:unknown)=>{const s=await familyScoped(identity,studentId);return requests.appeal(s.identity,s.organizationId,s.schoolId,id,input);},
 familyRespond:async(identity:Identity|null,studentId:string,id:string,input:unknown)=>{const s=await familyScoped(identity,studentId);return requests.respond(s.identity,s.organizationId,s.schoolId,id,input);},
 familyWithdraw:async(identity:Identity|null,studentId:string,id:string,input:unknown)=>{const s=await familyScoped(identity,studentId);return requests.withdraw(s.identity,s.organizationId,s.schoolId,id,input);},
};
export {requests as requestsServices};
