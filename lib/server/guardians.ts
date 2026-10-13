import 'server-only';
import {GuardianError} from '../../backend/modules/guardians/contracts';
import {createGuardiansServices} from '../../backend/composition/guardians';
import type {FamilyAccessFacade} from '../../backend/modules/guardians/application/family-access';
import type {Identity} from '../../shared/contracts/access';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {accountGateway} from './access';
import {emailSender} from './email';

type Services=ReturnType<typeof createGuardiansServices>;
let services:Services|undefined,configurationFailure:GuardianError|undefined;
try{services=createGuardiansServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),emailSender:{sendFamilyInvite:input=>emailSender.sendFamilyInvite?.(input)??Promise.resolve({ok:false as const,reason:'Email delivery is not configured'})},now:()=>new Date()});}catch{configurationFailure=new GuardianError('UNAVAILABLE');}
function service(){if(!services)throw configurationFailure??new GuardianError('UNAVAILABLE');return services;}
function required(identity:Identity|null):Identity{if(!identity)throw new GuardianError('UNAUTHENTICATED');return identity;}
async function adminScope(identity:Identity|null){const actor=required(identity),home=await accountGateway.getHome(actor);return {actor,...home.scope};}

export const guardiansGateway={
 async listForStudent(identity:Identity|null,studentId:string){const {actor,organizationId,schoolId}=await adminScope(identity);return service().listForStudent(actor,{organizationId,schoolId,studentId});},
 async authorize(identity:Identity|null,studentId:string,input:Omit<Parameters<FamilyAccessFacade['authorize']>[1],'organizationId'|'schoolId'|'studentId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().authorize(actor,{organizationId,schoolId,studentId,...input});},
 async resend(identity:Identity|null,accessId:string,input:Omit<Parameters<FamilyAccessFacade['resend']>[1],'organizationId'|'schoolId'|'accessId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().resend(actor,{organizationId,schoolId,accessId,...input});},
 async remove(identity:Identity|null,accessId:string,input:Omit<Parameters<FamilyAccessFacade['remove']>[1],'organizationId'|'schoolId'|'accessId'>){const {actor,organizationId,schoolId}=await adminScope(identity);return service().remove(actor,{organizationId,schoolId,accessId,...input});},
 accept:(identity:Identity|null,input:Parameters<FamilyAccessFacade['accept']>[1])=>service().accept(identity,input),
 workspace:(identity:Identity|null)=>service().workspace(required(identity)),
 attendance:(identity:Identity|null,studentId:unknown,from:unknown,until:unknown)=>service().attendance(required(identity),studentId,from,until),
 timetable:(identity:Identity|null,studentId:unknown,weekStart:unknown)=>service().timetable(required(identity),studentId,weekStart),
};
