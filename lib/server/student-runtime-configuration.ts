import 'server-only';
import {AccessError} from '../../backend/modules/access/contracts';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';

export function studentRuntimeConfiguration(){
 try{
  return {
   databaseUrl:process.env.DATABASE_URL??'',
   cursorSecret:process.env.NEXTAUTH_SECRET??'',
   releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),
   now:()=>new Date(),
  };
 }catch{throw new AccessError('UNAVAILABLE');}
}
