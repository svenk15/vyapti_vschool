import 'server-only';
import {createAttendanceServices} from '../../backend/composition/attendance';
import type {AttendanceFacade} from '../../backend/modules/attendance/application/sessions';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
const attendance=createAttendanceServices({databaseUrl:process.env.DATABASE_URL??''});
async function scope(identity:Identity|null){return (await accountGateway.getHome(identity)).scope;}
export const attendanceGateway={
 authorizeAdmin(identity:Identity|null){return scope(identity).then(s=>attendance.authorizeAdmin(identity,s.organizationId,s.schoolId));},
 schedule(identity:Identity|null,input:Parameters<AttendanceFacade['schedule']>[3]){return scope(identity).then(s=>attendance.schedule(identity,s.organizationId,s.schoolId,input));},
 teacherDay(identity:Identity|null,date:unknown){return scope(identity).then(s=>attendance.teacherDay(identity,s.organizationId,s.schoolId,date));},
 detail(identity:Identity|null,id:string){return scope(identity).then(s=>attendance.detail(identity,s.organizationId,s.schoolId,id));},
};
