export type EmployeeAccessTransaction = object;

export type VerifiedEmployeeAccessFact = Readonly<{
  employeeId: string;
  personId: string;
  staffNumber: string;
  displayName: string;
}>;

/** Narrow cross-owner fact used while Access owns the surrounding transaction. */
export interface EmployeeAccessVerificationPort {
  findActiveEmployee(
    transaction: EmployeeAccessTransaction,
    input: Readonly<{
      organizationId: string;
      schoolId: string;
      employeeId: string;
      schoolDate: string;
    }>,
  ): Promise<VerifiedEmployeeAccessFact | null>;
  findActiveEmployeeByPerson(
    transaction: EmployeeAccessTransaction,
    input: Readonly<{
      organizationId: string;
      schoolId: string;
      personId: string;
      schoolDate: string;
    }>,
  ): Promise<VerifiedEmployeeAccessFact | null>;
}
