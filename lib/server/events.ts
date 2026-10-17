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
 listStudent:(identity:Identity|null,studentId:unknown,query:unknown={})=>service().listStudent(required(identity),studentId,query),
 detailStudent:(identity:Identity|null,studentId:unknown,id:unknown)=>service().detailStudent(required(identity),studentId,id),
 meetings:{
  async candidates(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().meetings.candidates(actor,organizationId,schoolId);},
  async list(identity:Identity|null,candidate?:{organizationId:string;schoolId:string}){const actor=required(identity),resolved:{organizationId:string;schoolId:string}=candidate??(await accountGateway.getHome(actor)).scope;return service().meetings.list(actor,resolved.organizationId,resolved.schoolId);},
  async get(identity:Identity|null,id:unknown,candidate?:{organizationId:string;schoolId:string}){const actor=required(identity),resolved:{organizationId:string;schoolId:string}=candidate??(await accountGateway.getHome(actor)).scope;return service().meetings.get(actor,resolved.organizationId,resolved.schoolId,id);},
  async saveDraft(identity:Identity|null,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().meetings.saveDraft(actor,organizationId,schoolId,input,requestId);},
  async propose(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().meetings.propose(actor,organizationId,schoolId,id,input,requestId);},
  async command(identity:Identity|null,id:unknown,action:'respond'|'reschedule'|'remove-participant'|'confirm'|'complete'|'cancel',input:unknown,requestId:string,candidate?:{organizationId:string;schoolId:string}){const actor=required(identity),resolved:{organizationId:string;schoolId:string}=candidate??(await accountGateway.getHome(actor)).scope;return action==='respond'?service().meetings.respond(actor,resolved.organizationId,resolved.schoolId,id,input,requestId):action==='reschedule'?service().meetings.reschedule(actor,resolved.organizationId,resolved.schoolId,id,input,requestId):action==='remove-participant'?service().meetings.removeParticipant(actor,resolved.organizationId,resolved.schoolId,id,input,requestId):action==='confirm'?service().meetings.confirm(actor,resolved.organizationId,resolved.schoolId,id,input,requestId):action==='complete'?service().meetings.complete(actor,resolved.organizationId,resolved.schoolId,id,input,requestId):service().meetings.cancel(actor,resolved.organizationId,resolved.schoolId,id,input,requestId);},
  async status(identity:Identity|null,key:unknown,candidate?:{organizationId:string;schoolId:string}){const actor=required(identity),resolved:{organizationId:string;schoolId:string}=candidate??(await accountGateway.getHome(actor)).scope;return service().meetings.status(actor,resolved.organizationId,resolved.schoolId,key);},
 },
};
