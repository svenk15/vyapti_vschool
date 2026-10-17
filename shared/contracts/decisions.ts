import type {CoordinationSourceSummary} from './coordination';

export const decisionOwners=['COORDINATION_VERIFICATION'] as const;
export type DecisionOwner=typeof decisionOwners[number];
export type DecisionAction='VERIFY'|'RETURN';
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
}>;
export type DecisionQueue=Readonly<{items:readonly DecisionSummary[];nextCursor:string|null;timezone:string;owners:readonly DecisionOwner[];query:DecisionQuery;filters:Readonly<{types:readonly Readonly<{value:DecisionType;label:string}>[];states:readonly Readonly<{value:'READY';label:string}>[];duePeriods:readonly Readonly<{value:DecisionDuePeriod;label:string}>[]}>}>;
export type DecisionResult=Readonly<{owner:DecisionOwner;itemId:string;version:number;state:'RESOLVED'|'RETURNED';replayed:boolean}>;
export type DecisionCommandStatus=
 | Readonly<{state:'UNKNOWN'}>
 | Readonly<{state:'CHANGED';currentVersion:number;currentState:string}>
 | Readonly<{state:'FOUND';result:DecisionResult}>;
