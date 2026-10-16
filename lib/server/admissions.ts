import 'server-only';
import {createAdmissionsServices} from '../../backend/composition/admissions';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
import {admissionsRuntimeConfiguration} from './admissions-runtime-configuration';
const admissions=createAdmissionsServices(admissionsRuntimeConfiguration());
async function scope(identity:Identity|null){return (await accountGateway.getHome(identity)).scope;}
export const admissionsGateway={async context(identity:Identity|null){const current=await scope(identity);return admissions.context(identity,current.organizationId,current.schoolId);},async start(identity:Identity|null,input:unknown){const current=await scope(identity);return admissions.start(identity,current.organizationId,current.schoolId,input);}};
