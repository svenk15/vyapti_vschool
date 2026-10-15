import type {Identity} from '../../../../shared/contracts/access';
import type {LeadershipRegisterCoverage} from '../../../../shared/contracts/attendance';
import {AccessError,uuidPattern} from '../../access/contracts/index';

export type LeadershipCoverageQuery=Readonly<{date:string|null;afterDueAt:Date|null;afterId:string|null;limit:number}>;
export interface LeadershipCoverageRepository { get(actor:Identity,organizationId:string,schoolId:string,query:LeadershipCoverageQuery):Promise<LeadershipRegisterCoverage>; }

const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const date=(value:unknown)=>{if(value===undefined||value===null||value==='')return null;if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(`${value}T00:00:00.000Z`).toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return value;};
function cursor(value:unknown):Pick<LeadershipCoverageQuery,'afterDueAt'|'afterId'>{
 if(value===undefined||value===null||value==='')return {afterDueAt:null,afterId:null};
 if(typeof value!=='string'||value.length>256||!/^[A-Za-z0-9_-]+$/.test(value))throw new AccessError('VALIDATION');
 try{const parsed=JSON.parse(Buffer.from(value,'base64url').toString('utf8')) as {dueAt?:unknown;id?:unknown},dueAt=typeof parsed.dueAt==='string'?new Date(parsed.dueAt):null;if(!dueAt||!Number.isFinite(dueAt.getTime()))throw new Error();return {afterDueAt:dueAt,afterId:id(parsed.id)};}catch{throw new AccessError('VALIDATION');}
}

export function createLeadershipCoverageUseCases(repository:LeadershipCoverageRepository){return {
 get(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:Readonly<{date?:unknown;cursor?:unknown;limit?:unknown}>={}){
  const limit=input.limit===undefined?25:input.limit;if(typeof limit!=='number'||!Number.isInteger(limit)||limit<1||limit>50)throw new AccessError('VALIDATION');
  return repository.get(actor(actorValue),id(organizationId),id(schoolId),{date:date(input.date),...cursor(input.cursor),limit});
 }
};}
export type LeadershipCoverageFacade=ReturnType<typeof createLeadershipCoverageUseCases>;
