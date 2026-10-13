import type {Identity} from '../../../../shared/contracts/access';
import type {StudentSelfAttendanceHistory} from '../../../../shared/contracts/student-portal';
export interface StudentAttendanceHistoryPort{history(identity:Identity,studentId:string,from:string,until:string):Promise<StudentSelfAttendanceHistory>}
