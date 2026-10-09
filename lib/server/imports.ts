import 'server-only';
import {createImportsServices} from '../../backend/composition/imports';
import type {ImportsFacade} from '../../backend/modules/imports/application/imports';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
import {AccessError} from '../../backend/modules/access/contracts';
import {studentRuntimeConfiguration} from './student-runtime-configuration';
type ImportServices=ReturnType<typeof createImportsServices>;
let imports:ImportServices|undefined,configurationFailure:AccessError|undefined;
try{imports=createImportsServices(studentRuntimeConfiguration());}catch{configurationFailure=new AccessError('UNAVAILABLE');}
function service(){if(!imports)throw configurationFailure??new AccessError('UNAVAILABLE');return imports;}
async function scope(identity:Identity|null){return (await accountGateway.getHome(identity)).scope;}
export const importsGateway={
 async authorize(identity:Identity|null){const current=await scope(identity);return service().authorize(identity,current.organizationId,current.schoolId);},
 async options(identity:Identity|null){const current=await scope(identity);return service().options(identity,current.organizationId,current.schoolId);},
 async preview(identity:Identity|null,input:Parameters<ImportsFacade['preview']>[3]){const current=await scope(identity);return service().preview(identity,current.organizationId,current.schoolId,input);},
 async rows(identity:Identity|null,jobId:unknown,cursor:unknown){const current=await scope(identity);return service().rows(identity,current.organizationId,current.schoolId,jobId,cursor);},
 async confirm(identity:Identity|null,input:Parameters<ImportsFacade['confirm']>[3]){const current=await scope(identity);return service().confirm(identity,current.organizationId,current.schoolId,input);},
 async process(identity:Identity|null,input:Parameters<ImportsFacade['process']>[3]){const current=await scope(identity);return service().process(identity,current.organizationId,current.schoolId,input);},
 async status(identity:Identity|null,jobId:unknown){const current=await scope(identity);return service().status(identity,current.organizationId,current.schoolId,jobId);},
 async cancel(identity:Identity|null,input:Parameters<ImportsFacade['cancel']>[3]){const current=await scope(identity);return service().cancel(identity,current.organizationId,current.schoolId,input);},
 async errorsCsv(identity:Identity|null,jobId:unknown){const current=await scope(identity);return service().errorsCsv(identity,current.organizationId,current.schoolId,jobId);},
};
