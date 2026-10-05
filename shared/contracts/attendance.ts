export type AttendanceStatus='PRESENT'|'ABSENT'|'LATE'|'EXCUSED';
export type AttendanceRosterItem=Readonly<{studentId:string;displayName:string;rollNumber:string|null}>;
export type AttendanceMarkEntry=Readonly<{studentId:string;status:AttendanceStatus;lateMinutes?:number}>;
export type AttendanceCounts=Readonly<{present:number;absent:number;late:number;excused:number}>;
export type AttendanceSessionRecord=Readonly<{id:string;version:number;status:'SCHEDULED'|'OPEN'|'SUBMITTED';schoolDate:string;startsAt:string;endsAt:string;offering:{id:string;subjectName:string;sectionName:string};rosterRevision?:string|null;roster?:readonly AttendanceRosterItem[];records?:readonly AttendanceMarkEntry[];submittedAt?:string|null;counts?:AttendanceCounts}>;
export type AttendanceOpenResult=Readonly<{sessionId:string;version:number;status:'OPEN';rosterRevision:string;roster:readonly AttendanceRosterItem[];replayed:boolean}>;
export type AttendanceSubmitResult=Readonly<{sessionId:string;version:number;status:'SUBMITTED';revision:number;submittedAt:string;counts:AttendanceCounts;replayed:boolean}>;
