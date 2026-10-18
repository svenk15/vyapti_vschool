import 'server-only';
import {createAttendanceCorrectionRequestServices} from '../../backend/composition/attendance-correction-requests';
import {AttendanceCorrectionRequestError} from '../../backend/modules/attendance/domain/correction-requests';
import type {Identity} from '../../shared/contracts/access';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {accountGateway,leadershipGateway} from './access';
let services:ReturnType<typeof createAttendanceCorrectionRequestServices>|undefined;try{services=createAttendanceCorrectionRequestServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),protectedCorrectionStorageEnabled:process.env.VSCHOOL_PROTECTED_EXPLANATIONS_MODE==='synthetic'});}catch{}
const service=()=>services??(()=>{throw new AttendanceCorrectionRequestError('UNAVAILABLE');})();
const required=(identity:Identity|null)=>{if(!identity)throw new AttendanceCorrectionRequestError('UNAUTHENTICATED');return identity;};
export const attendanceCorrectionRequestsGateway={
 async routingAvailable(identity:Identity|null){const actor=required(identity),scope=(await leadershipGateway.getHome(actor)).scope;return service().routingAvailable(actor,scope.organizationId,scope.schoolId);},
 submit:(identity:Identity|null,input:Parameters<ReturnType<typeof createAttendanceCorrectionRequestServices>['submit']>[1])=>service().submit(required(identity),input),
 listOwn:(identity:Identity|null,kind:unknown,studentId?:unknown)=>service().listOwn(required(identity),kind,studentId),
 getOwn:(identity:Identity|null,kind:unknown,id:unknown,studentId?:unknown)=>service().getOwn(required(identity),kind,id,studentId),
 withdraw:(identity:Identity|null,input:Parameters<ReturnType<typeof createAttendanceCorrectionRequestServices>['withdraw']>[1])=>service().withdraw(required(identity),input),
 async listRouting(identity:Identity|null){const actor=required(identity),scope=(await leadershipGateway.getHome(actor)).scope;return service().listRouting(actor,scope.organizationId,scope.schoolId);},
 async listReviewers(identity:Identity|null){const actor=required(identity),scope=(await leadershipGateway.getHome(actor)).scope;return service().listReviewers(actor,scope.organizationId,scope.schoolId);},
 async route(identity:Identity|null,input:Omit<Parameters<ReturnType<typeof createAttendanceCorrectionRequestServices>['route']>[1],'organizationId'|'schoolId'>){const actor=required(identity),scope=(await leadershipGateway.getHome(actor)).scope;return service().route(actor,{...scope,...input});},
 async listReview(identity:Identity|null){const actor=required(identity),scope=(await accountGateway.getHome(actor)).scope;return service().listReview(actor,scope.organizationId,scope.schoolId);},
 async getReview(identity:Identity|null,id:unknown){const actor=required(identity),scope=(await accountGateway.getHome(actor)).scope;return service().getReview(actor,scope.organizationId,scope.schoolId,id);},
 async decide(identity:Identity|null,input:Omit<Parameters<ReturnType<typeof createAttendanceCorrectionRequestServices>['decide']>[1],'organizationId'|'schoolId'>){const actor=required(identity),scope=(await accountGateway.getHome(actor)).scope;return service().decide(actor,{...scope,...input});}
};
