import 'server-only';
import type {Identity} from '../../shared/contracts/access';
import {AccessError} from '../../backend/modules/access/contracts';
import {createAssessmentsServices} from '../../backend/composition/assessments';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {leadershipGateway} from './access';
type Services=ReturnType<typeof createAssessmentsServices>;let services:Services|undefined;try{services=createAssessmentsServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),mode:process.env.VSCHOOL_ASSESSMENTS_MODE==='synthetic'?'synthetic':'disabled'});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;};
export const assessmentsGateway={async leadershipReadiness(identity:Identity|null,cycleId?:string){if(!identity)throw new AccessError('UNAUTHENTICATED');const home=await leadershipGateway.getHome(identity);return service().leadershipReadiness(identity,home.scope.organizationId,home.scope.schoolId,cycleId);}};
export {services as assessmentsServices};
