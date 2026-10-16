import 'server-only';
import {createReportingServices} from '../../backend/composition/reporting';
import type {AttendanceReportInput} from '../../backend/modules/reporting/application/attendance-report';
import type {Identity} from '../../shared/contracts/access';
import type {LeadershipAttendanceExportInput} from '../../shared/contracts/reporting';
import {accountGateway,leadershipGateway} from './access';
import {reportingRuntimeConfiguration} from './reporting-runtime-configuration';
const reporting=createReportingServices(reportingRuntimeConfiguration());
export const reportingGateway={
 overview:async(identity:Identity|null,input:AttendanceReportInput)=>{const scope=(await accountGateway.getHome(identity)).scope;return reporting.overview(identity,scope.organizationId,scope.schoolId,input);},
 exportAttendance:async(identity:Identity|null,input:AttendanceReportInput)=>{const scope=(await accountGateway.getHome(identity)).scope;return reporting.exportAttendance(identity,scope.organizationId,scope.schoolId,input);},
 schoolAdminOverview:async(identity:Identity|null)=>{const scope=(await accountGateway.getHome(identity)).scope;return reporting.schoolAdminOverview(identity,scope.organizationId,scope.schoolId);},
 leadershipExportAvailability:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.availability(identity,scope.organizationId,scope.schoolId);},
 exportLeadershipAttendance:async(identity:Identity|null,input:LeadershipAttendanceExportInput)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.exportLeadershipAttendance(identity,scope.organizationId,scope.schoolId,input);},
 leadershipSnapshotAvailability:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.snapshotAvailability(identity,scope.organizationId,scope.schoolId);},
 listLeadershipSnapshots:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.listSnapshots(identity,scope.organizationId,scope.schoolId);},
 getLeadershipSnapshot:async(identity:Identity|null,id:string)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.getSnapshot(identity,scope.organizationId,scope.schoolId,id);},
 captureLeadershipAttendanceSnapshot:async(identity:Identity|null,input:{query:LeadershipAttendanceExportInput;key:string})=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.captureAttendanceSnapshot(identity,scope.organizationId,scope.schoolId,input);},
 removeLeadershipSnapshot:async(identity:Identity|null,input:{id:string;expectedVersion:number;key:string;confirmed:true})=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.removeSnapshot(identity,scope.organizationId,scope.schoolId,input);},
};
