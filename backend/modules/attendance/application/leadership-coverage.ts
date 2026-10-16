import type {Identity} from '../../../../shared/contracts/access';
import type {LeadershipRegisterCoverage,LeadershipSessionEvidence} from '../../../../shared/contracts/attendance';
import {AccessError,uuidPattern} from '../../access/contracts/index';

export type LeadershipCoverageQuery=Readonly<{date:string|null;classId:string|null;status:'SCHEDULED'|'OPEN'|null;teacherId:string|null;sort:'due'|'class';order:'asc'|'desc';afterDueAt:Date|null;afterClassName:string|null;afterId:string|null;limit:number}>;
export interface LeadershipCoverageRepository {
 get(actor:Identity,organizationId:string,schoolId:string,query:LeadershipCoverageQuery):Promise<LeadershipRegisterCoverage>;
 detail(actor:Identity,organizationId:string,schoolId:string,sessionId:string):Promise<LeadershipSessionEvidence>;
}

const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const date=(value:unknown)=>{if(value===undefined||value===null||value==='')return null;if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(`${value}T00:00:00.000Z`).toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return value;};
function choice<T extends string>(value:unknown,allowed:readonly T[],fallback:T):T{if(value===undefined||value===null||value==='')return fallback;if(typeof value!=='string'||!allowed.includes(value as T))throw new AccessError('VALIDATION');return value as T;}
type CursorSignature=Pick<LeadershipCoverageQuery,'classId'|'status'|'teacherId'|'sort'|'order'>;
function cursor(value:unknown,signature:CursorSignature):Pick<LeadershipCoverageQuery,'afterDueAt'|'afterClassName'|'afterId'>{
 if(value===undefined||value===null||value==='')return {afterDueAt:null,afterClassName:null,afterId:null};
 if(typeof value!=='string'||value.length>512||!/^[A-Za-z0-9_-]+$/.test(value))throw new AccessError('VALIDATION');
 try{const parsed=JSON.parse(Buffer.from(value,'base64url').toString('utf8')) as {classId?:unknown;status?:unknown;teacherId?:unknown;sort?:unknown;order?:unknown;dueAt?:unknown;className?:unknown;id?:unknown},dueAt=typeof parsed.dueAt==='string'?new Date(parsed.dueAt):null;if(parsed.classId!==signature.classId||parsed.status!==signature.status||parsed.teacherId!==signature.teacherId||parsed.sort!==signature.sort||parsed.order!==signature.order||!dueAt||!Number.isFinite(dueAt.getTime())||(signature.sort==='class'&&(typeof parsed.className!=='string'||parsed.className.length>160)))throw new Error();return {afterDueAt:dueAt,afterClassName:signature.sort==='class'?parsed.className as string:null,afterId:id(parsed.id)};}catch{throw new AccessError('VALIDATION');}
}

export function createLeadershipCoverageUseCases(repository:LeadershipCoverageRepository){return {
 get(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:Readonly<{date?:unknown;classId?:unknown;status?:unknown;teacherId?:unknown;sort?:unknown;order?:unknown;cursor?:unknown;limit?:unknown}>={}){
  const limit=input.limit===undefined?25:input.limit;if(typeof limit!=='number'||!Number.isInteger(limit)||limit<1||limit>50)throw new AccessError('VALIDATION');const signature:CursorSignature={classId:input.classId?id(input.classId):null,status:input.status?choice(input.status,['SCHEDULED','OPEN'] as const,'SCHEDULED'):null,teacherId:input.teacherId?id(input.teacherId):null,sort:choice(input.sort,['due','class'] as const,'due'),order:choice(input.order,['asc','desc'] as const,'asc')};
  return repository.get(actor(actorValue),id(organizationId),id(schoolId),{date:date(input.date),...signature,...cursor(input.cursor,signature),limit});
 },
 evidence(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,sessionId:unknown){return repository.detail(actor(actorValue),id(organizationId),id(schoolId),id(sessionId));}
};}
export type LeadershipCoverageFacade=ReturnType<typeof createLeadershipCoverageUseCases>;
