import type {Identity} from '../../../../shared/contracts/access';
import type {CoordinationEvidenceKind,CoordinationRequestKind,CoordinationSourceSummary} from '../../../../shared/contracts/coordination';

export interface CoordinationSourceAdapter {
 readonly sourceType:CoordinationSourceSummary['type'];
 readonly requestKinds:readonly CoordinationRequestKind[];
 inspect(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string;sourceId:string}):Promise<CoordinationSourceSummary>;
 verify(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string;sourceId:string;kind:CoordinationEvidenceKind;revision:number|null}):Promise<void>;
 eligibleAssignee(transaction:object,input:{organizationId:string;schoolId:string;sourceId:string;requestKind:CoordinationRequestKind;accountId:string}):Promise<boolean>;
}
