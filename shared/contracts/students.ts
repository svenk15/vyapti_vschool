export type StudentEnrollmentSummary = Readonly<{ enrollmentId:string;yearId:string;yearCode:string;yearName:string }>;
export type StudentPlacementRecord = Readonly<{ placementId:string;sectionId:string;sectionCode:string;sectionName:string;gradeName:string;validFrom:string;validTo:string;rollNumber:string|null;activeRosterCount:number }>;
export type StudentEnrollmentHistory = Readonly<{ enrollmentId:string;version:number;yearId:string;yearCode:string;yearName:string;validFrom:string;validTo:string;placements:readonly StudentPlacementRecord[] }>;
export type EnrollmentOptions = Readonly<{ today:string;enrolledYearIds:readonly string[];years:readonly Readonly<{yearId:string;code:string;name:string;startsOn:string;endsOn:string;sections:readonly Readonly<{sectionId:string;code:string;name:string;gradeName:string}>[]}>[] }>;
export type EnrollmentResult = Readonly<{ enrollmentId:string;version:number;studentId:string;yearId:string;yearCode:string;yearName:string;validFrom:string;validTo:string;placement:StudentPlacementRecord;replayed:boolean }>;
export type StudentTransferResult=Readonly<{enrollmentId:string;version:number;studentId:string;yearId:string;history:readonly StudentEnrollmentHistory[];replayed:boolean}>;
export type StudentArchiveResult=Readonly<{studentId:string;version:number;status:"ARCHIVED";replayed:boolean}>;
export type PersonNameRevisionRecord=Readonly<{id:string;version:number;previousDisplayName:string;correctedDisplayName:string;reason:string;occurredAt:string}>;
export type StudentNameCorrectionResult=Readonly<{studentId:string;personVersion:number;revisionId:string;replayed:boolean}>;
export type StudentProfile = Readonly<{
  studentId: string;
  personId: string;
  version: number;
  admissionNumber: string;
  displayName: string;
  firstName:string;
  lastName:string;
  personVersion:number;
  status: "ACTIVE" | "ARCHIVED";
  enrollment: StudentEnrollmentSummary|null;
}>;

export type StudentWorkspace = Readonly<{ items: readonly StudentProfile[]; nextCursor: string | null }>;
export type StudentDetail = StudentProfile & Readonly<{ history: readonly StudentEnrollmentHistory[];nameCorrectionAllowed:boolean;nameHistory:readonly PersonNameRevisionRecord[] }>;
export type ExistingPersonChoice = Readonly<{
  personId: string;
  displayName: string;
  source: "PERSON_ID" | "ADMISSION_NUMBER";
  eligibleForRegistration: boolean;
  existingStudentId: string | null;
}>;
