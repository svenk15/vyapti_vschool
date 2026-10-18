export type Identity = Readonly<{ accountId: string; tokenVersion: number }>;
export type RoleCode = "SCHOOL_ADMIN" | "TEACHER" | "PRINCIPAL";
export type LeadershipDelegationAction =
  | "leadership.read"
  | "attendance.read_leadership"
  | "timetable.read_leadership"
  | "timetable.cover.approve"
  | "learning.read_leadership"
  | "communication.read_leadership";
export type LeadershipDelegationStatus = "SCHEDULED" | "ACTIVE" | "EXPIRED" | "REVOKED";
export type LeadershipDelegationSummary = Readonly<{
  delegationId: string;
  organizationId: string;
  schoolId: string;
  accountId: string;
  employeeId: string;
  displayName: string;
  actions: readonly LeadershipDelegationAction[];
  startsAt: string;
  endsAt: string;
  status: LeadershipDelegationStatus;
  version: number;
  reason: string;
  revokedAt: string | null;
}>;
export type LeadershipDelegationResult = LeadershipDelegationSummary & Readonly<{replayed:boolean}>;
export type AdminHome = Readonly<{
  accountId: string; membershipId: string; scope: { organizationId: string; schoolId: string };
  institutionName: string; schoolName: string; schoolCode: string; timezone: string;
  capabilities: readonly string[];
  actingDelegation?: Readonly<{delegationId:string; startsAt:string; endsAt:string; actions:readonly LeadershipDelegationAction[]}>;
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
export type TableDensity = 'COMFORTABLE' | 'COMPACT';
export type ReducedMotionPreference = 'SYSTEM' | 'REDUCE';
export type AccountPreferenceBundle = Readonly<{
  density: TableDensity;
  reducedMotion: ReducedMotionPreference;
  versions: Readonly<{density: number; reducedMotion: number}>;
  updatedAt: string | null;
}>;
export type AccountPreferenceUpdateResult = AccountPreferenceBundle & Readonly<{replayed: boolean}>;
export type SchoolSupportConfiguration = Readonly<{
  label: string;
  email: string | null;
  phone: string | null;
  hours: string;
  timezone: string;
  publishedAt: string;
}>;
export type ProvisionInput = { organizationName: string; schoolCode: string; schoolName: string; timezone: string; adminEmail: string; password: string; themeId?:import('./branding').ThemeId };
export type OperatorPrincipal = Readonly<{ operatorId: string; verified: true }>;
export type ProvisionResult = Readonly<{ organizationId: string; schoolId: string; accountId: string; membershipId: string }>;
