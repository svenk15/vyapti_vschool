export type AssessmentReportAudience='STUDENT'|'GUARDIANS'|'BOTH';
export type AssessmentReportHandoffState='PENDING'|'PUBLISHED'|'WITHDRAWN';
export type AssessmentReportRecipientKind='GUARDIAN'|'STUDENT';

export type AssessmentReportPublicationWorkspace=Readonly<{
 definitionVersion:'assessment-report-publication.v1';asOf:string;timezone:string;actorAccountId:string;permissions:Readonly<{canAssign:boolean;canPublish:boolean;canWithdraw:boolean}>;
 templates:readonly Readonly<{id:string;code:string;versionNo:number;name:string;signatoryName:string;signatoryTitle:string;synthetic:boolean}>[];
 publishers:readonly Readonly<{accountId:string;displayName:string}>[];
 reports:readonly Readonly<{reportRevisionId:string;reportNumber:number;reportReference:string;studentId:string;studentName:string;admissionNumber:string;cycleId:string;cycleName:string;academicPeriod:string;status:'WITHHELD'|'APPROVED'|'PUBLISHED'|'WITHDRAWN';sourceDigest:string;sourceCurrent:boolean;eligibleGuardianCount:number;eligibleStudentCount:number;handoff:Readonly<{id:string;audience:AssessmentReportAudience;publisherAccountId:string;publisherName:string;status:AssessmentReportHandoffState;version:number;guardianCount:number;studentCount:number;publicationId:string|null;publishedAt:string|null;withdrawnAt:string|null;withdrawalReason:string|null;documentVersionId:string|null;documentGrantId:string|null}>|null}>[];
}>;

export type AssessmentReportHandoffResult=Readonly<{command:'AssignAssessmentReportPublisher';handoffId:string;reportRevisionId:string;audience:AssessmentReportAudience;publisherAccountId:string;version:number;guardianCount:number;studentCount:number;replayed:boolean}>;
export type AssessmentReportPublicationResult=Readonly<{command:'PublishAssessmentReport';handoffId:string;publicationId:string;reportRevisionId:string;audience:AssessmentReportAudience;documentVersionId:string;documentGrantId:string;guardianCount:number;studentCount:number;version:number;publishedAt:string;replayed:boolean}>;
export type AssessmentReportWithdrawalResult=Readonly<{command:'WithdrawAssessmentReport';handoffId:string;publicationId:string;version:number;status:'WITHDRAWN';reason:string;withdrawnAt:string;replayed:boolean}>;
export type AssessmentReportCommandResult=AssessmentReportHandoffResult|AssessmentReportPublicationResult|AssessmentReportWithdrawalResult;
export type AssessmentReportCommandStatus=Readonly<{state:'UNKNOWN'}>|Readonly<{state:'CHANGED';currentVersion:number;currentState:string}>|Readonly<{state:'FOUND';result:AssessmentReportCommandResult}>;

export type AssessmentReportSource=Readonly<{organizationId:string;schoolId:string;handoffId:string;reportRevisionId:string;reportReference:string;schoolName:string;studentName:string;admissionNumber:string;academicPeriod:string;cycleName:string;templateName:string;templateVersion:number;signatoryName:string;signatoryTitle:string;sourceDigest:string;audience:AssessmentReportAudience;publicationTime:string;subjects:readonly Readonly<{name:string;outcome:string}>[]}>;
export type AssessmentReportDocument=Readonly<{filename:string;bytes:Uint8Array;sha256:string}>;

export type AssessmentReportPortal=Readonly<{definitionVersion:'assessment-report-recipient.v1';asOf:string;studentId:string;studentName:string;items:readonly Readonly<{publicationId:string;reportReference:string;cycleName:string;academicPeriod:string;publishedAt:string;withdrawn:boolean;withdrawnAt:string|null;downloadHref:string|null}>[]}>;
