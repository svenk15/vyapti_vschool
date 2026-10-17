import type {CoordinationSourceSummary} from './coordination';

export const decisionOwners=['COORDINATION_VERIFICATION'] as const;
export type DecisionOwner=typeof decisionOwners[number];
export type DecisionAction='VERIFY'|'RETURN';
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
export type DecisionQueue=Readonly<{items:readonly DecisionSummary[];nextCursor:string|null;timezone:string;owners:readonly DecisionOwner[]}>;
export type DecisionResult=Readonly<{owner:DecisionOwner;itemId:string;version:number;state:'RESOLVED'|'RETURNED';replayed:boolean}>;
