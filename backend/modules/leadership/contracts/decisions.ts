import type {Identity} from '../../../../shared/contracts/access';
import type {DecisionAction,DecisionDetail,DecisionOwner,DecisionResult,DecisionSummary} from '../../../../shared/contracts/decisions';

export type DecisionListInput=Readonly<{cursor?:unknown;limit?:unknown}>;
export type DecisionCommand=Readonly<{action:DecisionAction;expectedVersion:number;reason:string|null;key:string}>;

export interface DecisionOwnerAdapter {
 readonly owner:DecisionOwner;
 list(actor:Identity,organizationId:string,schoolId:string,input:DecisionListInput):Promise<{items:readonly DecisionSummary[];nextCursor:string|null;timezone:string}>;
 get(actor:Identity,organizationId:string,schoolId:string,itemId:string):Promise<DecisionDetail>;
 decide(actor:Identity,organizationId:string,schoolId:string,itemId:string,input:DecisionCommand):Promise<DecisionResult>;
}
