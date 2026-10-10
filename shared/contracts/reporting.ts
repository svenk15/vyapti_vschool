export type AttendanceReportCounts=Readonly<{expectedSessions:number;submittedSessions:number;pendingSessions:number;futureSessions:number;cancelledSessions:number;present:number;late:number;absent:number;excused:number}>;
export type AttendanceReportRow=Readonly<{id:string;schoolDate:string;startsAt:string;status:'SCHEDULED'|'OPEN'|'SUBMITTED'|'CANCELLED';sectionName:string;subjectName:string;present:number;late:number;absent:number;excused:number}>;
export type AttendanceReport=Readonly<{asOf:string;filters:Readonly<{fromDate:string;toDate:string;yearId:string|null;sectionId:string|null;subjectId:string|null}>;counts:AttendanceReportCounts;rate:Readonly<{numerator:number;denominator:number;value:number|null}>;sessions:Readonly<{items:readonly AttendanceReportRow[];nextCursor:string|null}>;explanation:string}>;
export type AttendanceReportInput=Readonly<{fromDate:string;toDate:string;yearId?:string;sectionId?:string;subjectId?:string;cursor?:string;limit?:number}>;

export type SchoolReadinessItem=Readonly<{id:'school'|'academics'|'staff'|'students'|'attendance';label:string;complete:boolean;detail:string;href:string;count:number}>;
export type SchoolAdminException=Readonly<{id:'attendance'|'imports'|'staff';label:string;count:number;detail:string;href:string}>;
export type SchoolAdminOverview=Readonly<{asOf:string;readiness:readonly SchoolReadinessItem[];exceptions:readonly SchoolAdminException[];completeCount:number;totalCount:number}>;
