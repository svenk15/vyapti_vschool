import type {Identity} from '../../../../shared/contracts/access';

export type CoordinationReviewAction=Readonly<{
 requestId:string;version:number;kind:string;sourceType:string;sourceId:string;
 status:'OPEN'|'IN_PROGRESS'|'AWAITING_VERIFICATION'|'RESOLVED';
 assignee:Readonly<{accountId:string;displayName:string}>|null;
 dueAt:string|null;overdue:boolean;evidence:Readonly<{kind:string;revision:number|null}>|null;updatedAt:string;
}>;
export type CoordinationReviewProjection=Readonly<{status:'AVAILABLE'|'LIMIT_EXCEEDED';timezone:string;periodStart:string;periodEnd:string;items:readonly CoordinationReviewAction[]}>;

export interface CoordinationLeadershipReviewPort {
 project(transaction:object,actor:Identity,input:Readonly<{organizationId:string;schoolId:string;periodStart:string;periodEnd:string;requestIds?:readonly string[]}>):Promise<CoordinationReviewProjection>;
 authorizeAccounts(transaction:object,input:Readonly<{organizationId:string;schoolId:string;periodStart:string;periodEnd:string;requestIds:readonly string[];accountIds:readonly string[]}>):Promise<void>;
}
