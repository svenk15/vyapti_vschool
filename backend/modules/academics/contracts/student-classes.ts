import type {Identity} from '../../../../shared/contracts/access';
import type {StudentSelfClass} from '../../../../shared/contracts/student-portal';
export interface StudentClassDirectoryPort{list(identity:Identity,studentId:string):Promise<readonly StudentSelfClass[]>}
