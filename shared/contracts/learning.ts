export type LearningAssignmentStatus='DRAFT'|'PUBLISHED';
export type LearningOffering={id:string;code:string;subject:string;classLabel:string;yearName:string};
export type LearningWorkStatus='TO_DO'|'DRAFT'|'SUBMITTED'|'FEEDBACK_AVAILABLE'|'PUBLISHED';
export type LearningAssignmentSummary={id:string;status:LearningAssignmentStatus;revision:number;version:number|null;title:string;instructions:string;dueAt:string;offering:LearningOffering;recipientCount:number;publishedAt:string|null;workStatus?:LearningWorkStatus};
export type LearningAssignmentSearchBy='title'|'subject';
export type LearningAssignmentSort='due'|'title'|'subject';
export type LearningAssignmentOrder='asc'|'desc';
export type LearningAssignmentPage={items:LearningAssignmentSummary[];nextCursor:string|null};
export type LearningTeacherWorkspace={timezone:string;offerings:LearningOffering[];assignments:LearningAssignmentSummary[]};
export type LearningCommandResult={assignmentId:string;status:LearningAssignmentStatus;revision:number;version:number|null;recipientCount:number;replayed:boolean};
export type LearningStudentDraft={id:string;version:number;text:string;savedAt:string;status:'ACTIVE'|'SUBMITTED'};
export type LearningSubmissionReceipt={submissionId:string;assignmentId:string;attemptNo:1;receiptReference:string;acceptedAt:string;effectiveDueAt:string;replayed:boolean};
export type LearningPublishedFeedback={id:string;version:number;strength:string;nextStep:string;publishedAt:string};
export type LearningFeedbackDraft={id:string;revision:number;strength:string;nextStep:string;savedAt:string};
export type LearningFeedbackDraftResult=LearningFeedbackDraft&{replayed:boolean};
export type LearningFeedbackPublicationReceipt={feedbackId:string;feedbackVersionId:string;version:number;publishedAt:string;replayed:boolean};
export type LearningStudentWork={assignment:LearningAssignmentSummary;draft:LearningStudentDraft|null;submission:(LearningSubmissionReceipt&{text:string})|null;feedback:LearningPublishedFeedback|null;timezone:string};
export type LearningTeacherSubmissionSummary={submissionId:string;studentId:string;studentName:string;attemptNo:1;acceptedAt:string;receiptReference:string;feedbackStatus:'NOT_STARTED'|'DRAFT'|'PUBLISHED'};
export type LearningTeacherSubmissionDetail=LearningTeacherSubmissionSummary&{assignmentId:string;assignmentTitle:string;text:string;effectiveDueAt:string;timezone:string};
export type LearningTeacherFeedback=LearningTeacherSubmissionDetail&{feedbackRevision:number;draft:LearningFeedbackDraft|null;published:LearningPublishedFeedback|null};

export type LeadershipLearningQuery={fromDate:string;toDate:string;classId:string|null;subjectId:string|null;cursor:string|null;limit:number};
export type LeadershipLearningFilter={id:string;label:string};
export type LeadershipLearningAssignment={assignmentId:string;assignmentVersionId:string;title:string;dueAt:string;classId:string;classLabel:string;subjectId:string;subjectName:string;expectedPairs:number;submittedPairs:number;awaitingPairs:number;due:boolean};
export type LeadershipLearningOverview={
 asOf:string;
 timezone:string;
 definitionVersion:'assignment-completion.v1';
 denominatorPolicy:'FROZEN_PUBLISHED_RECIPIENTS_DUE_BY_SERVER_CUTOFF';
 query:LeadershipLearningQuery;
 filters:{classes:readonly LeadershipLearningFilter[];subjects:readonly LeadershipLearningFilter[]};
 counts:{assignments:number;expectedPairs:number;submittedPairs:number;awaitingPairs:number;upcomingPairs:number};
 assignments:{items:readonly LeadershipLearningAssignment[];total:number;nextCursor:string|null};
 limitations:{extensionsSupported:false;excusedSupported:false;pupilDetailSupported:false;followUpSupported:false};
};

export type LeadershipFeedbackTurnaroundQuery={fromDate:string;toDate:string;classId:string|null;subjectId:string|null};
export type LeadershipFeedbackTurnaroundOverview={
 asOf:string;
 timezone:string;
 definitionVersion:'feedback-turnaround.v1';
 cohortPolicy:'ACCEPTED_SUBMISSIONS_IN_INTERVAL';
 clockPolicy:'ELAPSED_CLOCK_TIME_TO_FIRST_PUBLICATION';
 query:LeadershipFeedbackTurnaroundQuery;
 filters:{classes:readonly LeadershipLearningFilter[];subjects:readonly LeadershipLearningFilter[]};
 counts:{acceptedSubmissions:number;firstFeedbackPublished:number;awaitingFeedback:number};
 medianTurnaroundSeconds:number|null;
 limitations:{privateDraftsExcluded:true;laterRevisionsIgnored:true;studentDetailSupported:false;coordinationSupported:false};
};
