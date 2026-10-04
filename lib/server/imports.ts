import 'server-only';
import {createImportsServices} from '../../backend/composition/imports';
import type {ImportsFacade} from '../../backend/modules/imports/application/imports';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
const imports=createImportsServices({databaseUrl:process.env.DATABASE_URL??'',cursorSecret:process.env.NEXTAUTH_SECRET});
async function scope(identity:Identity|null){return (await accountGateway.getHome(identity)).scope;}
export const importsGateway={
 async authorize(identity:Identity|null){const current=await scope(identity);return imports.authorize(identity,current.organizationId,current.schoolId);},
 async options(identity:Identity|null){const current=await scope(identity);return imports.options(identity,current.organizationId,current.schoolId);},
 async preview(identity:Identity|null,input:Parameters<ImportsFacade['preview']>[3]){const current=await scope(identity);return imports.preview(identity,current.organizationId,current.schoolId,input);},
 async rows(identity:Identity|null,jobId:unknown,cursor:unknown){const current=await scope(identity);return imports.rows(identity,current.organizationId,current.schoolId,jobId,cursor);},
 async confirm(identity:Identity|null,input:Parameters<ImportsFacade['confirm']>[3]){const current=await scope(identity);return imports.confirm(identity,current.organizationId,current.schoolId,input);},
 async process(identity:Identity|null,input:Parameters<ImportsFacade['process']>[3]){const current=await scope(identity);return imports.process(identity,current.organizationId,current.schoolId,input);},
 async status(identity:Identity|null,jobId:unknown){const current=await scope(identity);return imports.status(identity,current.organizationId,current.schoolId,jobId);},
};
