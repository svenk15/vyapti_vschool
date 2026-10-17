import 'server-only';
import type {Identity} from '../../shared/contracts/access';
import {AccessError} from '../../backend/modules/access/contracts';
import {createAssessmentsServices} from '../../backend/composition/assessments';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {accountGateway,adminGateway,leadershipGateway} from './access';
type Services=ReturnType<typeof createAssessmentsServices>;let services:Services|undefined;try{services=createAssessmentsServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),mode:process.env.VSCHOOL_ASSESSMENTS_MODE==='synthetic'?'synthetic':'disabled'});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;};
async function adminScope(identity:Identity|null){if(!identity)throw new AccessError('UNAUTHENTICATED');const home=await adminGateway.getHome(identity);return {identity,organizationId:home.scope.organizationId,schoolId:home.scope.schoolId};}
async function teacherScope(identity:Identity|null){if(!identity)throw new AccessError('UNAUTHENTICATED');const home=await accountGateway.getHome(identity);return {identity,organizationId:home.scope.organizationId,schoolId:home.scope.schoolId};}
export const assessmentsGateway={
 async leadershipReadiness(identity:Identity|null,cycleId?:string){if(!identity)throw new AccessError('UNAUTHENTICATED');const home=await leadershipGateway.getHome(identity);return service().leadershipReadiness(identity,home.scope.organizationId,home.scope.schoolId,cycleId);},
 async planningWorkspace(identity:Identity|null){const scope=await adminScope(identity);return service().planningWorkspace(scope.identity,scope.organizationId,scope.schoolId);},
 async createScale(identity:Identity|null,input:Record<string,unknown>){const scope=await adminScope(identity);return service().createScale(scope.identity,scope.organizationId,scope.schoolId,input);},
 async createCycle(identity:Identity|null,input:Record<string,unknown>){const scope=await adminScope(identity);return service().createCycle(scope.identity,scope.organizationId,scope.schoolId,input);},
 async freezeCohort(identity:Identity|null,input:Record<string,unknown>){const scope=await adminScope(identity);return service().freezeCohort(scope.identity,scope.organizationId,scope.schoolId,input);},
 async commandStatus(identity:Identity|null,command:unknown,key:unknown){const scope=await adminScope(identity);return service().commandStatus(scope.identity,scope.organizationId,scope.schoolId,command,key);},
 async markWorkspace(identity:Identity|null){const scope=await teacherScope(identity);return service().markWorkspace(scope.identity,scope.organizationId,scope.schoolId);},
 async saveMark(identity:Identity|null,input:Record<string,unknown>){const scope=await teacherScope(identity);return service().saveMark(scope.identity,scope.organizationId,scope.schoolId,input);},
 async markStatus(identity:Identity|null,key:unknown){const scope=await teacherScope(identity);return service().markStatus(scope.identity,scope.organizationId,scope.schoolId,key);}
 ,async moderationWorkspace(identity:Identity|null){const scope=await teacherScope(identity);return service().workspace(scope.identity,scope.organizationId,scope.schoolId);}
 ,async submitModeration(identity:Identity|null,input:Record<string,unknown>){const scope=await teacherScope(identity);return service().submit(scope.identity,scope.organizationId,scope.schoolId,input);}
 ,async respondModeration(identity:Identity|null,input:Record<string,unknown>){const scope=await teacherScope(identity);return service().respond(scope.identity,scope.organizationId,scope.schoolId,input);}
 ,async moderationStatus(identity:Identity|null,command:unknown,key:unknown){const scope=await teacherScope(identity);return service().teacherStatus(scope.identity,scope.organizationId,scope.schoolId,command,key);}
};
export {services as assessmentsServices};
