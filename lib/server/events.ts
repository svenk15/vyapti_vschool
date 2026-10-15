import 'server-only';
import {AccessError} from '../../backend/modules/access/contracts';
import {createEventsServices} from '../../backend/composition/events';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
type Service=ReturnType<typeof createEventsServices>;let services:Service|undefined;try{services=createEventsServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),now:()=>new Date()});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;},required=(identity:Identity|null)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');return identity;};
async function scope(identity:Identity|null){const actor=required(identity),home=await accountGateway.getHome(actor);return {actor,...home.scope};}
export const eventsGateway={
 async createDraft(identity:Identity|null,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().createDraft(actor,organizationId,schoolId,input,requestId);},
 async updateDraft(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().updateDraft(actor,organizationId,schoolId,id,input,requestId);},
 async publish(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().publish(actor,organizationId,schoolId,id,input,requestId);},
 async revise(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().revise(actor,organizationId,schoolId,id,input,requestId);},
 async cancel(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().cancel(actor,organizationId,schoolId,id,input,requestId);},
 async listAdmin(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().listAdmin(actor,organizationId,schoolId);},
 async detailAdmin(identity:Identity|null,id:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().detailAdmin(actor,organizationId,schoolId,id);},
 listParent:(identity:Identity|null,studentId:unknown,query:unknown={})=>service().listParent(required(identity),studentId,query),
 exportParent:(identity:Identity|null,studentId:unknown,query:unknown={})=>service().exportParent(required(identity),studentId,query),
 detailParent:(identity:Identity|null,studentId:unknown,id:unknown)=>service().detailParent(required(identity),studentId,id),
 listStudent:(identity:Identity|null,studentId:unknown)=>service().listStudent(required(identity),studentId),
 detailStudent:(identity:Identity|null,studentId:unknown,id:unknown)=>service().detailStudent(required(identity),studentId,id),
};
