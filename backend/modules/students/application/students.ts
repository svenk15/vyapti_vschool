import type { Identity } from "../../../../shared/contracts/access";
import type { EnrollmentOptions, EnrollmentResult, ExistingPersonChoice, StudentDetail, StudentProfile, StudentWorkspace } from "../../../../shared/contracts/students";
import { AccessError, uuidPattern } from "../../access/contracts/index";
import { enrollmentInput, exactSelectionName, studentInput, studentListQuery } from "../domain/student";

export interface StudentRepository {
  list(actor: Identity, organizationId: string, schoolId: string, query: { search: string; cursor: string | null; limit: number; status: "ACTIVE"|"ARCHIVED"|"ALL" }): Promise<StudentWorkspace>;
  get(actor: Identity, organizationId: string, schoolId: string, studentId: string): Promise<StudentDetail>;
  create(actor: Identity, organizationId: string, schoolId: string, input: ReturnType<typeof studentInput> & { key: string }): Promise<StudentProfile & { replayed: boolean }>;
  findExistingPeople(actor: Identity, organizationId: string, schoolId: string, exactName: string): Promise<readonly ExistingPersonChoice[]>;
  enrollmentOptions(actor:Identity,organizationId:string,schoolId:string,studentId:string):Promise<EnrollmentOptions>;
  enroll(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof enrollmentInput>&{key:string}):Promise<EnrollmentResult>;
}

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
  };
}

export type StudentsFacade = ReturnType<typeof createStudentUseCases>;
