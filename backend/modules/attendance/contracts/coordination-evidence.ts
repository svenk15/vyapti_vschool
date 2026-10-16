import type {Identity} from '../../../../shared/contracts/access';
import type {CoordinationEvidenceKind,CoordinationSourceSummary} from '../../../../shared/contracts/coordination';

export interface AttendanceCoordinationEvidencePort {
 inspect(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string;sessionId:string}):Promise<CoordinationSourceSummary>;
 verify(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string;sessionId:string;kind:CoordinationEvidenceKind;revision:number|null}):Promise<void>;
}
