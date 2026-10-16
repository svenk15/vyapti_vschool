import type {Identity} from '../../../../shared/contracts/access';
import type {GuardianAttendanceHistory} from '../../../../shared/contracts/guardians';
export interface GuardianAttendancePort{history(identity:Identity,studentId:string,from:string,until:string):Promise<GuardianAttendanceHistory>}
