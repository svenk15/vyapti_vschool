export const attendanceExplanationCategories=['HEALTH_RELATED','FAMILY_COMMITMENT','SCHOOL_APPROVED_ACTIVITY','OTHER'] as const;
export type AttendanceExplanationCategory=typeof attendanceExplanationCategories[number];
export type AttendanceExplanationStatus='SUBMITTED'|'ACCEPTED'|'DECLINED'|'WITHDRAWN';
export type AttendanceExplanationClarification=Readonly<{id:string;question:string;answer:string|null;status:'OPEN'|'ANSWERED'|'CLOSED';version:number;requestedAt:string;answeredAt:string|null}>;
export type AttendanceExplanationItem=Readonly<{id:string;sessionId:string;studentId:string;studentName:string;schoolDate:string;startsAt:string;subjectName:string;sectionName:string;category:AttendanceExplanationCategory;explanation:string;status:AttendanceExplanationStatus;version:number;submittedAt:string;reviewedAt:string|null;schoolResponse:string|null;withdrawnAt:string|null;clarification:AttendanceExplanationClarification|null}>;
export type AttendanceExplanationResult=Readonly<{id:string;status:AttendanceExplanationStatus;version:number;replayed:boolean}>;
export type AttendanceExplanationClarificationResult=Readonly<{id:string;explanationId:string;status:'OPEN'|'ANSWERED'|'CLOSED';version:number;explanationVersion:number;replayed:boolean}>;
