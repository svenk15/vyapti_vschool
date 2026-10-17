import 'server-only';
import {AccessError} from '../../backend/modules/access/contracts';
import {createFinanceServices} from '../../backend/composition/finance';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
type Service=ReturnType<typeof createFinanceServices>;let services:Service|undefined;try{services=createFinanceServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES)});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;};
async function scope(identity:Identity|null){if(!identity)throw new AccessError('UNAUTHENTICATED');const home=await accountGateway.getHome(identity);return {actor:identity,...home.scope};}
export const financeGateway={
 async summary(identity:Identity|null,currency:unknown='INR'){const s=await scope(identity);return service().summary(s.actor,s.organizationId,s.schoolId,currency);},
 async reviewers(identity:Identity|null,reconciliationId:unknown){const s=await scope(identity);return service().reviewers(s.actor,s.organizationId,s.schoolId,reconciliationId);},
 async request(identity:Identity|null,input:unknown,requestId:string){const s=await scope(identity);return service().request(s.actor,s.organizationId,s.schoolId,input,requestId);},
 async list(identity:Identity|null){const s=await scope(identity);return service().list(s.actor,s.organizationId,s.schoolId);},
 async get(identity:Identity|null,id:unknown){const s=await scope(identity);return service().get(s.actor,s.organizationId,s.schoolId,id);},
 async decide(identity:Identity|null,id:unknown,input:unknown,requestId:string){const s=await scope(identity);return service().decide(s.actor,s.organizationId,s.schoolId,id,input,requestId);},
 async status(identity:Identity|null,id:unknown,key:unknown){const s=await scope(identity);return service().status(s.actor,s.organizationId,s.schoolId,id,key);},
};
export const financeServices=services;
