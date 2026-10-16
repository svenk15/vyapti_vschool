export type AttendanceReportCounts=Readonly<{expectedSessions:number;submittedSessions:number;pendingSessions:number;futureSessions:number;cancelledSessions:number;present:number;late:number;absent:number;excused:number}>;
export type AttendanceReportRow=Readonly<{id:string;schoolDate:string;startsAt:string;status:'SCHEDULED'|'OPEN'|'SUBMITTED'|'CANCELLED';sectionName:string;subjectName:string;teacherName:string|null;present:number;late:number;absent:number;excused:number}>;
export type AttendanceReport=Readonly<{asOf:string;filters:Readonly<{fromDate:string;toDate:string;yearId:string|null;sectionId:string|null;subjectId:string|null}>;counts:AttendanceReportCounts;rate:Readonly<{numerator:number;denominator:number;value:number|null}>;sessions:Readonly<{items:readonly AttendanceReportRow[];nextCursor:string|null}>;explanation:string}>;
export type AttendanceReportInput=Readonly<{fromDate:string;toDate:string;yearId?:string;sectionId?:string;subjectId?:string;cursor?:string;limit?:number}>;
export type LeadershipAttendanceExportInput=Readonly<{date?:string;classId?:string;status?:'SCHEDULED'|'OPEN';teacherId?:string;sort?:'due'|'class';order?:'asc'|'desc'}>;
export type LeadershipLearningExportInput=Readonly<{fromDate?:string;toDate?:string;classId?:string;subjectId?:string}>;
export type LeadershipFeedbackExportInput=LeadershipLearningExportInput;
export type LeadershipExportReportType='attendance-register-coverage.v1'|'assignment-completion.v1'|'feedback-turnaround.v1'|'timetable-exceptions.v1';
export type LeadershipExportAvailability=Readonly<{canExport:boolean;reportTypes:readonly LeadershipExportReportType[]}>;
export type LeadershipSnapshotAvailability=Readonly<{enabled:boolean;canManage:boolean;reason:'REAL_DATA_POLICY_PENDING'|'NOT_DESIGNATED'|null}>;
export type LeadershipReportSnapshotSummary=Readonly<{id:string;reportType:'attendance-register-coverage.v1';definitionVersion:string;schoolDate:string;sourceAsOf:string;capturedAt:string;rowCount:number;version:number;removedAt:string|null}>;
export type LeadershipReportSnapshot=LeadershipReportSnapshotSummary&Readonly<{query:LeadershipAttendanceExportInput;payload:LeadershipRegisterCoverage;replayed:boolean}>;

export type SchoolReadinessItemId='school'|'academics'|'staff'|'students'|'attendance';
export type SetupResponsibleRole='SCHOOL_ADMIN'|'INSTITUTION_ADMIN'|'ASSIGNED_TEACHER';
export type SchoolReadinessItem=Readonly<{id:SchoolReadinessItemId;label:string;complete:boolean;detail:string;href:string;count:number;responsibleRole:SetupResponsibleRole|null}>;
export type SchoolAdminException=Readonly<{id:'attendance'|'imports'|'staff';label:string;actionLabel:'Open register'|'Review import'|'Review access';count:number;detail:string;href:string}>;
export type SchoolAdminOverview=Readonly<{asOf:string;readiness:readonly SchoolReadinessItem[];exceptions:readonly SchoolAdminException[];completeCount:number;totalCount:number}>;
import type {LeadershipRegisterCoverage} from './attendance';
