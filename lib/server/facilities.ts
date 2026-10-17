import 'server-only';
import {AccessError} from '../../backend/modules/access/contracts';
import {createFacilitiesServices} from '../../backend/composition/facilities';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
type Service=ReturnType<typeof createFacilitiesServices>;let services:Service|undefined;try{services=createFacilitiesServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES)});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;};
async function scope(identity:Identity|null){if(!identity)throw new AccessError('UNAUTHENTICATED');const home=await accountGateway.getHome(identity);return {actor:identity,...home.scope};}
export const facilitiesGateway={
 async candidates(identity:Identity|null){const s=await scope(identity);return service().candidates(s.actor,s.organizationId,s.schoolId);},
 async report(identity:Identity|null,input:unknown,requestId:string){const s=await scope(identity);return service().report(s.actor,s.organizationId,s.schoolId,input,requestId);},
 async list(identity:Identity|null){const s=await scope(identity);return service().list(s.actor,s.organizationId,s.schoolId);},
 async get(identity:Identity|null,id:unknown){const s=await scope(identity);return service().get(s.actor,s.organizationId,s.schoolId,id);},
 async transition(identity:Identity|null,id:unknown,input:unknown,requestId:string){const s=await scope(identity);return service().transition(s.actor,s.organizationId,s.schoolId,id,input,requestId);},
 async status(identity:Identity|null,key:unknown){const s=await scope(identity);return service().status(s.actor,s.organizationId,s.schoolId,key);},
};
