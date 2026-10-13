import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherRosterStudent} from '../../../../shared/contracts/teacher-classes';

export interface TeacherClassRosterPort{
 list(transaction:object,actor:Identity,input:{organizationId:string;schoolId:string;sectionId:string;schoolDate:string}):Promise<readonly TeacherRosterStudent[]>;
}
