import 'server-only';
import {createActivityServices} from '../../backend/composition/activity';
import {AccessError} from '../../backend/modules/access/contracts';
import type {ActivityFacade} from '../../backend/modules/platform/application/activity';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
let activity:ReturnType<typeof createActivityServices>|undefined,failure:AccessError|undefined;
try{activity=createActivityServices({databaseUrl:process.env.DATABASE_URL??'',cursorSecret:process.env.NEXTAUTH_SECRET??''});}catch{failure=new AccessError('UNAVAILABLE');}
function service(){if(!activity)throw failure??new AccessError('UNAVAILABLE');return activity;}
async function scope(identity:Identity|null){return (await accountGateway.getHome(identity)).scope;}
export const activityGateway={
 async list(identity:Identity|null,query:Parameters<ActivityFacade['list']>[3]){const current=await scope(identity);return service().list(identity,current.organizationId,current.schoolId,query);},
 async detail(identity:Identity|null,eventId:unknown){const current=await scope(identity);return service().detail(identity,current.organizationId,current.schoolId,eventId);},
};
