import type {Identity} from '../../../../shared/contracts/access';
import type {AttendanceCancelResult,AttendanceCommandStatus,AttendanceCorrectionResult,AttendanceHistory,AttendanceMarkEntry,AttendanceOpenResult,AttendanceSessionRecord,AttendanceSubmitResult} from '../../../../shared/contracts/attendance';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {cancelSessionInput,commandStatusInput,correctSessionInput,openSessionInput,submitSessionInput} from '../domain/roll-call';

export type SessionRecord=AttendanceSessionRecord;
export interface SessionRepository {
 authorizeAdmin(actor:Identity,organizationId:string,schoolId:string):Promise<void>;
 schedule(actor:Identity,organizationId:string,schoolId:string,input:{offeringId:string;schoolDate:string;startsAt:string;endsAt:string;occurrenceKey:string;key:string;reason:string}):Promise<SessionRecord & {replayed:boolean}>;
 open(actor:Identity,organizationId:string,schoolId:string,sessionId:string,input:{expectedVersion:number;key:string}):Promise<AttendanceOpenResult>;
 submit(actor:Identity,organizationId:string,schoolId:string,sessionId:string,input:{expectedVersion:number;rosterRevision:string;entries:readonly AttendanceMarkEntry[];key:string}):Promise<AttendanceSubmitResult>;
 correct(actor:Identity,organizationId:string,schoolId:string,sessionId:string,input:{expectedVersion:number;changes:readonly AttendanceMarkEntry[];reason:string;key:string}):Promise<AttendanceCorrectionResult>;
 cancel(actor:Identity,organizationId:string,schoolId:string,sessionId:string,input:{expectedVersion:number;reason:string;key:string}):Promise<AttendanceCancelResult>;
 commandStatus(actor:Identity,organizationId:string,schoolId:string,command:'attendance.submit'|'attendance.cancel',key:string):Promise<AttendanceCommandStatus>;
 history(actor:Identity,organizationId:string,schoolId:string,sessionId:string):Promise<AttendanceHistory>;
 schoolDay(actor:Identity,organizationId:string,schoolId:string,date:string):Promise<SessionRecord[]>;
 teacherDay(actor:Identity,organizationId:string,schoolId:string,date:string):Promise<SessionRecord[]>;
 detail(actor:Identity,organizationId:string,schoolId:string,sessionId:string):Promise<SessionRecord>;
}
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(v:unknown)=>{if(typeof v!=='string'||!uuidPattern.test(v))throw new AccessError('VALIDATION');return v;};
const text=(v:unknown,max:number)=>{if(typeof v!=='string')throw new AccessError('VALIDATION');const s=v.normalize('NFC').trim();if(!s||s.length>max||/[\u0000-\u001f]/.test(s))throw new AccessError('VALIDATION');return s;};
const date=(v:unknown)=>{const d=typeof v==='string'?new Date(`${v}T00:00:00Z`):null;if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||!d||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==v)throw new AccessError('VALIDATION');return v;};
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
  history(raw:Identity|null,org:unknown,school:unknown,session:unknown){const s=scope(raw,org,school);return repo.history(s.actor,s.organizationId,s.schoolId,id(session));},
  schoolDay(raw:Identity|null,org:unknown,school:unknown,day:unknown){const s=scope(raw,org,school);return repo.schoolDay(s.actor,s.organizationId,s.schoolId,date(day));},
  teacherDay(raw:Identity|null,org:unknown,school:unknown,day:unknown){const s=scope(raw,org,school);return repo.teacherDay(s.actor,s.organizationId,s.schoolId,date(day));},
  detail(raw:Identity|null,org:unknown,school:unknown,session:unknown){const s=scope(raw,org,school);return repo.detail(s.actor,s.organizationId,s.schoolId,id(session));}
 };
}
export type AttendanceFacade=ReturnType<typeof createAttendanceUseCases>;
