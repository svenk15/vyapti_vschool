export type Identity = Readonly<{ accountId: string; tokenVersion: number }>;
export type RoleCode = "SCHOOL_ADMIN" | "TEACHER";
export type AdminHome = Readonly<{
  accountId: string; membershipId: string; scope: { organizationId: string; schoolId: string };
  institutionName: string; schoolName: string; schoolCode: string; timezone: string;
  capabilities: readonly string[];
}>;
export type ProvisionInput = { organizationName: string; schoolCode: string; schoolName: string; timezone: string; adminEmail: string; password: string };
export type OperatorPrincipal = Readonly<{ operatorId: string; verified: true }>;
export type ProvisionResult = Readonly<{ organizationId: string; schoolId: string; accountId: string; membershipId: string }>;
