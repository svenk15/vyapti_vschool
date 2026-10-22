export type EmployeeProfile = Readonly<{
 employeeId: string;
 version: number;
 staffNumber: string;
 category: 'TEACHING' | 'ADMINISTRATION' | 'SUPPORT' | 'UNCLASSIFIED';
 person: Readonly<{ id: string; displayName: string }>;
 employment: Readonly<{ from: string; to: string | null; status: 'ACTIVE' | 'ENDED' }>;
 portalAccess: 'UNLINKED' | 'LINKED' | 'ACTIVE';
 teachingEligibility: 'NOT_ENABLED' | 'ENABLED' | 'DISABLED';
 teacherId: string | null;
}>;
export type StaffDirectorySearchBy = 'name' | 'employeeCode';
export type StaffDirectoryCategory = EmployeeProfile['category'] | 'ANY';
export type StaffDirectoryEmployment = EmployeeProfile['employment']['status'] | 'ANY';
export type StaffDirectorySort = 'name' | 'employeeCode' | 'employment';
export type StaffDirectoryOrder = 'asc' | 'desc';
export type StaffDirectoryQuery = Readonly<{
 search: string;
 by: StaffDirectorySearchBy;
 category: StaffDirectoryCategory;
 employment: StaffDirectoryEmployment;
 sort: StaffDirectorySort;
 order: StaffDirectoryOrder;
 cursor: string | null;
 limit: number;
}>;
export type PeopleWorkspace = Readonly<{
 employees: readonly EmployeeProfile[];
 nextCursor: string | null;
 previousCursor: string | null;
 total: number;
 schoolDate: string;
 query: Omit<StaffDirectoryQuery,'cursor'|'limit'>;
}>;
