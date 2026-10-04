export type EmployeeProfile = Readonly<{
 employeeId: string;
 version: number;
 staffNumber: string;
 person: Readonly<{ id: string; displayName: string }>;
 employment: Readonly<{ from: string; to: string | null; status: 'ACTIVE' | 'ENDED' }>;
 portalAccess: 'UNLINKED' | 'LINKED' | 'ACTIVE';
 teachingEligibility: 'NOT_ENABLED' | 'ENABLED' | 'DISABLED';
 teacherId: string | null;
}>;
export type PeopleWorkspace = Readonly<{ employees: readonly EmployeeProfile[]; nextCursor: string | null; schoolDate: string }>;
