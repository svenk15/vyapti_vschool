export type TeacherReadinessIssue='NO_ACTIVE_ASSIGNMENT'|'TEACHER_ELIGIBILITY_NOT_READY'|'SESSION_CHANGED_OR_CANCELLED'|'READY';
export type TeacherReadiness=Readonly<{date:string;timezone:string;issue:TeacherReadinessIssue;issueLabel:string;supportReference:string}>;
