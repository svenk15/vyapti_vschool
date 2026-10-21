export type StudentClassSummary = Readonly<{ placementId:string;sectionId:string;sectionCode:string;sectionName:string;gradeName:string }>;
export type StudentEnrollmentSummary = Readonly<{ enrollmentId:string;yearId:string;yearCode:string;yearName:string;currentClass:StudentClassSummary|null }>;
export type StudentPlacementRecord = Readonly<{ placementId:string;sectionId:string;sectionCode:string;sectionName:string;gradeName:string;validFrom:string;validTo:string;rollNumber:string|null;activeRosterCount:number }>;
export type StudentEnrollmentHistory = Readonly<{ enrollmentId:string;version:number;yearId:string;yearCode:string;yearName:string;validFrom:string;validTo:string;placements:readonly StudentPlacementRecord[] }>;
export type EnrollmentOptions = Readonly<{ today:string;enrolledYearIds:readonly string[];years:readonly Readonly<{yearId:string;code:string;name:string;startsOn:string;endsOn:string;sections:readonly Readonly<{sectionId:string;code:string;name:string;gradeName:string}>[]}>[] }>;
export type EnrollmentResult = Readonly<{ enrollmentId:string;version:number;studentId:string;yearId:string;yearCode:string;yearName:string;validFrom:string;validTo:string;placement:StudentPlacementRecord;replayed:boolean }>;
export type StudentTransferResult=Readonly<{enrollmentId:string;version:number;studentId:string;yearId:string;history:readonly StudentEnrollmentHistory[];replayed:boolean}>;
export type StudentArchiveResult=Readonly<{studentId:string;version:number;status:"ARCHIVED";replayed:boolean}>;
export type PersonNameRevisionRecord=Readonly<{id:string;version:number;previousDisplayName:string;correctedDisplayName:string;reason:string;occurredAt:string}>;
export type StudentNameCorrectionResult=Readonly<{studentId:string;personVersion:number;revisionId:string;replayed:boolean}>;
export type StudentAdmissionDateResult=Readonly<{studentId:string;version:number;admittedOn:string;verifiedAt:string;replayed:boolean}>;
export type StudentProfile = Readonly<{
  studentId: string;
  personId: string;
  version: number;
  admissionNumber: string;
  admissionDate:Readonly<{value:string|null;verified:boolean;verifiedAt:string|null;verificationReason:string|null}>;
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

export type StudentRegistrationIdentity = Readonly<
  | { kind:"NEW"; firstName:string; lastName:string }
  | { kind:"EXISTING"; personId:string }
>;
export type StudentRegistrationCommand = Readonly<{
  identity:StudentRegistrationIdentity;
  admissionNumber:string;
  admittedOn:string;
  key:string;
}>;
export type StudentRegistrationStatus = Readonly<
  | { status:"FOUND"; student:StudentProfile & Readonly<{replayed:true}> }
  | { status:"UNKNOWN" }
>;
export type StudentRegistrationNextActions = Readonly<{
  canOpenRecord:boolean;
  canEnroll:boolean;
  canSetUpParentAccess:boolean;
}>;

export type StudentOnboardingPlacementCommand = Readonly<{
  yearId:string;
  sectionId:string;
  startsOn:string;
  lastDay:string;
  rollNumber:string;
  key:string;
}>;
export type StudentOnboardingGuardianCommand = Readonly<{
  displayName:string;
  email:string;
  noticeRead:boolean;
  confirmed:true;
  key:string;
}>;
export type StudentOnboardingCommand = Readonly<{
  registration:StudentRegistrationCommand;
  placement:StudentOnboardingPlacementCommand|null;
  guardian:StudentOnboardingGuardianCommand|null;
}>;
export type StudentOnboardingResult = Readonly<{
  student:StudentProfile&Readonly<{replayed:boolean}>;
  enrollment:EnrollmentResult|null;
  guardian:import("./guardians").GuardianAuthorizationResult|null;
}>;
export type StudentOnboardingStage="REGISTRATION"|"PLACEMENT"|"GUARDIAN";
export type StudentOnboardingPartial = Readonly<{
  student:(StudentProfile&Readonly<{replayed:boolean}>)|null;
  enrollment:EnrollmentResult|null;
}>;
