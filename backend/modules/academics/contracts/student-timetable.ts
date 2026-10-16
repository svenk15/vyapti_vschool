import type {Identity} from '../../../../shared/contracts/access';
import type {StudentSelfTimetableWeek} from '../../../../shared/contracts/student-portal';
export interface StudentTimetablePort{week(identity:Identity,studentId:string,weekStart:string):Promise<StudentSelfTimetableWeek>}
