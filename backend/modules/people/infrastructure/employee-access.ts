import type { Prisma } from "../../../../generated/prisma/client";
import type {
  EmployeeAccessTransaction,
  EmployeeAccessVerificationPort,
} from "../contracts/employee-access";

function txOf(transaction: EmployeeAccessTransaction) {
  return transaction as Prisma.TransactionClient;
}

export class PrismaEmployeeAccessVerification implements EmployeeAccessVerificationPort {
  async findActiveEmployee(
    transaction: EmployeeAccessTransaction,
    input: { organizationId: string; schoolId: string; employeeId: string; schoolDate: string },
  ) {
    const rows = await txOf(transaction).$queryRaw<
      { employeeId: string; personId: string; staffNumber: string; displayName: string }[]
    >`SELECT e.id AS "employeeId", e.person_id AS "personId", e.staff_number AS "staffNumber",
             concat_ws(' ', p.first_name, nullif(p.last_name, '')) AS "displayName"
       FROM vs_people_employee e
       JOIN vs_people_person p
         ON p.organization_id=e.organization_id AND p.id=e.person_id
      WHERE e.organization_id=${input.organizationId}::uuid
        AND e.school_id=${input.schoolId}::uuid
        AND e.id=${input.employeeId}::uuid
        AND e.status='ACTIVE'
        AND e.employed_from<=${input.schoolDate}::date
        AND (e.employed_to IS NULL OR e.employed_to>${input.schoolDate}::date)
      FOR SHARE OF e, p`;
    return rows[0] ?? null;
  }

  async findActiveEmployeeByPerson(
    transaction: EmployeeAccessTransaction,
    input: { organizationId: string; schoolId: string; personId: string; schoolDate: string },
  ) {
    const rows = await txOf(transaction).$queryRaw<
      { employeeId: string; personId: string; staffNumber: string; displayName: string }[]
    >`SELECT e.id AS "employeeId", e.person_id AS "personId", e.staff_number AS "staffNumber",
             concat_ws(' ', p.first_name, nullif(p.last_name, '')) AS "displayName"
       FROM vs_people_employee e
       JOIN vs_people_person p
         ON p.organization_id=e.organization_id AND p.id=e.person_id
      WHERE e.organization_id=${input.organizationId}::uuid
        AND e.school_id=${input.schoolId}::uuid
        AND e.person_id=${input.personId}::uuid
        AND e.status='ACTIVE'
        AND e.employed_from<=${input.schoolDate}::date
        AND (e.employed_to IS NULL OR e.employed_to>${input.schoolDate}::date)
      FOR SHARE OF e, p`;
    return rows[0] ?? null;
  }
}
