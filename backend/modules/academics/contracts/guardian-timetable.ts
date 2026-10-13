import type {Identity} from '../../../../shared/contracts/access';
import type {GuardianTimetableWeek} from '../../../../shared/contracts/guardians';
export interface GuardianTimetablePort{week(identity:Identity,studentId:string,weekStart:string):Promise<GuardianTimetableWeek>}
