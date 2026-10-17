import 'server-only';
import {AccessError} from '../../backend/modules/access/contracts/index';
import {createAssistantServices} from '../../backend/composition/assistant';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
type Service=ReturnType<typeof createAssistantServices>;
let services:Service|undefined;
try{services=createAssistantServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),mode:process.env.VSCHOOL_ASSISTANT_MODE==='synthetic'?'synthetic':'disabled'});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;};
async function scope(identity:Identity|null){if(!identity)throw new AccessError('UNAUTHENTICATED');const home=await accountGateway.getHome(identity);return {actor:identity,...home.scope};}
export const assistantGateway={
 async availability(identity:Identity|null){const s=await scope(identity);return service().availability(s.actor,s.organizationId,s.schoolId);},
 async list(identity:Identity|null){const s=await scope(identity);return service().list(s.actor,s.organizationId,s.schoolId);},
 async get(identity:Identity|null,id:unknown){const s=await scope(identity);return service().get(s.actor,s.organizationId,s.schoolId,id);},
 async generate(identity:Identity|null,input:unknown){const s=await scope(identity);return service().generate(s.actor,s.organizationId,s.schoolId,input as Parameters<Service['generate']>[3]);},
 async transition(identity:Identity|null,id:unknown,input:unknown){const s=await scope(identity);return service().transition(s.actor,s.organizationId,s.schoolId,id,input as Parameters<Service['transition']>[4]);},
 async status(identity:Identity|null,key:unknown){const s=await scope(identity);return service().status(s.actor,s.organizationId,s.schoolId,key);},
};
