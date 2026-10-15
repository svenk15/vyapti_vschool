import 'server-only';
import {createStudentPortalServices} from '../../backend/composition/student-portal';
import type {StudentPortalAccessFacade} from '../../backend/modules/students/application/portal-access';
import {StudentPortalError} from '../../backend/modules/students/domain/portal-policy';
import type {Identity} from '../../shared/contracts/access';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {accountGateway} from './access';
import {emailSender} from './email';
type Services=ReturnType<typeof createStudentPortalServices>;
let services:Services|undefined,configurationFailure:StudentPortalError|undefined;
try{services=createStudentPortalServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),emailSender:{sendStudentInvite:input=>emailSender.sendStudentInvite?.(input)??Promise.resolve({ok:false as const,reason:'Email delivery is not configured'})},now:()=>new Date()});}catch{configurationFailure=new StudentPortalError('UNAVAILABLE');}
function service(){if(!services)throw configurationFailure??new StudentPortalError('UNAVAILABLE');return services;}
function required(identity:Identity|null):Identity{if(!identity)throw new StudentPortalError('UNAUTHENTICATED');return identity;}
async function adminScope(identity:Identity|null){const actor=required(identity),home=await accountGateway.getHome(actor);return {actor,...home.scope};}
export const studentPortalGateway={
 async listForStudent(identity:Identity|null,studentId:string){const {actor,organizationId,schoolId}=await adminScope(identity);return service().listForStudent(actor,{organizationId,schoolId,studentId});},
 async authorize(identity:Identity|null,studentId:string,input:Omit<Parameters<StudentPortalAccessFacade['authorize']>[1],'organizationId'|'schoolId'|'studentId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().authorize(actor,{organizationId,schoolId,studentId,...input});},
 async setNoticePurpose(identity:Identity|null,accessId:string,input:Omit<Parameters<StudentPortalAccessFacade['setNoticePurpose']>[1],'organizationId'|'schoolId'|'accessId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().setNoticePurpose(actor,{organizationId,schoolId,accessId,...input});},
 async setCalendarPurpose(identity:Identity|null,accessId:string,input:Omit<Parameters<StudentPortalAccessFacade['setCalendarPurpose']>[1],'organizationId'|'schoolId'|'accessId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().setCalendarPurpose(actor,{organizationId,schoolId,accessId,...input});},
 async setLearningPurpose(identity:Identity|null,accessId:string,input:Omit<Parameters<StudentPortalAccessFacade['setLearningPurpose']>[1],'organizationId'|'schoolId'|'accessId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().setLearningPurpose(actor,{organizationId,schoolId,accessId,...input});},
 async resend(identity:Identity|null,accessId:string,input:Omit<Parameters<StudentPortalAccessFacade['resend']>[1],'organizationId'|'schoolId'|'accessId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().resend(actor,{organizationId,schoolId,accessId,...input});},
 async revoke(identity:Identity|null,accessId:string,input:Omit<Parameters<StudentPortalAccessFacade['revoke']>[1],'organizationId'|'schoolId'|'accessId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().revoke(actor,{organizationId,schoolId,accessId,...input});},
 accept:(identity:Identity|null,input:Parameters<StudentPortalAccessFacade['accept']>[1])=>service().accept(identity,input),
 workspace:(identity:Identity|null)=>service().workspace(required(identity)),
 attendance:(identity:Identity|null,studentId:string,from:string,until:string)=>service().attendance(required(identity),studentId,from,until),
 timetable:(identity:Identity|null,studentId:string,weekStart:string)=>service().timetable(required(identity),studentId,weekStart),
 classes:(identity:Identity|null,studentId:string)=>service().classes(required(identity),studentId)
};
