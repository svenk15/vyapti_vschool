import 'server-only';
import {createTenancyServices} from '../../backend/composition/tenancy';
import type {TenancyModuleFacade} from '../../backend/modules/tenancy/application/modules';
import {accountGateway} from './access';

const tenancy=createTenancyServices({databaseUrl:process.env.DATABASE_URL??''});
export const moduleGateway={
 async getCurrent(identity:Parameters<TenancyModuleFacade['getBranch']>[0]){const home=await accountGateway.getHome(identity);return tenancy.getBranch(identity,home.scope.organizationId,home.scope.schoolId);},
 async previewCurrent(identity:Parameters<TenancyModuleFacade['preview']>[0],enabled:Parameters<TenancyModuleFacade['preview']>[3]){const home=await accountGateway.getHome(identity);return tenancy.preview(identity,home.scope.organizationId,home.scope.schoolId,enabled);},
 async confirmCurrent(identity:Parameters<TenancyModuleFacade['confirm']>[0],input:Parameters<TenancyModuleFacade['confirm']>[3]){const home=await accountGateway.getHome(identity);return tenancy.confirm(identity,home.scope.organizationId,home.scope.schoolId,input);},
};
