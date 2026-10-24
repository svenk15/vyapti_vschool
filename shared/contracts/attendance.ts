export type AttendanceStatus='PRESENT'|'ABSENT'|'LATE'|'EXCUSED';
export type AttendanceRosterItem=Readonly<{studentId:string;displayName:string;rollNumber:string|null;admissionNumber?:string|null}>;
export type AttendanceMarkEntry=Readonly<{studentId:string;status:AttendanceStatus;lateMinutes?:number}>;
export type AttendanceCounts=Readonly<{present:number;absent:number;late:number;excused:number}>;
export type AttendanceSessionRecord=Readonly<{id:string;version:number;status:'SCHEDULED'|'OPEN'|'SUBMITTED'|'CANCELLED';schoolDate:string;startsAt:string;endsAt:string;offering:{id:string;subjectName:string;sectionName:string};teacherName?:string|null;rosterRevision?:string|null;roster?:readonly AttendanceRosterItem[];records?:readonly AttendanceMarkEntry[];recordRevisions?:Readonly<Record<string,number>>;submittedAt?:string|null;cancelledAt?:string|null;counts?:AttendanceCounts}>;
export type AttendanceOpenResult=Readonly<{sessionId:string;version:number;status:'OPEN';rosterRevision:string;roster:readonly AttendanceRosterItem[];replayed:boolean}>;
export type AttendanceSubmitResult=Readonly<{sessionId:string;version:number;status:'SUBMITTED';revision:number;submittedAt:string;counts:AttendanceCounts;replayed:boolean}>;
export type AttendanceCorrectionValue=Readonly<{status:AttendanceStatus;lateMinutes?:number}>;
export type AttendanceCorrectionChange=Readonly<{studentId:string;status:AttendanceStatus;lateMinutes?:number}>;
export type AttendanceCorrectionResult=Readonly<{sessionId:string;version:number;revision:number;correctedAt:string;changes:readonly {studentId:string;from:AttendanceCorrectionValue;to:AttendanceCorrectionValue}[];replayed:boolean}>;
export type AttendanceCancelResult=Readonly<{sessionId:string;version:number;status:'CANCELLED';cancelledAt:string;revision:number;replayed:boolean}>;
export type AttendanceCommandStatus=Readonly<{state:'UNKNOWN'}|{state:'FOUND';result:AttendanceSubmitResult|AttendanceCancelResult}>;
export type AttendanceHistoryRevision=Readonly<{number:number;kind:'SUBMIT'|'CORRECT'|'CANCEL';occurredAt:string;reason:string|null;actorDisplayName:string;changes:Readonly<Record<string,unknown>>}>;
export type AttendanceHistory=Readonly<{sessionId:string;version:number;status:'SUBMITTED'|'CANCELLED';revisions:readonly AttendanceHistoryRevision[];nextCursor:string|null}>;
export type TeacherAttendanceHistoryItem=Readonly<{id:string;offeringId:string;schoolDate:string;startsAt:string;endsAt:string;status:'SCHEDULED'|'OPEN'|'SUBMITTED';subjectName:string;sectionName:string}>;
export type TeacherAttendanceHistory=Readonly<{items:readonly TeacherAttendanceHistoryItem[];nextCursor:string|null}>;
export type LeadershipRegisterCoverageItem=Readonly<{id:string;version:number;schoolDate:string;startsAt:string;endsAt:string;dueAt:string;status:'SCHEDULED'|'OPEN';sectionName:string;subjectName:string;teacherName:string|null}>;
export type LeadershipCoverageFilterOption=Readonly<{id:string;label:string}>;
export type LeadershipRegisterCoverage=Readonly<{
 asOf:string;schoolDate:string;timezone:string;definitionVersion:'register-coverage.v1';duePolicy:'SESSION_END_NO_GRACE';
 counts:Readonly<{scheduled:number;due:number;received:number;awaiting:number;notDue:number;cancelled:number}>;
 query:Readonly<{classId:string|null;status:'SCHEDULED'|'OPEN'|null;teacherId:string|null;sort:'due'|'class';order:'asc'|'desc'}>;
 filters:Readonly<{classes:readonly LeadershipCoverageFilterOption[];teachers:readonly LeadershipCoverageFilterOption[]}>;
 awaiting:Readonly<{items:readonly LeadershipRegisterCoverageItem[];total:number;nextCursor:string|null}>;
}>;
export type LeadershipSessionEvidence=Readonly<{
 id:string;version:number;schoolDate:string;timezone:string;startsAt:string;endsAt:string;
 sectionName:string;subjectName:string;teacherName:string|null;
 currentState:'SCHEDULED'|'OPEN'|'SUBMITTED'|'CANCELLED';
 evidenceState:'AWAITING'|'RECEIVED'|'CANCELLED'|'NOT_DUE';
 stateUpdatedAt:string|null;observedAt:string;
}>;
export type LeadershipPupilPatternOutcome=Readonly<{sessionId:string;schoolDate:string;startsAt:string;subjectName:string;sectionName:string;status:AttendanceStatus;lateMinutes:number|null}>;
export type LeadershipPupilMissingCoverage=Readonly<{sessionId:string;schoolDate:string;startsAt:string;subjectName:string;sectionName:string;state:'SCHEDULED'|'OPEN'}>;
export type LeadershipPupilPatternItem=Readonly<{
 studentId:string;displayName:string;admissionNumber:string;grantVersion:number;
 submittedSessions:number;absentSessions:number;absentDates:number;missingSessions:number;meetsThreshold:boolean;
 outcomes:readonly LeadershipPupilPatternOutcome[];missingCoverage:readonly LeadershipPupilMissingCoverage[];
}>;
export type LeadershipPupilPatternReview=Readonly<{
 definitionVersion:'pupil-pattern.v1';asOf:string;timezone:string;fromDate:string;toDate:string;threshold:number;
 counts:Readonly<{authorizedPupils:number;matchingPupils:number;uniquePupils:number;submittedSessions:number;absentSessions:number;absentDates:number;missingSessions:number}>;
 items:readonly LeadershipPupilPatternItem[];
}>;
export type AttendancePupilReviewSnapshotResult=Readonly<{snapshotId:string;version:number;studentId:string;fromDate:string;toDate:string;threshold:number;evidenceHash:string;replayed:boolean}>;
