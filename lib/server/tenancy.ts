import 'server-only';
import {createTenancyServices} from '../../backend/composition/tenancy';
import type {TenancyModuleFacade} from '../../backend/modules/tenancy/application/modules';
import {accountGateway} from './access';
import {AccessError} from '../../backend/modules/access/contracts';
import type {ModuleId} from '../../shared/contracts/modules';

const tenancy=createTenancyServices({databaseUrl:process.env.DATABASE_URL??''});
export const moduleGateway={
 async getCurrent(identity:Parameters<TenancyModuleFacade['getBranch']>[0]){const home=await accountGateway.getHome(identity);return tenancy.getBranch(identity,home.scope.organizationId,home.scope.schoolId);},
 async canUseCurrent(identity:Parameters<TenancyModuleFacade['assertModule']>[0],moduleId:ModuleId,permission:string){try{const home=await accountGateway.getHome(identity);await tenancy.assertModule(identity,home.scope.organizationId,home.scope.schoolId,moduleId,permission);return true;}catch(error){if(error instanceof AccessError)return false;throw error;}},
 async canUseAtScope(identity:Parameters<TenancyModuleFacade['assertModule']>[0],organizationId:string,schoolId:string,moduleId:ModuleId,permission:string){try{await tenancy.assertModule(identity,organizationId,schoolId,moduleId,permission);return true;}catch(error){if(error instanceof AccessError)return false;throw error;}},
 async previewCurrent(identity:Parameters<TenancyModuleFacade['preview']>[0],enabled:Parameters<TenancyModuleFacade['preview']>[3]){const home=await accountGateway.getHome(identity);return tenancy.preview(identity,home.scope.organizationId,home.scope.schoolId,enabled);},
 async confirmCurrent(identity:Parameters<TenancyModuleFacade['confirm']>[0],input:Parameters<TenancyModuleFacade['confirm']>[3]){const home=await accountGateway.getHome(identity);return tenancy.confirm(identity,home.scope.organizationId,home.scope.schoolId,input);},
 async getCapabilityInterests(identity:Parameters<TenancyModuleFacade['getCapabilityInterests']>[0]){const home=await accountGateway.getHome(identity);return tenancy.getCapabilityInterests(identity,home.scope.organizationId,home.scope.schoolId);},
 async submitCapabilityInterest(identity:Parameters<TenancyModuleFacade['submitCapabilityInterest']>[0],input:Parameters<TenancyModuleFacade['submitCapabilityInterest']>[3]){const home=await accountGateway.getHome(identity);return tenancy.submitCapabilityInterest(identity,home.scope.organizationId,home.scope.schoolId,input);},
};
