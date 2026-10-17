import type {Identity} from '../../../../shared/contracts/access';
import type {DecisionAction,DecisionCommandStatus,DecisionDetail,DecisionDuePeriod,DecisionOrder,DecisionOwner,DecisionResult,DecisionSort,DecisionSummary,DecisionType} from '../../../../shared/contracts/decisions';

export type DecisionListInput=Readonly<{reference?:unknown;type?:unknown;state?:unknown;due?:unknown;sort?:unknown;order?:unknown;cursor?:unknown;limit?:unknown}>;
export type ValidDecisionListInput=Readonly<{reference:string|null;type:DecisionType|null;state:'READY'|null;due:DecisionDuePeriod|null;sort:DecisionSort;order:DecisionOrder;cursor:string|null;limit:number}>;
export type DecisionCommand=Readonly<{action:DecisionAction;expectedVersion:number;reason:string|null;key:string}>;

export interface DecisionOwnerAdapter {
 readonly owner:DecisionOwner;
 list(actor:Identity,organizationId:string,schoolId:string,input:ValidDecisionListInput):Promise<{items:readonly DecisionSummary[];nextCursor:string|null;timezone:string}>;
 get(actor:Identity,organizationId:string,schoolId:string,itemId:string):Promise<DecisionDetail>;
 decide(actor:Identity,organizationId:string,schoolId:string,itemId:string,input:DecisionCommand):Promise<DecisionResult>;
 status(actor:Identity,organizationId:string,schoolId:string,itemId:string,input:DecisionCommand):Promise<DecisionCommandStatus>;
}
