# Academics — concrete engineering LLD

## Responsibility and aggregate boundary
Year/calendar, sections/offerings and dated teaching eligibility. Aggregates/owned records: AcademicYear, AcademicTerm, GradeLevel, Subject, Section, Teacher, CourseOffering, TeacherAssignment, SchoolCalendar, CalendarRevision, CalendarException. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** Preserve inclusive-UI/exclusive-storage date contracts, published calendar immutability, teacher-person overlap semantics and owner attendance-impact checks. Timetable candidate schema remains separate design work.

## Input facades and cross-owner ports
- `backend/modules/academics/application/offerings.ts`
- `backend/modules/academics/application/setup.ts`
- `backend/modules/academics/application/teacher-profile.ts`
- `backend/modules/academics/contracts/teacher-profile.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/academics/application/offerings.ts

```ts
import type {Identity} from '../../../../shared/contracts/access';
import type {CourseOfferingRecord} from '../../../../shared/contracts/academics';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {code,identifier,positiveVersion} from '../domain/setup';
type OfferingInput={yearId:string;sectionId:string;subjectId:string;code:string;key:string;reason:string};
type AssignmentInput={offeringId:string;teacherId:string;validFrom:string;validTo:string;key:string;reason:string};
export interface AcademicOfferingRepository {
 list(actor:Identity,organizationId:string,schoolId:string,yearId:string):Promise<CourseOfferingRecord[]>;
 create(actor:Identity,organizationId:string,schoolId:string,input:OfferingInput):Promise<{id:string;version:number;code:string;replayed:boolean}>;
 assign(actor:Identity,organizationId:string,schoolId:string,input:AssignmentInput):Promise<{assignmentId:string;version:number;teacherId:string;offeringId:string;validFrom:string;validTo:string;replayed:boolean}>;
 end(actor:Identity,organizationId:string,schoolId:string,assignmentId:string,input:{expectedVersion:number;endDate:string;key:string;reason:string}):Promise<{assignmentId:string;version:number;validTo:string;replayed:boolean}>;
}
export type AssignmentImpactPort={hasFutureSessions(input:{organizationId:string;schoolId:string;assignmentId:string;onOrAfter:string},transaction?:unknown):Promise<boolean>};
export const NO_ASSIGNMENT_SESSIONS:AssignmentImpactPort={async hasFutureSessions(){return false;}};
function actor(value:Identity|null):Identity{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;}
function civil(value:unknown){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(`${value}T00:00:00Z`))||new Date(`${value}T00:00:00Z`).toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return value;}
function reason(value:unknown){if(typeof value!=='string'||value.trim().length<5||value.trim().length>500)throw new AccessError('VALIDATION');return value.normalize('NFC').trim();}
export function createAcademicOfferingUseCases(repo:AcademicOfferingRepository){
 const scope=(raw:Identity|null,org:unknown,school:unknown)=>({actor:actor(raw),organizationId:identifier(org),schoolId:identifier(school)});
 return {
  list(raw:Identity|null,org:unknown,school:unknown,year:unknown){const s=scope(raw,org,school);return repo.list(s.actor,s.organizationId,s.schoolId,identifier(year));},
  create(raw:Identity|null,org:unknown,school:unknown,input:{yearId:unknown;sectionId:unknown;subjectId:unknown;code:unknown;key:unknown;reason:unknown}){const s=scope(raw,org,school);return repo.create(s.actor,s.organizationId,s.schoolId,{yearId:identifier(input.yearId),sectionId:identifier(input.sectionId),subjectId:identifier(input.subjectId),code:code(input.code),key:identifier(input.key),reason:reason(input.reason)});},
  assign(raw:Identity|null,org:unknown,school:unknown,input:{offeringId:unknown;teacherId:unknown;validFrom:unknown;validTo:unknown;key:unknown;reason:unknown}){const s=scope(raw,org,school),validFrom=civil(input.validFrom),validTo=civil(input.validTo);if(validFrom>=validTo)throw new AccessError('VALIDATION');return repo.assign(s.actor,s.organizationId,s.schoolId,{offeringId:identifier(input.offeringId),teacherId:identifier(input.teacherId),validFrom,validTo,key:identifier(input.key),reason:reason(input.reason)});},
  end(raw:Identity|null,org:unknown,school:unknown,id:unknown,input:{expectedVersion:unknown;endDate:unknown;key:unknown;reason:unknown}){const s=scope(raw,org,school);return repo.end(s.actor,s.organizationId,s.schoolId,identifier(id),{expectedVersion:positiveVersion(input.expectedVersion),endDate:civil(input.endDate),key:identifier(input.key),reason:reason(input.reason)});},
 };
}
export type AcademicOfferingFacade=ReturnType<typeof createAcademicOfferingUseCases>;

```

### backend/modules/academics/application/setup.ts

```ts
import type {Identity} from '../../../../shared/contracts/access';
import type {AcademicCalendarEvaluation,AcademicCalendarPublication,AcademicCommandResult,AcademicYearTransition,AcademicsWorkspace} from '../../../../shared/contracts/academics';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {code,identifier,name,positiveVersion,validateRange} from '../domain/setup';
import {calendarExceptions,evaluateCalendar,weekdays,type CalendarExceptionInput} from '../domain/calendar';

export type AcademicCapability='school.manage'|'class.manage';
export type CalendarImpactPort={publicationAffectsSessions(input:{organizationId:string;schoolId:string;yearId:string;startsOn:string;endsOn:string;teachingWeekdays:readonly number[];exceptions:readonly CalendarExceptionInput[]},transaction?:unknown):Promise<boolean>;hasPendingSessions(input:{organizationId:string;schoolId:string;yearId:string;onOrAfter:string},transaction?:unknown):Promise<boolean>};
export const NO_ATTENDANCE_SESSIONS:CalendarImpactPort={async publicationAffectsSessions(){return false;},async hasPendingSessions(){return false;}};
export interface AcademicSetupRepository{
 workspace(actor:Identity,organizationId:string,schoolId:string):Promise<AcademicsWorkspace>;
 createYear(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;startsOn:string;endsOn:string;key:string;reason:string}):Promise<AcademicCommandResult & {calendarId:string;status:'DRAFT'}>;
 replaceTerms(actor:Identity,organizationId:string,schoolId:string,yearId:string,input:{expectedVersion:number;terms:{code:string;name:string;startsOn:string;endsOn:string}[];key:string;reason:string}):Promise<{yearId:string;version:number;terms:AcademicsWorkspace['years'][number]['terms'];replayed:boolean}>;
 createGrade(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;key:string;reason:string}):Promise<AcademicCommandResult>;
 createSubject(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;key:string;reason:string}):Promise<AcademicCommandResult>;
 createSection(actor:Identity,organizationId:string,schoolId:string,input:{yearId:string;gradeId:string;campusId:string|null;code:string;name:string;key:string;reason:string}):Promise<AcademicCommandResult & {yearId:string;gradeId:string;campusId:string|null}>;
 calendarBounds(actor:Identity,organizationId:string,schoolId:string,calendarId:string):Promise<{startsOn:string;endsOn:string}>;
 publishCalendar(actor:Identity,organizationId:string,schoolId:string,calendarId:string,input:{expectedVersion:number;teachingWeekdays:number[];exceptions:CalendarExceptionInput[];key:string;reason:string}):Promise<AcademicCalendarPublication>;
 calendarForEvaluation(actor:Identity,organizationId:string,schoolId:string,calendarId:string,campusId:string|null):Promise<{year:{startsOn:string;endsOn:string};revision:{id:string;number:number;teachingWeekdays:number[];exceptions:CalendarExceptionInput[]}|null}>;
 transitionYear(actor:Identity,organizationId:string,schoolId:string,yearId:string,input:{expectedVersion:number;target:'OPEN'|'CLOSED';key:string;reason:string}):Promise<AcademicYearTransition>;
}
export type AcademicSetupFacade=ReturnType<typeof createAcademicSetupUseCases>;
function actor(value:Identity|null):Identity{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;}
function key(value:unknown){return identifier(value);}
function reason(value:unknown){if(typeof value!=='string')throw new AccessError('VALIDATION');const v=value.normalize('NFC').trim();if(v.length<5||v.length>500||/[\u0000-\u001f]/.test(v))throw new AccessError('VALIDATION');return v;}
export function createAcademicSetupUseCases(repo:AcademicSetupRepository){
 const scope=(raw:Identity|null,organization:unknown,school:unknown)=>({actor:actor(raw),organizationId:identifier(organization),schoolId:identifier(school)});
 return {
  workspace(raw:Identity|null,organization:unknown,school:unknown){const s=scope(raw,organization,school);return repo.workspace(s.actor,s.organizationId,s.schoolId);},
  createYear(raw:Identity|null,organization:unknown,school:unknown,input:{code:unknown;name:unknown;startsOn:unknown;endsOn:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school),range=validateRange(input.startsOn,input.endsOn);return repo.createYear(s.actor,s.organizationId,s.schoolId,{...range,code:code(input.code),name:name(input.name),key:key(input.key),reason:reason(input.reason)});},
  replaceTerms(raw:Identity|null,organization:unknown,school:unknown,year:unknown,input:{expectedVersion:unknown;terms:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school),yearId=identifier(year),expectedVersion=positiveVersion(input.expectedVersion);if(!Array.isArray(input.terms))throw new AccessError('VALIDATION');const rawTerms=input.terms.map(x=>{if(!x||typeof x!=='object')throw new AccessError('VALIDATION');const v=x as Record<string,unknown>,range=validateRange(v.startsOn,v.endsOn);return {code:code(v.code),name:name(v.name),...range};});return repo.replaceTerms(s.actor,s.organizationId,s.schoolId,yearId,{expectedVersion,terms:rawTerms,key:key(input.key),reason:reason(input.reason)});},
  createGrade(raw:Identity|null,organization:unknown,school:unknown,input:{code:unknown;name:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school);return repo.createGrade(s.actor,s.organizationId,s.schoolId,{code:code(input.code),name:name(input.name),key:key(input.key),reason:reason(input.reason)});},
  createSubject(raw:Identity|null,organization:unknown,school:unknown,input:{code:unknown;name:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school);return repo.createSubject(s.actor,s.organizationId,s.schoolId,{code:code(input.code),name:name(input.name),key:key(input.key),reason:reason(input.reason)});},
  createSection(raw:Identity|null,organization:unknown,school:unknown,input:{yearId:unknown;gradeId:unknown;campusId?:unknown;code:unknown;name:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school);return repo.createSection(s.actor,s.organizationId,s.schoolId,{yearId:identifier(input.yearId),gradeId:identifier(input.gradeId),campusId:input.campusId==null?null:identifier(input.campusId),code:code(input.code),name:name(input.name),key:key(input.key),reason:reason(input.reason)});},
  async publishCalendar(raw:Identity|null,organization:unknown,school:unknown,calendar:unknown,input:{expectedVersion:unknown;teachingWeekdays:unknown;exceptions:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school),calendarId=identifier(calendar),bounds=await repo.calendarBounds(s.actor,s.organizationId,s.schoolId,calendarId),teachingWeekdays=weekdays(input.teachingWeekdays),exceptions=calendarExceptions(input.exceptions,bounds);return repo.publishCalendar(s.actor,s.organizationId,s.schoolId,calendarId,{expectedVersion:positiveVersion(input.expectedVersion),teachingWeekdays,exceptions,key:key(input.key),reason:reason(input.reason)});},
  async evaluateCalendar(raw:Identity|null,organization:unknown,school:unknown,calendar:unknown,query:{date:unknown;campusId?:unknown}):Promise<AcademicCalendarEvaluation>{const s=scope(raw,organization,school),calendarId=identifier(calendar),campusId=query.campusId==null?null:identifier(query.campusId),context=await repo.calendarForEvaluation(s.actor,s.organizationId,s.schoolId,calendarId,campusId);if(!context.revision)throw new AccessError('CALENDAR_REQUIRED');return evaluateCalendar({date:query.date,campusId,year:context.year,revisionId:context.revision.id,revisionNumber:context.revision.number,teachingWeekdays:context.revision.teachingWeekdays,exceptions:context.revision.exceptions});},
  transitionYear(raw:Identity|null,organization:unknown,school:unknown,year:unknown,input:{expectedVersion:unknown;target:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school);if(input.target!=='OPEN'&&input.target!=='CLOSED')throw new AccessError('VALIDATION');return repo.transitionYear(s.actor,s.organizationId,s.schoolId,identifier(year),{expectedVersion:positiveVersion(input.expectedVersion),target:input.target,key:key(input.key),reason:reason(input.reason)});},
 };
}

```

### backend/modules/academics/application/teacher-profile.ts

```ts
import {AccessError,uuidPattern} from '../../access/contracts/index';
import type {TeacherProfilePort} from '../contracts/teacher-profile';
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
export function createTeacherProfileUseCases(port:TeacherProfilePort){return {
 enable(transaction:object,input:{organizationId:unknown;schoolId:unknown;employeeId:unknown;actorAccountId:unknown;occurredAt:unknown}){if(!transaction||typeof transaction!=='object'||typeof input.occurredAt!=='string'||!Number.isFinite(Date.parse(input.occurredAt)))throw new AccessError('VALIDATION');return port.enable(transaction,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),employeeId:id(input.employeeId),actorAccountId:id(input.actorAccountId),occurredAt:input.occurredAt});},
 disable(transaction:object,input:{organizationId:unknown;schoolId:unknown;employeeId:unknown;actorAccountId:unknown;occurredAt:unknown;employmentEndExclusive:unknown}){if(!transaction||typeof transaction!=='object'||typeof input.occurredAt!=='string'||!Number.isFinite(Date.parse(input.occurredAt))||typeof input.employmentEndExclusive!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(input.employmentEndExclusive))throw new AccessError('VALIDATION');return port.disable(transaction,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),employeeId:id(input.employeeId),actorAccountId:id(input.actorAccountId),occurredAt:input.occurredAt,employmentEndExclusive:input.employmentEndExclusive});}
};}

```

### backend/modules/academics/contracts/teacher-profile.ts

```ts
export type TeacherTransaction=object;
export type TeacherProfileInput=Readonly<{organizationId:string;schoolId:string;employeeId:string;actorAccountId:string;occurredAt:string;employmentEndExclusive?:string}>;
export interface TeacherProfilePort {
 enable(transaction:TeacherTransaction,input:TeacherProfileInput):Promise<{teacherId:string;version:number}>;
 disable(transaction:TeacherTransaction,input:TeacherProfileInput&{employmentEndExclusive:string}):Promise<{teacherId:string;version:number}|null>;
}

```

## Output adapters

- `backend/modules/academics/infrastructure/offerings.ts`
- `backend/modules/academics/infrastructure/setup.ts`
- `backend/modules/academics/infrastructure/teacher-profile.ts`

## Pure domain rules

- `backend/modules/academics/domain/calendar.ts`
- `backend/modules/academics/domain/setup.ts`

## Physical data

- `vs_academics_teacher` — Academic teacher profile, not a login identity; PER-02 owns its eligibility mutations.; see database/tables/vs_academics_teacher.md
- `vs_academics_academic_year` — Half-open year; terms are editable only while DRAFT. Multiple open years permitted if dates/business selection are explicit.; see database/tables/vs_academics_academic_year.md
- `vs_academics_academic_term` — Owned by year; no overlapping intervals; all within year.; see database/tables/vs_academics_academic_term.md
- `vs_academics_grade_level` — School-wide grade catalog. No cross-school shared write.; see database/tables/vs_academics_grade_level.md
- `vs_academics_subject` — School-wide subject catalog.; see database/tables/vs_academics_subject.md
- `vs_academics_section` — Section in one year/grade/campus, including school-wide no-campus scope.; see database/tables/vs_academics_section.md
- `vs_academics_course_offering` — One section subject offering in year.; see database/tables/vs_academics_course_offering.md
- `vs_academics_teacher_assignment` — Primary attendance duty only in Phase 1; one eligible teacher per offering/date.; see database/tables/vs_academics_teacher_assignment.md
- `vs_academics_school_calendar` — One calendar root per school year; no current pointer until publication.; see database/tables/vs_academics_school_calendar.md
- `vs_academics_calendar_revision` — Immutable full policy snapshot. No generic mutable JSON calendar.; see database/tables/vs_academics_calendar_revision.md
- `vs_academics_calendar_exception` — Date exception; campus beats school beats weekly rule. Dates inside year.; see database/tables/vs_academics_calendar_exception.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/academics/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
