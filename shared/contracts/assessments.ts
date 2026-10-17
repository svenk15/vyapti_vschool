export type AssessmentOutcomeState='NUMERIC'|'NOT_ASSESSED'|'ABSENT'|'EXCUSED';
export type AssessmentCycleState='DRAFT'|'OPEN'|'MARKING'|'MODERATION'|'APPROVED'|'RELEASED'|'WITHDRAWN';
export type AssessmentReadiness=Readonly<{
 definitionVersion:'assessment-readiness.v1';asOf:string;timezone:string;
 cycle:Readonly<{id:string;code:string;name:string;state:AssessmentCycleState;schemeVersion:number;version:number;academicYearName:string;sectionName:string;sourceCutoff:string}>;
 scale:Readonly<{name:string;minimumScaled:number;maximumScaled:number;precision:number;rounding:'HALF_UP'|'HALF_EVEN'}>;
 counts:Readonly<{requiredSlots:number;optionalSlots:number;numeric:number;notAssessed:number;absent:number;excused:number;missing:number;moderationPending:number;moderationApproved:number;moderationReturned:number;moderationRejected:number;reportsWithheld:number;reportsApproved:number;reportsPublished:number;reportsWithdrawn:number}>;
 blockers:readonly ('MISSING_REQUIRED_OUTCOMES'|'MODERATION_PENDING'|'MODERATION_RETURNED'|'MODERATION_REJECTED')[];
 readyForApproval:boolean;
 subjects:readonly Readonly<{planItemId:string;subjectName:string;required:boolean;maximumScaled:number;weightBasisPoints:number;numeric:number;notAssessed:number;absent:number;excused:number;missing:number;moderationStatus:'PENDING'|'APPROVED'|'RETURNED'|'REJECTED'|null}>[];
}>;
