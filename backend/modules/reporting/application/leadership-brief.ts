import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {LeadershipBriefAvailability,LeadershipBriefCommandResult,LeadershipBriefDetail,LeadershipBriefDraftInput,LeadershipBriefCapability} from '../../../../shared/contracts/reporting';
import {AccessError,uuidPattern} from '../../access/contracts/index';

type Scope=Readonly<{organizationId:string;schoolId:string}>;
export type NormalizedBriefDraft=Readonly<{title:string;purpose:string;interpretation:string;nextActions:string|null;snapshotIds:readonly string[];recipientAccountIds:readonly string[];key:string}>;
export interface LeadershipBriefRepository {
 availability(actor:Identity,scope:Scope):Promise<LeadershipBriefAvailability>;
 get(actor:Identity,scope:Scope,briefId:string):Promise<LeadershipBriefDetail>;
 create(actor:Identity,scope:Scope,input:NormalizedBriefDraft):Promise<LeadershipBriefCommandResult>;
 revise(actor:Identity,scope:Scope,briefId:string,expectedVersion:number,input:NormalizedBriefDraft):Promise<LeadershipBriefCommandResult>;
 finalize(actor:Identity,scope:Scope,briefId:string,expectedVersion:number,key:string):Promise<LeadershipBriefCommandResult>;
 share(actor:Identity,scope:Scope,briefId:string,expectedVersion:number,key:string):Promise<LeadershipBriefCommandResult>;
 withdraw(actor:Identity,scope:Scope,briefId:string,expectedVersion:number,reason:string,key:string):Promise<LeadershipBriefCommandResult>;
 grant(operator:OperatorPrincipal,input:Readonly<{organizationId:string;accountId:string;capability:LeadershipBriefCapability}>):Promise<Readonly<{grantId:string;version:number}>>;
 revoke(operator:OperatorPrincipal,input:Readonly<{organizationId:string;accountId:string;capability:LeadershipBriefCapability}>):Promise<Readonly<{grantId:string;version:number}>>;
}

const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const version=(value:unknown)=>{if(!Number.isSafeInteger(value)||Number(value)<1)throw new AccessError('VALIDATION');return Number(value);};
const intent=(value:unknown)=>id(value);
const text=(value:unknown,max:number,optional=false)=>{if(value===undefined&&optional)return null;if(typeof value!=='string')throw new AccessError('VALIDATION');const result=value.normalize('NFC').trim();if((!result&&!optional)||result.length>max||/[\u0000-\u001f]/.test(result))throw new AccessError('VALIDATION');return result||null;};
function draft(value:LeadershipBriefDraftInput):NormalizedBriefDraft{const snapshots=value.snapshotIds,recipients=value.recipientAccountIds;if(!Array.isArray(snapshots)||snapshots.length<1||snapshots.length>20||new Set(snapshots).size!==snapshots.length||snapshots.some(item=>!uuidPattern.test(item))||!Array.isArray(recipients)||recipients.length<1||recipients.length>20||new Set(recipients).size!==recipients.length||recipients.some(item=>!uuidPattern.test(item)))throw new AccessError('VALIDATION');return {title:text(value.title,160)!,purpose:text(value.purpose,200)!,interpretation:text(value.interpretation,4000)!,nextActions:text(value.nextActions,2000,true),snapshotIds:[...snapshots],recipientAccountIds:[...recipients],key:intent(value.key)};}
const capability=(value:unknown)=>{if(value!=='GENERATE'&&value!=='SHARE')throw new AccessError('VALIDATION');return value;};

export function createLeadershipBriefUseCases(repository:LeadershipBriefRepository){return {
 briefAvailability(actorValue:Identity|null,organizationId:unknown,schoolId:unknown){return repository.availability(actor(actorValue),{organizationId:id(organizationId),schoolId:id(schoolId)});},
 getBrief(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,briefId:unknown){return repository.get(actor(actorValue),{organizationId:id(organizationId),schoolId:id(schoolId)},id(briefId));},
 createBrief(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:LeadershipBriefDraftInput){return repository.create(actor(actorValue),{organizationId:id(organizationId),schoolId:id(schoolId)},draft(input));},
 reviseBrief(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,briefId:unknown,expectedVersion:unknown,input:LeadershipBriefDraftInput){return repository.revise(actor(actorValue),{organizationId:id(organizationId),schoolId:id(schoolId)},id(briefId),version(expectedVersion),draft(input));},
 finalizeBrief(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,briefId:unknown,input:{expectedVersion:unknown;key:unknown}){return repository.finalize(actor(actorValue),{organizationId:id(organizationId),schoolId:id(schoolId)},id(briefId),version(input.expectedVersion),intent(input.key));},
 shareBrief(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,briefId:unknown,input:{expectedVersion:unknown;key:unknown}){return repository.share(actor(actorValue),{organizationId:id(organizationId),schoolId:id(schoolId)},id(briefId),version(input.expectedVersion),intent(input.key));},
 withdrawBrief(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,briefId:unknown,input:{expectedVersion:unknown;reason:unknown;key:unknown}){return repository.withdraw(actor(actorValue),{organizationId:id(organizationId),schoolId:id(schoolId)},id(briefId),version(input.expectedVersion),text(input.reason,500)!,intent(input.key));},
 grantBriefCapability(operator:OperatorPrincipal,input:{organizationId:unknown;accountId:unknown;capability:unknown}){return repository.grant(operator,{organizationId:id(input.organizationId),accountId:id(input.accountId),capability:capability(input.capability)});},
 revokeBriefCapability(operator:OperatorPrincipal,input:{organizationId:unknown;accountId:unknown;capability:unknown}){return repository.revoke(operator,{organizationId:id(input.organizationId),accountId:id(input.accountId),capability:capability(input.capability)});}
};}
