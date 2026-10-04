import 'server-only';
import {createPeopleServices} from '../../backend/composition/people';
import type {PeopleFacade} from '../../backend/modules/people/application/employees';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway} from './access';
const people=createPeopleServices({databaseUrl:process.env.DATABASE_URL??''});
async function scope(identity:Identity|null){const home=await accountGateway.getHome(identity);return home.scope;}
export const peopleGateway={
 async workspace(identity:Identity|null,query:{search?:unknown;cursor?:unknown;limit?:unknown}={}){const current=await scope(identity);return people.workspace(identity,current.organizationId,current.schoolId,query);},
 async createEmployee(identity:Identity|null,input:Parameters<PeopleFacade['createEmployee']>[3]){const current=await scope(identity);return people.createEmployee(identity,current.organizationId,current.schoolId,input);},
};
