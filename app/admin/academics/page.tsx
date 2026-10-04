import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {BrandSurface,Alert,ButtonLink,PageHeader} from '@/components/ui/primitives';
import {BranchSwitcher} from '@/components/institution-context';
import {AcademicsWorkspaceScreen} from '@/components/academics-workspace';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
export const dynamic='force-dynamic';
export default async function AcademicsAdminPage(){const identity=await getIdentity();let home,workspace;try{home=await accountGateway.getHome(identity);workspace=await academicsGateway.workspace(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');const title=error instanceof AccessError&&error.code==='RELEASE_UNAVAILABLE'?'Academic structure is not available in this server release':error instanceof AccessError&&error.code==='MODULE_NOT_LICENSED'?'The institution does not have an active academic structure contract':error instanceof AccessError&&error.code==='MODULE_DISABLED'?'Academic structure is not activated for this branch':error instanceof AccessError&&error.code==='FORBIDDEN'?'Academic setup access denied':'Academic setup is temporarily unavailable';return <BrandSurface><main className="container page-space"><PageHeader title="Academic setup" actions={<ButtonLink href="/admin" variant="secondary">School home</ButtonLink>}/><Alert tone="danger" title={title}>This page checks the current branch, module entitlement, activation and permissions on the server.</Alert></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space"><BranchSwitcher home={home}/><AcademicsWorkspaceScreen initial={workspace} schoolName={home.schoolName} institutionName={home.institutionName}/></main></BrandSurface>;
}
