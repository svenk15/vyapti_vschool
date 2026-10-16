import type {Identity} from '../../../../shared/contracts/access';
import type {AttendanceCancelResult,AttendanceCommandStatus,AttendanceCorrectionResult,AttendanceHistory,AttendanceMarkEntry,AttendanceOpenResult,AttendanceSessionRecord,AttendanceSubmitResult,TeacherAttendanceHistory} from '../../../../shared/contracts/attendance';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {cancelSessionInput,commandStatusInput,correctSessionInput,openSessionInput,submitSessionInput} from '../domain/roll-call';

export type SessionRecord=AttendanceSessionRecord;
export type TeacherHistoryQuery=Readonly<{q:string;by:'subject'|'class'|'date';offeringId:string|null;date:string|null;statuses:readonly ('SCHEDULED'|'OPEN'|'SUBMITTED')[];sort:'date'|'subject'|'class';order:'asc'|'desc';offset:number;limit:number}>;
export interface SessionRepository {
 authorizeAdmin(actor:Identity,organizationId:string,schoolId:string):Promise<void>;
 schedule(actor:Identity,organizationId:string,schoolId:string,input:{offeringId:string;schoolDate:string;startsAt:string;endsAt:string;occurrenceKey:string;key:string;reason:string}):Promise<SessionRecord & {replayed:boolean}>;
 open(actor:Identity,organizationId:string,schoolId:string,sessionId:string,input:{expectedVersion:number;key:string}):Promise<AttendanceOpenResult>;
 submit(actor:Identity,organizationId:string,schoolId:string,sessionId:string,input:{expectedVersion:number;rosterRevision:string;entries:readonly AttendanceMarkEntry[];key:string}):Promise<AttendanceSubmitResult>;
 correct(actor:Identity,organizationId:string,schoolId:string,sessionId:string,input:{expectedVersion:number;changes:readonly AttendanceMarkEntry[];reason:string;key:string}):Promise<AttendanceCorrectionResult>;
 cancel(actor:Identity,organizationId:string,schoolId:string,sessionId:string,input:{expectedVersion:number;reason:string;key:string}):Promise<AttendanceCancelResult>;
 commandStatus(actor:Identity,organizationId:string,schoolId:string,command:'attendance.submit'|'attendance.cancel',key:string):Promise<AttendanceCommandStatus>;
 history(actor:Identity,organizationId:string,schoolId:string,sessionId:string,pagination?:{beforeNumber:number|null;limit:number}):Promise<AttendanceHistory>;
 schoolDay(actor:Identity,organizationId:string,schoolId:string,date:string):Promise<SessionRecord[]>;
  teacherDay(actor:Identity,organizationId:string,schoolId:string,date:string):Promise<SessionRecord[]>;
  teacherHistory(actor:Identity,organizationId:string,schoolId:string,query:TeacherHistoryQuery):Promise<TeacherAttendanceHistory>;
 detail(actor:Identity,organizationId:string,schoolId:string,sessionId:string):Promise<SessionRecord>;
}
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(v:unknown)=>{if(typeof v!=='string'||!uuidPattern.test(v))throw new AccessError('VALIDATION');return v;};
const text=(v:unknown,max:number)=>{if(typeof v!=='string')throw new AccessError('VALIDATION');const s=v.normalize('NFC').trim();if(!s||s.length>max||/[\u0000-\u001f]/.test(s))throw new AccessError('VALIDATION');return s;};
const date=(v:unknown)=>{const d=typeof v==='string'?new Date(`${v}T00:00:00Z`):null;if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||!d||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==v)throw new AccessError('VALIDATION');return v;};
const oneOf=<T extends string>(value:unknown,allowed:readonly T[],fallback:T):T=>value===undefined||value===null||value===''?fallback:typeof value==='string'&&allowed.includes(value as T)?value as T:(()=>{throw new AccessError('VALIDATION');})();
const teacherHistoryQuery=(input:Readonly<Record<string,unknown>>):TeacherHistoryQuery=>{
 const q=input.q===undefined?'':typeof input.q==='string'?input.q.normalize('NFC').trim():(()=>{throw new AccessError('VALIDATION');})();if(q.length>100||/[\u0000-\u001f]/.test(q))throw new AccessError('VALIDATION');
 const rawStatuses=input.status===undefined||input.status===''?[]:Array.isArray(input.status)?input.status:[input.status],statuses=[...new Set(rawStatuses.map(value=>oneOf(value,['SCHEDULED','OPEN','SUBMITTED'] as const,'SCHEDULED')))];
 let offset=0;if(input.cursor!==undefined&&input.cursor!==null&&input.cursor!==''){if(typeof input.cursor!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(input.cursor))throw new AccessError('VALIDATION');try{const raw=Buffer.from(input.cursor,'base64url').toString('utf8');if(!/^\d{1,6}$/.test(raw))throw new Error();offset=Number(raw);}catch{throw new AccessError('VALIDATION');}}
 return {q,by:oneOf(input.by,['subject','class','date'] as const,'subject'),offeringId:input.offeringId===undefined||input.offeringId===null||input.offeringId===''?null:id(input.offeringId),date:input.date===undefined||input.date===null||input.date===''?null:date(input.date),statuses,sort:oneOf(input.sort,['date','subject','class'] as const,'date'),order:oneOf(input.order,['asc','desc'] as const,'desc'),offset,limit:25};
};
export function createAttendanceUseCases(repo:SessionRepository){
 const scope=(raw:Identity|null,org:unknown,school:unknown)=>({actor:actor(raw),organizationId:id(org),schoolId:id(school)});
 return {
  authorizeAdmin(raw:Identity|null,org:unknown,school:unknown){const s=scope(raw,org,school);return repo.authorizeAdmin(s.actor,s.organizationId,s.schoolId);},
  schedule(raw:Identity|null,org:unknown,school:unknown,input:{offeringId:unknown;schoolDate:unknown;startsAt:unknown;endsAt:unknown;occurrenceKey:unknown;key:unknown;reason:unknown}){const s=scope(raw,org,school);return repo.schedule(s.actor,s.organizationId,s.schoolId,{offeringId:id(input.offeringId),schoolDate:date(input.schoolDate),startsAt:text(input.startsAt,40),endsAt:text(input.endsAt,40),occurrenceKey:text(input.occurrenceKey,80),key:id(input.key),reason:text(input.reason,500)});},
  open(raw:Identity|null,org:unknown,school:unknown,session:unknown,input:{expectedVersion:unknown;key:unknown}){const s=scope(raw,org,school);return repo.open(s.actor,s.organizationId,s.schoolId,id(session),openSessionInput(input));},
  submit(raw:Identity|null,org:unknown,school:unknown,session:unknown,input:{expectedVersion:unknown;rosterRevision:unknown;entries:unknown;key:unknown}){const s=scope(raw,org,school);return repo.submit(s.actor,s.organizationId,s.schoolId,id(session),submitSessionInput(input));},
  correct(raw:Identity|null,org:unknown,school:unknown,session:unknown,input:{expectedVersion:unknown;changes:unknown;reason:unknown;key:unknown}){const s=scope(raw,org,school);return repo.correct(s.actor,s.organizationId,s.schoolId,id(session),correctSessionInput(input));},
  cancel(raw:Identity|null,org:unknown,school:unknown,session:unknown,input:{expectedVersion:unknown;reason:unknown;key:unknown}){const s=scope(raw,org,school);return repo.cancel(s.actor,s.organizationId,s.schoolId,id(session),cancelSessionInput(input));},
  commandStatus(raw:Identity|null,org:unknown,school:unknown,command:unknown,keyValue:unknown){const s=scope(raw,org,school),request=commandStatusInput(command,keyValue);return repo.commandStatus(s.actor,s.organizationId,s.schoolId,request.command,request.key);},
  history(raw:Identity|null,org:unknown,school:unknown,session:unknown,pagination?:{cursor?:unknown;limit?:unknown}){const s=scope(raw,org,school);if(pagination===undefined)return repo.history(s.actor,s.organizationId,s.schoolId,id(session));let beforeNumber:number|null=null;if(pagination.cursor!==undefined&&pagination.cursor!==null&&pagination.cursor!==''){if(typeof pagination.cursor!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(pagination.cursor))throw new AccessError('VALIDATION');try{const decoded=Buffer.from(pagination.cursor,'base64url').toString('utf8');if(!/^[1-9]\d{0,8}$/.test(decoded))throw new Error();beforeNumber=Number(decoded);}catch{throw new AccessError('VALIDATION');}}const limit=pagination.limit===undefined?50:pagination.limit;if(typeof limit!=='number'||!Number.isInteger(limit)||limit<1||limit>100)throw new AccessError('VALIDATION');return repo.history(s.actor,s.organizationId,s.schoolId,id(session),{beforeNumber,limit});},
  schoolDay(raw:Identity|null,org:unknown,school:unknown,day:unknown){const s=scope(raw,org,school);return repo.schoolDay(s.actor,s.organizationId,s.schoolId,date(day));},
	  teacherDay(raw:Identity|null,org:unknown,school:unknown,day:unknown){const s=scope(raw,org,school);return repo.teacherDay(s.actor,s.organizationId,s.schoolId,date(day));},
	  teacherHistory(raw:Identity|null,org:unknown,school:unknown,input:Readonly<Record<string,unknown>>){const s=scope(raw,org,school);return repo.teacherHistory(s.actor,s.organizationId,s.schoolId,teacherHistoryQuery(input));},
  detail(raw:Identity|null,org:unknown,school:unknown,session:unknown){const s=scope(raw,org,school);return repo.detail(s.actor,s.organizationId,s.schoolId,id(session));}
 };
}
export type AttendanceFacade=ReturnType<typeof createAttendanceUseCases>;
