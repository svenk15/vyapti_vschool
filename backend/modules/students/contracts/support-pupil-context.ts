import type {Identity} from '../../../../shared/contracts/access';
import type {SupportPupilCandidate} from '../../../../shared/contracts/support';

export interface SupportPupilContextPort{
 list(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string;studentIds:readonly string[]}):Promise<readonly Omit<SupportPupilCandidate,'grantVersion'>[]>;
}
