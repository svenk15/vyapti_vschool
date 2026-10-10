import type { Identity } from "../../../../shared/contracts/access";
import type { EnrollmentOptions, EnrollmentResult, ExistingPersonChoice, StudentArchiveResult, StudentDetail, StudentNameCorrectionResult, StudentProfile, StudentTransferResult, StudentWorkspace } from "../../../../shared/contracts/students";
import { AccessError, uuidPattern } from "../../access/contracts/index";
import type { EnlistedStudentRegistrationPort } from "../contracts/enlisted-student-registration";
import type {StudentAttendanceRosterEntry,StudentAttendanceRosterPort} from '../contracts/attendance-roster';
import { archiveInput, enrollmentInput, exactSelectionName, nameCorrectionInput, studentInput, studentListQuery, transferInput } from "../domain/student";

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
  correctName(actor:Identity,organizationId:string,schoolId:string,studentId:string,input:ReturnType<typeof nameCorrectionInput>&{key:string}):Promise<StudentNameCorrectionResult>;
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
    correctName(identity:Identity|null,organizationId:unknown,schoolId:unknown,studentId:unknown,input:{expectedPersonVersion:unknown;firstName:unknown;lastName?:unknown;reason:unknown;key:unknown}){return repository.correctName(actor(identity),id(organizationId),id(schoolId),id(studentId),{...nameCorrectionInput(input),key:key(input.key)});},
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
