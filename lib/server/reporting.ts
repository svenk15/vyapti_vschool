import 'server-only';
import {createReportingServices} from '../../backend/composition/reporting';
import type {AttendanceReportInput} from '../../backend/modules/reporting/application/attendance-report';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
const reporting=createReportingServices({databaseUrl:process.env.DATABASE_URL??''});
export const reportingGateway={
 overview:async(identity:Identity|null,input:AttendanceReportInput)=>{const scope=(await accountGateway.getHome(identity)).scope;return reporting.overview(identity,scope.organizationId,scope.schoolId,input);},
 exportAttendance:async(identity:Identity|null,input:AttendanceReportInput)=>{const scope=(await accountGateway.getHome(identity)).scope;return reporting.exportAttendance(identity,scope.organizationId,scope.schoolId,input);},
};
