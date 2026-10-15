import 'server-only';
import {createAttendanceServices} from '../../backend/composition/attendance';
import type {AttendanceFacade} from '../../backend/modules/attendance/application/sessions';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
import {leadershipGateway} from './access';
const attendance=createAttendanceServices({databaseUrl:process.env.DATABASE_URL??''});
async function scope(identity:Identity|null){return (await accountGateway.getHome(identity)).scope;}
export const attendanceGateway={
 authorizeAdmin(identity:Identity|null){return scope(identity).then(s=>attendance.authorizeAdmin(identity,s.organizationId,s.schoolId));},
 schedule(identity:Identity|null,input:Parameters<AttendanceFacade['schedule']>[3]){return scope(identity).then(s=>attendance.schedule(identity,s.organizationId,s.schoolId,input));},
 open(identity:Identity|null,id:string,input:Parameters<AttendanceFacade['open']>[4]){return scope(identity).then(s=>attendance.open(identity,s.organizationId,s.schoolId,id,input));},
 submit(identity:Identity|null,id:string,input:Parameters<AttendanceFacade['submit']>[4]){return scope(identity).then(s=>attendance.submit(identity,s.organizationId,s.schoolId,id,input));},
 correct(identity:Identity|null,id:string,input:Parameters<AttendanceFacade['correct']>[4]){return scope(identity).then(s=>attendance.correct(identity,s.organizationId,s.schoolId,id,input));},
 cancel(identity:Identity|null,id:string,input:Parameters<AttendanceFacade['cancel']>[4]){return scope(identity).then(s=>attendance.cancel(identity,s.organizationId,s.schoolId,id,input));},
 commandStatus(identity:Identity|null,command:string,key:string){return scope(identity).then(s=>attendance.commandStatus(identity,s.organizationId,s.schoolId,command,key));},
 history(identity:Identity|null,id:string,pagination?:{cursor?:unknown;limit?:unknown}){return scope(identity).then(s=>attendance.history(identity,s.organizationId,s.schoolId,id,pagination));},
 schoolDay(identity:Identity|null,date:string){return scope(identity).then(s=>attendance.schoolDay(identity,s.organizationId,s.schoolId,date));},
 teacherDay(identity:Identity|null,date:unknown){return scope(identity).then(s=>attendance.teacherDay(identity,s.organizationId,s.schoolId,date));},
 teacherHistory(identity:Identity|null,query:Readonly<Record<string,unknown>>){return scope(identity).then(s=>attendance.teacherHistory(identity,s.organizationId,s.schoolId,query));},
 detail(identity:Identity|null,id:string){return scope(identity).then(s=>attendance.detail(identity,s.organizationId,s.schoolId,id));},
};
export const leadershipAttendanceGateway={get(identity:Identity|null,input:Readonly<{date?:unknown;cursor?:unknown;limit?:unknown}>={}){return leadershipGateway.getHome(identity).then(home=>attendance.get(identity,home.scope.organizationId,home.scope.schoolId,input));}};
