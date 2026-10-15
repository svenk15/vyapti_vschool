import 'server-only';
import {createAttendanceExplanationServices} from '../../backend/composition/attendance-explanations';
import type {Identity} from '../../shared/contracts/access';
import {AttendanceExplanationError} from '../../backend/modules/attendance/domain/explanations';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {accountGateway} from './access';
let services:ReturnType<typeof createAttendanceExplanationServices>|undefined,failure:AttendanceExplanationError|undefined;
try{services=createAttendanceExplanationServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),protectedExplanationStorageEnabled:process.env.VSCHOOL_PROTECTED_EXPLANATIONS_MODE==='synthetic'});}catch{failure=new AttendanceExplanationError('UNAVAILABLE');}
const service=()=>{if(!services)throw failure??new AttendanceExplanationError('UNAVAILABLE');return services;};
const required=(identity:Identity|null)=>{if(!identity)throw new AttendanceExplanationError('UNAUTHENTICATED');return identity;};
async function admin(identity:Identity|null){const actor=required(identity),home=await accountGateway.getHome(actor);return {actor,...home.scope};}
export const attendanceExplanationsGateway={
 submit:(identity:Identity|null,input:Parameters<ReturnType<typeof createAttendanceExplanationServices>['submit']>[1])=>service().submit(required(identity),input),
 listParent:(identity:Identity|null,studentId:unknown)=>service().listParent(required(identity),studentId),
 getParent:(identity:Identity|null,studentId:unknown,id:unknown)=>service().getParent(required(identity),studentId,id),
 withdraw:(identity:Identity|null,input:Parameters<ReturnType<typeof createAttendanceExplanationServices>['withdraw']>[1])=>service().withdraw(required(identity),input),
 async listReviewer(identity:Identity|null){const {actor,organizationId,schoolId}=await admin(identity);return service().listReviewer(actor,organizationId,schoolId);},
 async getReviewer(identity:Identity|null,id:unknown){const {actor,organizationId,schoolId}=await admin(identity);return service().getReviewer(actor,organizationId,schoolId,id);},
 async review(identity:Identity|null,input:Omit<Parameters<ReturnType<typeof createAttendanceExplanationServices>['review']>[1],'organizationId'|'schoolId'>){const {actor,organizationId,schoolId}=await admin(identity);return service().review(actor,{organizationId,schoolId,...input});}
};
