import 'server-only';
import {createPeopleServices} from '../../backend/composition/people';
import type {PeopleFacade} from '../../backend/modules/people/application/employees';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway,leadershipGateway} from './access';
const people=createPeopleServices({databaseUrl:process.env.DATABASE_URL??''});
async function scope(identity:Identity|null){const home=await accountGateway.getHome(identity);return home.scope;}
export const peopleGateway={
 async currentAccountDisplayName(identity:Identity|null){const current=await scope(identity);return people.currentAccountDisplayName(identity,current.organizationId,current.schoolId);},
 async workspace(identity:Identity|null,query:{search?:unknown;by?:unknown;category?:unknown;employment?:unknown;categories?:unknown;employments?:unknown;sort?:unknown;order?:unknown;cursor?:unknown;limit?:unknown}={}){const current=await scope(identity);return people.workspace(identity,current.organizationId,current.schoolId,query);},
 async staffProfile(identity:Identity|null,employeeId:string){const current=await scope(identity);return people.staffProfile(identity,current.organizationId,current.schoolId,employeeId);},
 async commandStatus(identity:Identity|null,command:unknown,key:unknown){const current=await scope(identity);return people.commandStatus(identity,current.organizationId,current.schoolId,command,key);},
 async createEmployee(identity:Identity|null,input:Parameters<PeopleFacade['createEmployee']>[3]){const current=await scope(identity);return people.createEmployee(identity,current.organizationId,current.schoolId,input);},
 async enableTeacher(identity:Identity|null,employeeId:string,input:Parameters<PeopleFacade['enableTeacher']>[4]){const current=await scope(identity);return people.enableTeacher(identity,current.organizationId,current.schoolId,employeeId,input);},
 async bindAccount(identity:Identity|null,employeeId:string,input:Parameters<PeopleFacade['bindAccount']>[4]){const current=await scope(identity);return people.bindAccount(identity,current.organizationId,current.schoolId,employeeId,input);},
 async endEmployment(identity:Identity|null,employeeId:string,input:Parameters<PeopleFacade['endEmployment']>[4]){const current=await scope(identity);return people.endEmployment(identity,current.organizationId,current.schoolId,employeeId,input);},
 async updateCategory(identity:Identity|null,employeeId:string,input:Parameters<PeopleFacade['updateCategory']>[4]){const current=await scope(identity);return people.updateCategory(identity,current.organizationId,current.schoolId,employeeId,input);},
};

export const peopleAvailabilityGateway={
 async leadership(identity:Identity|null,date:unknown){const home=await leadershipGateway.getHome(identity);return people.leadership(identity,home.scope.organizationId,home.scope.schoolId,date);},
 async recorder(identity:Identity|null,date:unknown){const home=await accountGateway.getHome(identity);return people.recorder(identity,home.scope.organizationId,home.scope.schoolId,date);},
 async record(identity:Identity|null,input:Record<string,unknown>){const home=await accountGateway.getHome(identity);return people.record(identity,home.scope.organizationId,home.scope.schoolId,input);},
};
