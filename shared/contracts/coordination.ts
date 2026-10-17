export const coordinationCapabilities=['coordination.create','coordination.assign','coordination.work','coordination.verify','coordination.manage','coordination.history','coordination.history.finding'] as const;
export type CoordinationCapability=typeof coordinationCapabilities[number];
export const coordinationStatuses=['OPEN','IN_PROGRESS','AWAITING_VERIFICATION','RESOLVED','WITHDRAWN'] as const;
export type CoordinationStatus=typeof coordinationStatuses[number];
export type CoordinationRequestKind='MISSING_REGISTER'|'SESSION_SETUP_REVIEW'|'PUPIL_ATTENDANCE_SUPPORT'|'LEARNING_SUPPORT_REVIEW'|'LEARNING_FEEDBACK_FOLLOW_UP'|'MEETING_FOLLOW_UP'|'FACILITIES_FOLLOW_UP';
export type CoordinationConcern='MISSING_REGISTER'|'WRONG_TIME'|'WRONG_OFFERING'|'DUPLICATE'|'ATTENDANCE_SUPPORT'|'LEARNING_PROGRESS'|'FEEDBACK_AWAITING'|'OTHER';
export type CoordinationEvidenceKind='ATTENDANCE_CORRECTION'|'ATTENDANCE_CANCELLATION'|'LEARNING_POLICY_EVENT'|'LEARNING_FEEDBACK_PUBLICATION'|'FACILITIES_RESTORATION'|'NO_CHANGE_NEEDED';
export type CoordinationSourceSummary=
 |Readonly<{type:'ATTENDANCE_SESSION';id:string;version:number;schoolDate:string;startsAt:string;endsAt:string;sectionName:string;subjectName:string;teacherName:string|null;state:'SCHEDULED'|'OPEN'|'SUBMITTED'|'CANCELLED';eligible:boolean}>
 |Readonly<{type:'ATTENDANCE_PUPIL_PATTERN';id:string;version:number;studentId:string;studentName:string;admissionNumber:string;title:string;sectionName:string;subjectName:string;schoolDate:string;fromDate:string;toDate:string;threshold:number;absentSessions:number;absentDates:number;missingSessions:number;state:'REVIEWED';eligible:boolean}>
 |Readonly<{type:'LEARNING_RECIPIENT';id:string;version:number;assignmentId:string;title:string;sectionName:string;subjectName:string;studentName:string;effectiveDueAt:string;policyVersion:number;state:'UPCOMING'|'AWAITING'|'SUBMITTED'|'EXCUSED';eligible:boolean}>
 |Readonly<{type:'LEARNING_FEEDBACK_SUBMISSION';id:string;version:number;assignmentId:string;title:string;sectionName:string;subjectName:string;acceptedAt:string;firstPublishedAt:string|null;state:'AWAITING'|'PUBLISHED';eligible:boolean}>
 |Readonly<{type:'EVENT_MEETING_ACTION';id:string;version:number;meetingId:string;meetingPurpose:string;description:string;ownerAccountId:string;ownerDisplayName:string;dueAt:string;state:'AGREED';eligible:boolean;sectionName?:never;subjectName?:never;title?:never;schoolDate?:never}>
 |Readonly<{type:'FACILITIES_INCIDENT';id:string;version:number;facility:string;impact:string;affectedFrom:string;affectedTo:string;coordinatorAccountId:string;coordinatorName:string;state:'OPEN'|'INVESTIGATING'|'RESTORATION_PROPOSED'|'VERIFIED_RESTORED'|'CLOSED';eligible:boolean;sectionName?:never;subjectName?:never;title?:never;schoolDate?:never}>;
export type CoordinationActorSummary=Readonly<{accountId:string;displayName:string}>;
export type CoordinationEvent=Readonly<{number:number;type:string;fromStatus:CoordinationStatus|null;toStatus:CoordinationStatus|null;actor:CoordinationActorSummary;previousAssignee:CoordinationActorSummary|null;assignee:CoordinationActorSummary|null;reason:string|null;evidenceKind:CoordinationEvidenceKind|null;evidenceRevision:number|null;occurredAt:string}>;
export type CoordinationRequest=Readonly<{id:string;version:number;kind:CoordinationRequestKind;concern:CoordinationConcern;status:CoordinationStatus;timezone:string;source:CoordinationSourceSummary;creator:CoordinationActorSummary;assignee:CoordinationActorSummary|null;dueAt:string|null;overdue:boolean;note:string|null;resolution:{proposer:CoordinationActorSummary;kind:CoordinationEvidenceKind;revision:number|null;reason:string}|null;informationRequest:CoordinationInformationRequest|null;createdAt:string;updatedAt:string;resolvedAt:string|null;withdrawnAt:string|null;can:{assign:boolean;work:boolean;verify:boolean;manage:boolean;respondInformation:boolean};history:readonly CoordinationEvent[]}>;
export type CoordinationRequestSummary=Omit<CoordinationRequest,'history'>;
export type CoordinationQueue=Readonly<{items:readonly CoordinationRequestSummary[];nextCursor:string|null;timezone:string;capabilities:readonly CoordinationCapability[]}>;
export type CoordinationAvailability=Readonly<{enabled:boolean;capabilities:readonly CoordinationCapability[];reason:'REAL_DATA_POLICY_PENDING'|'NOT_DESIGNATED'|null}>;
export type CoordinationMutationResult=Readonly<{requestId:string;version:number;status:CoordinationStatus;replayed:boolean}>;
export type CoordinationCommandStatus=
 | Readonly<{state:'UNKNOWN'}>
 | Readonly<{state:'CHANGED';currentVersion:number;currentState:CoordinationStatus}>
 | Readonly<{state:'FOUND';result:CoordinationMutationResult}>;
export type CoordinationInformationRequest=Readonly<{id:string;question:string;responseDueAt:string|null;requester:CoordinationActorSummary;recipient:CoordinationActorSummary;status:'OPEN'|'ANSWERED'|'CANCELLED';responseText:string|null;requestedAt:string;answeredAt:string|null;version:number}>;
export type CoordinationInformationResult=Readonly<{requestId:string;informationRequestId:string;requestVersion:number;informationVersion:number;status:'OPEN'|'ANSWERED'|'CANCELLED';replayed:boolean}>;
export type CoordinationDecisionRecusalResult=Readonly<{requestId:string;version:number;routedTo:CoordinationActorSummary|null;replayed:boolean}>;
export type CoordinationDecisionRouteItem=Readonly<{requestId:string;reference:string;version:number;recusedAt:string;reviewers:readonly CoordinationAssignee[]}>;
export type CoordinationDecisionRouteQueue=Readonly<{items:readonly CoordinationDecisionRouteItem[];timezone:string}>;
export type CoordinationDecisionRouteResult=Readonly<{requestId:string;version:number;routedTo:CoordinationActorSummary;replayed:boolean}>;
export type CoordinationAssignee=Readonly<{accountId:string;displayName:string}>;
export type CoordinationSourceSetup=Readonly<{source:CoordinationSourceSummary;assignees:readonly CoordinationAssignee[];timezone:string}>;
export type CoordinationBatchItemStatus='PENDING'|'CREATED'|'ALREADY_EXISTS'|'FAILED';
export type CoordinationBatchInput=Readonly<{sourceIds:readonly string[];kind:CoordinationRequestKind;concern:CoordinationConcern;note:string|null;dueLocal:string|null;assigneeAccountId:string|null;assignmentReason:string|null;key:string}>;
export type CoordinationBatchPreviewItem=Readonly<{ordinal:number;sourceId:string;source:CoordinationSourceSummary|null;disposition:'ELIGIBLE'|'ALREADY_EXISTS'|'UNAVAILABLE';requestId:string|null}>;
export type CoordinationBatchPreview=Readonly<{items:readonly CoordinationBatchPreviewItem[];assignees:readonly CoordinationAssignee[];timezone:string}>;
export type CoordinationBatchItemResult=Readonly<{ordinal:number;sourceId:string;source:CoordinationSourceSummary|null;status:CoordinationBatchItemStatus;requestId:string|null;error:{code:string;message:string}|null}>;
export type CoordinationBatchReceipt=Readonly<{id:string;state:'PROCESSING'|'COMPLETED'|'PARTIAL';input:CoordinationBatchInput;counts:{total:number;created:number;alreadyExists:number;failed:number;pending:number};items:readonly CoordinationBatchItemResult[];createdAt:string;updatedAt:string;completedAt:string|null;replayed:boolean}>;
export type CoordinationHandoverInput=Readonly<{fromAccountId:string;toAccountId:string;items:readonly Readonly<{requestId:string;expectedVersion:number}>[];reason:string;key:string}>;
export type CoordinationHandoverItemResult=Readonly<{ordinal:number;requestId:string;expectedVersion:number;status:'PENDING'|'TRANSFERRED'|'FAILED';resultVersion:number|null;error:{code:string;message:string}|null}>;
export type CoordinationHandoverReceipt=Readonly<{id:string;state:'PROCESSING'|'COMPLETED'|'PARTIAL';input:CoordinationHandoverInput;from:CoordinationActorSummary;to:CoordinationActorSummary;counts:{total:number;transferred:number;failed:number;pending:number};items:readonly CoordinationHandoverItemResult[];createdAt:string;updatedAt:string;completedAt:string|null;replayed:boolean}>;
export type CoordinationHistoryAttribute='reference'|'actor'|'date';
export type CoordinationHistoryItem=Readonly<{eventId:string;requestId:string;number:number;type:string;fromStatus:CoordinationStatus|null;toStatus:CoordinationStatus|null;actor:CoordinationActorSummary;previousAssignee:CoordinationActorSummary|null;assignee:CoordinationActorSummary|null;occurredAt:string}>;
export type CoordinationHistoryFinding=Readonly<{id:string;requestId:string;eventNumber:number;kind:'FINDING'|'ESCALATION';text:string;actor:CoordinationActorSummary;occurredAt:string}>;
export type CoordinationHistoryFindingResult=Readonly<{findingId:string;requestId:string;eventNumber:number;kind:'FINDING'|'ESCALATION';occurredAt:string;replayed:boolean}>;
export type CoordinationHistory=Readonly<{items:readonly CoordinationHistoryItem[];findings:readonly CoordinationHistoryFinding[];canRecordFinding:boolean;nextCursor:string|null;timezone:string;query:{attribute:CoordinationHistoryAttribute;value:string|null;fromDate:string;toDate:string}}>;
