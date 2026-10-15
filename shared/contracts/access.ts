export type Identity = Readonly<{ accountId: string; tokenVersion: number }>;
export type RoleCode = "SCHOOL_ADMIN" | "TEACHER";
export type AdminHome = Readonly<{
  accountId: string; membershipId: string; scope: { organizationId: string; schoolId: string };
  institutionName: string; schoolName: string; schoolCode: string; timezone: string;
  capabilities: readonly string[];
}>;
export type SelfAccount = Readonly<{
  accountId: string;
  email: string;
  status: string;
  createdAt: string;
}>;
export type CurrentSessionInfo = Readonly<{
  startedAt: string;
  expiresAt: string;
}>;
export type AccountSessionLabel = "DESKTOP_WEB" | "MOBILE_WEB";
export type AccountSessionSummary = Readonly<{
  id: string;
  label: AccountSessionLabel;
  startedAt: string;
  expiresAt: string;
  current: boolean;
  version: number;
}>;
export type AccountSessionDirectory = Readonly<{ sessions: readonly AccountSessionSummary[] }>;
export type AccountSessionRevocation = Readonly<{
  sessionId: string;
  revokedAt: string;
  version: number;
  replayed: boolean;
  current: boolean;
}>;
export type ProvisionInput = { organizationName: string; schoolCode: string; schoolName: string; timezone: string; adminEmail: string; password: string };
export type OperatorPrincipal = Readonly<{ operatorId: string; verified: true }>;
export type ProvisionResult = Readonly<{ organizationId: string; schoolId: string; accountId: string; membershipId: string }>;
