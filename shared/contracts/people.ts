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
export type PeopleStaffCommand = 'EmployeeCreated' | 'TeacherEligibilityEnabled' | 'PersonAccountBound' | 'EmployeeEnded' | 'EmployeeCategoryChanged';
export type PeopleCommandStatus = Readonly<{state:'UNKNOWN'}> | Readonly<{state:'FOUND';result:EmployeeProfile & {replayed?:boolean}}>;
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
export type StaffProfileAcademics = Readonly<{
 teacherId: string | null;
 teacherVersion: number;
 eligibility: 'NOT_ENABLED' | 'ENABLED' | 'DISABLED';
 eligibilityPeriod: import('./academics').TeacherEligibilityPeriod | null;
 eligibilityHistory: readonly import('./academics').TeacherEligibilityPeriod[];
 assignments: readonly Readonly<{assignmentId:string;subjectName:string;sectionName:string;validFrom:string;validTo:string;current:boolean}>[];
}>;
export type StaffProfileAccess = Readonly<{
 state: 'NO_ACCOUNT' | 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'LINKED';
 membershipId: string | null;
 membershipVersion: number | null;
 roles: readonly ('SCHOOL_ADMIN'|'TEACHER'|'PRINCIPAL')[];
 invitation: Readonly<{id:string;state:'PENDING_DELIVERY'|'SENT'|'FAILED'|'EXPIRED'|'CONSUMED'|'REVOKED';expiresAt:string}> | null;
}>;
export type StaffProfileProjection<T> = Readonly<{status:'AVAILABLE';value:T}> | Readonly<{status:'UNAVAILABLE'}>;
export type StaffProfile = Readonly<{
 employee: Readonly<{employeeId:string;version:number;staffNumber:string;category:EmployeeProfile['category'];employment:EmployeeProfile['employment']}>;
 person: Readonly<{id:string;version:number;displayName:string;contactEmail:string|null}>;
 history: readonly Readonly<{kind:'EMPLOYMENT_STARTED'|'EMPLOYMENT_ENDED'|'NAME_CORRECTED';label:string;occurredOn:string}>[];
 academics: StaffProfileProjection<StaffProfileAcademics>;
 access: StaffProfileProjection<StaffProfileAccess>;
}>;
