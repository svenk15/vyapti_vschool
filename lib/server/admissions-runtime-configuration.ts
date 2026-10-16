import 'server-only';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
export function admissionsRuntimeConfiguration(){return {databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),now:()=>new Date()};}
