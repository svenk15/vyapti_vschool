import type {Identity} from '../../../../shared/contracts/access';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {decisionOwners,type DecisionOwner,type DecisionQueue} from '../../../../shared/contracts/decisions';
import type {DecisionCommand,DecisionListInput,DecisionOwnerAdapter} from '../contracts/decisions';
export type {DecisionCommand,DecisionListInput,DecisionOwnerAdapter} from '../contracts/decisions';
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const owner=(value:unknown)=>{if(typeof value!=='string'||!decisionOwners.includes(value as DecisionOwner))throw new AccessError('NOT_FOUND');return value as DecisionOwner;};
const command=(value:unknown):DecisionCommand=>{if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');const record=value as Record<string,unknown>;if(Object.keys(record).some(key=>!['action','expectedVersion','reason','key'].includes(key)))throw new AccessError('VALIDATION');if(record.action!=='VERIFY'&&record.action!=='RETURN')throw new AccessError('VALIDATION');if(typeof record.expectedVersion!=='number'||!Number.isInteger(record.expectedVersion)||record.expectedVersion<1)throw new AccessError('VALIDATION');if(typeof record.key!=='string'||record.key.length<16||record.key.length>100||!/^[-A-Za-z0-9_:.]+$/.test(record.key))throw new AccessError('VALIDATION');const reason=record.reason===null||record.reason===undefined||record.reason===''?null:typeof record.reason==='string'?record.reason.normalize('NFC').trim():null;if((record.action==='RETURN'&&!reason)||(reason&&reason.length>1000)||reason&&/[\u0000-\u001f\u007f]/.test(reason))throw new AccessError('VALIDATION');return {action:record.action,expectedVersion:record.expectedVersion,reason,key:record.key};};

export function createDecisionInboxUseCases(adapters:readonly DecisionOwnerAdapter[]){
 const registry=new Map(adapters.map(adapter=>[adapter.owner,adapter]));
 if(registry.size!==adapters.length)throw new Error('Duplicate decision owner adapter');
 const actor=(value:Identity|null)=>{if(!value)throw new AccessError('UNAUTHENTICATED');return value;};
 const adapter=(value:unknown)=>{const code=owner(value),found=registry.get(code);if(!found)throw new AccessError('NOT_FOUND');return found;};
 return {
  async list(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:DecisionListInput={}):Promise<DecisionQueue>{const current=actor(identity),org=id(organizationId),school=id(schoolId);if(adapters.length===0)return {items:[],nextCursor:null,timezone:'UTC',owners:[]};const results=await Promise.allSettled(adapters.map(item=>item.list(current,org,school,input))),available=results.flatMap(result=>result.status==='fulfilled'?[result.value]:[]);if(!available.length)throw new AccessError('FORBIDDEN');return {items:available.flatMap(result=>result.items).sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt)||b.itemId.localeCompare(a.itemId)),nextCursor:available.length===1?available[0].nextCursor:null,timezone:available[0].timezone,owners:adapters.map(item=>item.owner)};},
  async get(identity:Identity|null,organizationId:unknown,schoolId:unknown,ownerValue:unknown,itemId:unknown){return adapter(ownerValue).get(actor(identity),id(organizationId),id(schoolId),id(itemId));},
  async decide(identity:Identity|null,organizationId:unknown,schoolId:unknown,ownerValue:unknown,itemId:unknown,input:unknown){return adapter(ownerValue).decide(actor(identity),id(organizationId),id(schoolId),id(itemId),command(input));},
 };
}
export type DecisionInboxFacade=ReturnType<typeof createDecisionInboxUseCases>;
