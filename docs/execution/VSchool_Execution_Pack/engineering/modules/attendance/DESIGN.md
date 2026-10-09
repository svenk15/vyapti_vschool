# Attendance — concrete engineering LLD

## Responsibility and aggregate boundary
Session schedule, frozen roster, submission/correction. Aggregates/owned records: AttendanceSession, SessionRosterEntry, AttendanceRecord, AttendanceRevision. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** Teacher current identity+dated assignment grants marking. Complete pinned roster only; use tenant receipt store. Teacher history differs from admin history. See critical workflow chapter.

## Input facades and cross-owner ports
- `backend/modules/attendance/application/sessions.ts`
- `backend/modules/attendance/contracts/scheduled-sessions.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/attendance/application/sessions.ts

```ts
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
 history(actor:Identity,organizationId:string,schoolId:string,sessionId:string,pagination?:{beforeNumber:number|null;limit:number}):Promise<AttendanceHistory>;
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
  history(raw:Identity|null,org:unknown,school:unknown,session:unknown,pagination?:{cursor?:unknown;limit?:unknown}){const s=scope(raw,org,school);if(pagination===undefined)return repo.history(s.actor,s.organizationId,s.schoolId,id(session));let beforeNumber:number|null=null;if(pagination.cursor!==undefined&&pagination.cursor!==null&&pagination.cursor!==''){if(typeof pagination.cursor!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(pagination.cursor))throw new AccessError('VALIDATION');try{const decoded=Buffer.from(pagination.cursor,'base64url').toString('utf8');if(!/^[1-9]\d{0,8}$/.test(decoded))throw new Error();beforeNumber=Number(decoded);}catch{throw new AccessError('VALIDATION');}}const limit=pagination.limit===undefined?50:pagination.limit;if(typeof limit!=='number'||!Number.isInteger(limit)||limit<1||limit>100)throw new AccessError('VALIDATION');return repo.history(s.actor,s.organizationId,s.schoolId,id(session),{beforeNumber,limit});},
  schoolDay(raw:Identity|null,org:unknown,school:unknown,day:unknown){const s=scope(raw,org,school);return repo.schoolDay(s.actor,s.organizationId,s.schoolId,date(day));},
  teacherDay(raw:Identity|null,org:unknown,school:unknown,day:unknown){const s=scope(raw,org,school);return repo.teacherDay(s.actor,s.organizationId,s.schoolId,date(day));},
  detail(raw:Identity|null,org:unknown,school:unknown,session:unknown){const s=scope(raw,org,school);return repo.detail(s.actor,s.organizationId,s.schoolId,id(session));}
 };
}
export type AttendanceFacade=ReturnType<typeof createAttendanceUseCases>;

```

### backend/modules/attendance/contracts/scheduled-sessions.ts

```ts
export interface ScheduledSessionQuery {
 hasAny(organizationId:string,schoolId:string):Promise<boolean>;
 calendarPublicationAffectsSessions?(input:{organizationId:string;schoolId:string;yearId:string;startsOn:string;endsOn:string;teachingWeekdays:readonly number[];exceptions:readonly {date:string;campusId:string|null;isTeachingDay:boolean;label:string}[]}):Promise<boolean>;
 hasPendingSessions?(input:{organizationId:string;schoolId:string;yearId:string;onOrAfter:string}):Promise<boolean>;
 hasFutureAssignmentSessions?(input:{organizationId:string;schoolId:string;assignmentId:string;onOrAfter:string}):Promise<boolean>;
}

```

## Output adapters

- `backend/modules/attendance/infrastructure/scheduled-sessions.ts`
- `backend/modules/attendance/infrastructure/sessions.ts`

## Pure domain rules

- `backend/modules/attendance/domain/roll-call.ts`
- `backend/modules/attendance/domain/schedule.ts`

## Physical data

- `vs_attendance_session` — One actual offering occurrence; retains calendar version and scope. School timezone used to validate local date.; see database/tables/vs_attendance_session.md
- `vs_attendance_session_roster_entry` — Exact membership, versions and minimal name/roll display frozen at OPEN. Access remains current. No mutable roster after OPEN in Phase 1.; see database/tables/vs_attendance_session_roster_entry.md
- `vs_attendance_record` — Current submitted status; one per roster pupil. No blank record stored before submit.; see database/tables/vs_attendance_record.md
- `vs_attendance_revision` — Immutable status diff with old/new values and affected student IDs; SUBMIT includes the complete initial status set and counts. No names, roll values or raw private notes in changes.; see database/tables/vs_attendance_revision.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/attendance/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
