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
