import 'server-only';
import {createReportingServices} from '../../backend/composition/reporting';
import type {AttendanceReportInput} from '../../backend/modules/reporting/application/attendance-report';
import type {Identity} from '../../shared/contracts/access';
import type {LeadershipAttendanceExportInput,LeadershipBranchComparisonInput,LeadershipBriefDraftInput,LeadershipLearningExportInput} from '../../shared/contracts/reporting';
import {accountGateway,leadershipGateway} from './access';
import {reportingRuntimeConfiguration} from './reporting-runtime-configuration';
const reporting=createReportingServices(reportingRuntimeConfiguration());
export const reportingGateway={
 overview:async(identity:Identity|null,input:AttendanceReportInput)=>{const scope=(await accountGateway.getHome(identity)).scope;return reporting.overview(identity,scope.organizationId,scope.schoolId,input);},
 exportAttendance:async(identity:Identity|null,input:AttendanceReportInput)=>{const scope=(await accountGateway.getHome(identity)).scope;return reporting.exportAttendance(identity,scope.organizationId,scope.schoolId,input);},
 schoolAdminOverview:async(identity:Identity|null)=>{const scope=(await accountGateway.getHome(identity)).scope;return reporting.schoolAdminOverview(identity,scope.organizationId,scope.schoolId);},
 leadershipExportAvailability:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.availability(identity,scope.organizationId,scope.schoolId);},
 exportLeadershipAttendance:async(identity:Identity|null,input:LeadershipAttendanceExportInput)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.exportLeadershipAttendance(identity,scope.organizationId,scope.schoolId,input);},
 exportLeadershipAssignmentCompletion:async(identity:Identity|null,input:LeadershipLearningExportInput)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.exportLeadershipAssignmentCompletion(identity,scope.organizationId,scope.schoolId,input);},
 exportLeadershipFeedbackTurnaround:async(identity:Identity|null,input:LeadershipLearningExportInput)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.exportLeadershipFeedbackTurnaround(identity,scope.organizationId,scope.schoolId,input);},
 exportLeadershipTimetableExceptions:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.exportLeadershipTimetableExceptions(identity,scope.organizationId,scope.schoolId);},
 exportLeadershipNoticeCoverage:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.exportLeadershipNoticeCoverage(identity,scope.organizationId,scope.schoolId);},
 leadershipSnapshotAvailability:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.snapshotAvailability(identity,scope.organizationId,scope.schoolId);},
 listLeadershipSnapshots:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.listSnapshots(identity,scope.organizationId,scope.schoolId);},
 getLeadershipSnapshot:async(identity:Identity|null,id:string)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.getSnapshot(identity,scope.organizationId,scope.schoolId,id);},
 captureLeadershipAttendanceSnapshot:async(identity:Identity|null,input:{query:LeadershipAttendanceExportInput;key:string})=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.captureAttendanceSnapshot(identity,scope.organizationId,scope.schoolId,input);},
 removeLeadershipSnapshot:async(identity:Identity|null,input:{id:string;expectedVersion:number;key:string;confirmed:true})=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.removeSnapshot(identity,scope.organizationId,scope.schoolId,input);},
 leadershipComparisonAvailability:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.leadershipComparisonAvailability(identity,scope.organizationId,scope.schoolId);},
 compareLeadershipBranches:async(identity:Identity|null,input:LeadershipBranchComparisonInput)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.compareLeadershipBranches(identity,scope.organizationId,scope.schoolId,input);},
 leadershipBriefAvailability:async(identity:Identity|null)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.briefAvailability(identity,scope.organizationId,scope.schoolId);},
 leadershipReviewOptions:async(identity:Identity|null,input:{periodStart:string;periodEnd:string})=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.leadershipReviewOptions(identity,scope.organizationId,scope.schoolId,input);},
 getLeadershipBrief:async(identity:Identity|null,id:string)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.getBrief(identity,scope.organizationId,scope.schoolId,id);},
 createLeadershipBrief:async(identity:Identity|null,input:LeadershipBriefDraftInput)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.createBrief(identity,scope.organizationId,scope.schoolId,input);},
 reviseLeadershipBrief:async(identity:Identity|null,id:string,expectedVersion:number,input:LeadershipBriefDraftInput)=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.reviseBrief(identity,scope.organizationId,scope.schoolId,id,expectedVersion,input);},
 finalizeLeadershipBrief:async(identity:Identity|null,id:string,input:{expectedVersion:number;key:string})=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.finalizeBrief(identity,scope.organizationId,scope.schoolId,id,input);},
 shareLeadershipBrief:async(identity:Identity|null,id:string,input:{expectedVersion:number;key:string})=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.shareBrief(identity,scope.organizationId,scope.schoolId,id,input);},
 withdrawLeadershipBrief:async(identity:Identity|null,id:string,input:{expectedVersion:number;reason:string;key:string})=>{const scope=(await leadershipGateway.getHome(identity)).scope;return reporting.withdrawBrief(identity,scope.organizationId,scope.schoolId,id,input);},
};
