import type {CoordinationSourceSummary} from './coordination';

export const decisionOwners=['COORDINATION_VERIFICATION'] as const;
export type DecisionOwner=typeof decisionOwners[number];
export type DecisionAction='VERIFY'|'RETURN'|'REQUEST_INFORMATION'|'RECUSE';
export const decisionRecusalCategories=['PERSONAL_CONFLICT','REQUESTER_OR_SUBJECT','OTHER_DUTY_CONFLICT'] as const;
export type DecisionRecusalCategory=typeof decisionRecusalCategories[number];
export type DecisionReviewer=Readonly<{accountId:string;displayName:string}>;
export type DecisionType='ATTENDANCE_FOLLOW_UP'|'LEARNING_FOLLOW_UP';
export type DecisionDuePeriod='OVERDUE'|'NEXT_7_DAYS'|'LATER'|'NO_DUE_DATE';
export type DecisionSort='due'|'submitted';
export type DecisionOrder='asc'|'desc';
export type DecisionQuery=Readonly<{reference:string|null;type:DecisionType|null;state:'READY'|null;due:DecisionDuePeriod|null;sort:DecisionSort;order:DecisionOrder}>;
export type DecisionSummary=Readonly<{
 owner:DecisionOwner;
 itemId:string;
 version:number;
 reference:string;
 typeLabel:string;
 title:string;
 description:string;
 state:'READY';
 submittedAt:string;
 dueAt:string|null;
 source:CoordinationSourceSummary;
 allowedActions:readonly DecisionAction[];
}>;
export type DecisionDetail=DecisionSummary&Readonly<{
 proposer:{accountId:string;displayName:string};
 resolution:{kind:string;revision:number|null;reason:string};
 returnHref:string;
 informationRequest:Readonly<{id:string;question:string;responseDueAt:string|null;recipientName:string;status:'OPEN'|'ANSWERED'|'CANCELLED';responseText:string|null;version:number}>|null;
 reviewers:readonly DecisionReviewer[];
}>;
export type DecisionInformationResult=Readonly<{owner:DecisionOwner;itemId:string;informationRequestId:string;version:number;status:'OPEN';replayed:boolean}>;
export type DecisionRecusalResult=Readonly<{owner:DecisionOwner;itemId:string;version:number;routedTo:DecisionReviewer|null;replayed:boolean}>;
export type DecisionQueue=Readonly<{items:readonly DecisionSummary[];nextCursor:string|null;timezone:string;owners:readonly DecisionOwner[];query:DecisionQuery;filters:Readonly<{types:readonly Readonly<{value:DecisionType;label:string}>[];states:readonly Readonly<{value:'READY';label:string}>[];duePeriods:readonly Readonly<{value:DecisionDuePeriod;label:string}>[]}>}>;
export type DecisionResult=Readonly<{owner:DecisionOwner;itemId:string;version:number;state:'RESOLVED'|'RETURNED';replayed:boolean}>;
export type DecisionCommandStatus=
 | Readonly<{state:'UNKNOWN'}>
 | Readonly<{state:'CHANGED';currentVersion:number;currentState:string}>
 | Readonly<{state:'FOUND';result:DecisionResult}>;
