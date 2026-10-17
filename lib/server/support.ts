import 'server-only';
import {AccessError} from '../../backend/modules/access/contracts';
import {createSupportServices} from '../../backend/composition/support';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
type Service=ReturnType<typeof createSupportServices>;let services:Service|undefined;try{services=createSupportServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),now:()=>new Date()});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;},required=(identity:Identity|null)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');return identity;};
async function scope(identity:Identity|null){const actor=required(identity),home=await accountGateway.getHome(actor);return {actor,...home.scope};}
export const supportGateway={
 async pupils(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().pupils(actor,organizationId,schoolId);},
 async specialists(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().specialists(actor,organizationId,schoolId);},
 async createReferral(identity:Identity|null,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().createReferral(actor,organizationId,schoolId,input,requestId);},
 async listReferrals(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().listReferrals(actor,organizationId,schoolId);},
 async getReferral(identity:Identity|null,id:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().getReferral(actor,organizationId,schoolId,id);},
 async transitionReferral(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().transitionReferral(actor,organizationId,schoolId,id,input,requestId);},
 async currentProcedure(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().currentProcedure(actor,organizationId,schoolId);},
 async publishProcedure(identity:Identity|null,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().publishProcedure(actor,organizationId,schoolId,input,requestId);},
 async recordHandoff(identity:Identity|null,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().recordHandoff(actor,organizationId,schoolId,input,requestId);},
 async listHandoffs(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().listHandoffs(actor,organizationId,schoolId);},
 async acknowledgeHandoff(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().acknowledgeHandoff(actor,organizationId,schoolId,id,input,requestId);},
 async status(identity:Identity|null,key:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().status(actor,organizationId,schoolId,key);},
};
