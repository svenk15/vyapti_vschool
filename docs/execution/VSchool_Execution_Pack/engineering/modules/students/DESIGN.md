# Students — concrete engineering LLD

## Responsibility and aggregate boundary
Student identity, enrollment and section placement history. Aggregates/owned records: Student, Enrollment, SectionPlacement. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** Registration and enrollment are distinct commands. Freeze impact blocks illegal history rewrites. Existing Person selection policy requires live-document reconciliation if conflicting.

## Input facades and cross-owner ports
- `backend/modules/students/application/students.ts`
- `backend/modules/students/contracts/attendance-roster.ts`
- `backend/modules/students/contracts/enlisted-student-registration.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/students/application/students.ts

```ts
import type { Identity } from "../../../../shared/contracts/access";
import type { EnrollmentOptions, EnrollmentResult, ExistingPersonChoice, StudentArchiveResult, StudentDetail, StudentProfile, StudentTransferResult, StudentWorkspace } from "../../../../shared/contracts/students";
import { AccessError, uuidPattern } from "../../access/contracts/index";
import type { EnlistedStudentRegistrationPort } from "../contracts/enlisted-student-registration";
import type {StudentAttendanceRosterEntry,StudentAttendanceRosterPort} from '../contracts/attendance-roster';
import { archiveInput, enrollmentInput, exactSelectionName, studentInput, studentListQuery, transferInput } from "../domain/student";

export interface AttendanceStudentImpactPort {
  hasFrozenSessions(transaction:object,input:{organizationId:string;schoolId:string;sectionIds:readonly string[];fromDate:string;toDate:string}):Promise<boolean>;
}

export interface StudentRepository {
  list(actor: Identity, organizationId: string, schoolId: string, query: { search: string; cursor: string | null; limit: number; status: "ACTIVE"|"ARCHIVED"|"ALL" }): Promise<StudentWorkspace>;
  get(actor: Identity, organizationId: string, schoolId: string, studentId: string): Promise<StudentDetail>;
  create(actor: Identity, organizationId: string, schoolId: string, input: ReturnType<typeof studentInput> & { key: string }): Promise<StudentProfile & { replayed: boolean }>;
  findExistingPeople(actor: Identity, organizationId: string, schoolId: string, exactName: string): Promise<readonly ExistingPersonChoice[]>;
  enrollmentOptions(actor:Identity,organizationId:string,schoolId:string,studentId:string):Promise<EnrollmentOptions>;
  enroll(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof enrollmentInput>&{key:string}):Promise<EnrollmentResult>;
  transfer(actor:Identity,organizationId:string,schoolId:string,enrollmentId:string,input:ReturnType<typeof transferInput>&{key:string}):Promise<StudentTransferResult>;
  archive(actor:Identity,organizationId:string,schoolId:string,studentId:string,input:ReturnType<typeof archiveInput>&{key:string}):Promise<StudentArchiveResult>;
}

export type {StudentAttendanceRosterEntry,StudentAttendanceRosterPort};

export type EnlistedStudentRegistrationRepository = EnlistedStudentRegistrationPort;

function actor(value: Identity | null): Identity { if (!value || !uuidPattern.test(value.accountId) || !Number.isSafeInteger(value.tokenVersion)) throw new AccessError("UNAUTHENTICATED"); return value; }
function id(value: unknown): string { if (typeof value !== "string" || !uuidPattern.test(value)) throw new AccessError("VALIDATION"); return value.toLowerCase(); }
function key(value: unknown): string { if (typeof value !== "string" || !/^[A-Za-z0-9_-]{16,100}$/.test(value)) throw new AccessError("VALIDATION"); return value; }

export function createStudentUseCases(repository: StudentRepository) {
  return {
    list(identity: Identity | null, organizationId: unknown, schoolId: unknown, query: { search?: unknown; cursor?: unknown; limit?: unknown; status?: unknown } = {}) {
      return repository.list(actor(identity), id(organizationId), id(schoolId), studentListQuery(query));
    },
    get(identity: Identity | null, organizationId: unknown, schoolId: unknown, studentId: unknown) {
      return repository.get(actor(identity), id(organizationId), id(schoolId), id(studentId));
    },
    create(identity: Identity | null, organizationId: unknown, schoolId: unknown, input: { firstName: unknown; lastName?: unknown; admissionNumber: unknown; existingPersonId?: unknown; key: unknown }) {
      return repository.create(actor(identity), id(organizationId), id(schoolId), { ...studentInput(input), key: key(input.key) });
    },
    findExistingPeople(identity: Identity | null, organizationId: unknown, schoolId: unknown, exactName: unknown) {
      return repository.findExistingPeople(actor(identity), id(organizationId), id(schoolId), exactSelectionName(exactName));
    },
    enrollmentOptions(identity:Identity|null,organizationId:unknown,schoolId:unknown,studentId:unknown){return repository.enrollmentOptions(actor(identity),id(organizationId),id(schoolId),id(studentId));},
    enroll(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:{studentId:unknown;yearId:unknown;sectionId:unknown;startsOn:unknown;lastDay:unknown;rollNumber?:unknown;key:unknown}){return repository.enroll(actor(identity),id(organizationId),id(schoolId),{...enrollmentInput(input),key:key(input.key)});},
    transfer(identity:Identity|null,organizationId:unknown,schoolId:unknown,enrollmentId:unknown,input:{expectedVersion:unknown;toSectionId:unknown;effectiveDate:unknown;rollNumber?:unknown;reason:unknown;key:unknown}){return repository.transfer(actor(identity),id(organizationId),id(schoolId),id(enrollmentId),{...transferInput(input),key:key(input.key)});},
    archive(identity:Identity|null,organizationId:unknown,schoolId:unknown,studentId:unknown,input:{expectedVersion:unknown;reason:unknown;key:unknown}){return repository.archive(actor(identity),id(organizationId),id(schoolId),id(studentId),{...archiveInput(input),key:key(input.key)});},
  };
}

export function createEnlistedStudentRegistrationUseCases(repository: EnlistedStudentRegistrationRepository) {
  return {
    registerAndEnroll(transaction: object, identity: Identity | null, input: Parameters<EnlistedStudentRegistrationPort["registerAndEnroll"]>[2]) {
      const checkedActor = actor(identity);
      if (!transaction || typeof transaction !== "object") throw new AccessError("UNAVAILABLE");
      for (const value of [input.organizationId, input.schoolId, input.yearId, input.sectionId]) id(value);
      if (!/^[A-Za-z0-9_-]{16,100}$/.test(input.key)) throw new AccessError("VALIDATION");
      return repository.registerAndEnroll(transaction, checkedActor, input);
    },
  };
}

export type StudentsFacade = ReturnType<typeof createStudentUseCases>;

```

### backend/modules/students/contracts/attendance-roster.ts

```ts
export type StudentAttendanceRosterEntry=Readonly<{studentId:string;studentVersion:number;enrollmentVersion:number;displayName:string;rollNumber:string|null}>;
export interface StudentAttendanceRosterPort {
  listForSession(transaction:object,actor:{accountId:string;tokenVersion:number},organizationId:string,schoolId:string,sectionId:string,schoolDate:string):Promise<readonly StudentAttendanceRosterEntry[]>;
}

```

### backend/modules/students/contracts/enlisted-student-registration.ts

```ts
import type { Identity } from "../../../../shared/contracts/access";

/** Opaque transaction owned by the composition/infrastructure boundary. */
export type StudentRegistrationTransaction = object;
export type EnlistedRegistrationInput = Readonly<{
  organizationId: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  existingPersonId?: string;
  yearId: string;
  sectionId: string;
  validFrom: string;
  validTo: string;
  rollNumber: string | null;
  key: string;
}>;
export type EnlistedRegistrationResult = Readonly<{ studentId: string; enrollmentId: string; replayed: boolean }>;
export interface EnlistedStudentRegistrationPort {
  registerAndEnroll(transaction: StudentRegistrationTransaction, actor: Identity, input: EnlistedRegistrationInput): Promise<EnlistedRegistrationResult>;
}

```

## Output adapters

- `backend/modules/students/infrastructure/students.ts`

## Pure domain rules

- `backend/modules/students/domain/student.ts`

## Physical data

- `vs_students_student` — Students-owned branch identity and admission number; the Person remains People-owned and is never inferred by name or email.; see database/tables/vs_students_student.md
- `vs_students_enrollment` — One Students-owned yearly root per Student and Academics-owned AcademicYear; retained half-open historical range.; see database/tables/vs_students_enrollment.md
- `vs_students_section_placement` — Students-owned section membership intervals referencing Academics Section; no duplicated year/student roots on enrollment. Roll is display text, not a globally unique identity.; see database/tables/vs_students_section_placement.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/students/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
