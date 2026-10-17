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

export type AssessmentPlanningWorkspace=Readonly<{
 definitionVersion:'assessment-planning.v1';asOf:string;timezone:string;
 scales:readonly Readonly<{id:string;code:string;name:string;minimumScaled:number;maximumScaled:number;precision:number;rounding:'HALF_UP'|'HALF_EVEN';version:number}>[];
 years:readonly Readonly<{id:string;code:string;name:string;startsOn:string;endsOn:string;sections:readonly Readonly<{id:string;code:string;name:string;gradeName:string}>[]}>[];
 subjects:readonly Readonly<{id:string;code:string;name:string}>[];
 cycles:readonly Readonly<{id:string;code:string;name:string;state:AssessmentCycleState;version:number;schemeVersion:number;sourceCutoff:string;academicYearId:string;academicYearName:string;sectionId:string;sectionName:string;scaleId:string;scaleName:string;planItemCount:number;cohortCount:number}>[];
}>;

export type AssessmentScaleResult=Readonly<{command:'CreateAssessmentScale';scaleId:string;version:number;replayed:boolean}>;
export type AssessmentCycleResult=Readonly<{command:'CreateAssessmentCyclePlan';cycleId:string;version:number;state:'DRAFT';planItemCount:number;replayed:boolean}>;
export type AssessmentFreezeResult=Readonly<{command:'FreezeAssessmentCohort';cycleId:string;version:number;state:'OPEN';cohortCount:number;replayed:boolean}>;
export type AssessmentPlanningResult=AssessmentScaleResult|AssessmentCycleResult|AssessmentFreezeResult;
export type AssessmentPlanningCommandStatus=Readonly<{state:'UNKNOWN'}>|Readonly<{state:'FOUND';result:AssessmentPlanningResult}>;

export type AssessmentMarkWorkspace=Readonly<{
 definitionVersion:'assessment-mark-entry.v1';asOf:string;timezone:string;
 assignments:readonly Readonly<{cycleId:string;cycleName:string;cycleCode:string;cycleState:'OPEN'|'MARKING';cycleVersion:number;planItemId:string;subjectName:string;sectionName:string;maximumScaled:number;scaleMinimumScaled:number;scalePrecision:number;scaleName:string;pupils:readonly Readonly<{cohortMemberId:string;studentId:string;displayName:string;admissionNumber:string;state:AssessmentOutcomeState|null;scoreScaled:number|null;outcomeVersion:number}>[]}>[];
}>;
export type AssessmentMarkResult=Readonly<{command:'SaveAssessmentMarkRevision';cycleId:string;planItemId:string;cohortMemberId:string;outcomeId:string;state:AssessmentOutcomeState;revision:number;version:number;replayed:boolean}>;
export type AssessmentMarkCommandStatus=Readonly<{state:'UNKNOWN'}>|Readonly<{state:'FOUND';result:AssessmentMarkResult}>;
