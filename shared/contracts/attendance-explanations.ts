export const attendanceExplanationCategories=['HEALTH_RELATED','FAMILY_COMMITMENT','SCHOOL_APPROVED_ACTIVITY','OTHER'] as const;
export type AttendanceExplanationCategory=typeof attendanceExplanationCategories[number];
export type AttendanceExplanationStatus='SUBMITTED'|'ACCEPTED'|'DECLINED'|'WITHDRAWN';
export type AttendanceExplanationItem=Readonly<{id:string;sessionId:string;studentId:string;studentName:string;schoolDate:string;startsAt:string;subjectName:string;sectionName:string;category:AttendanceExplanationCategory;explanation:string;status:AttendanceExplanationStatus;version:number;submittedAt:string;reviewedAt:string|null;schoolResponse:string|null;withdrawnAt:string|null}>;
export type AttendanceExplanationResult=Readonly<{id:string;status:AttendanceExplanationStatus;version:number;replayed:boolean}>;
