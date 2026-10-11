import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {RosterPreviewFlow} from '@/components/roster-preview-flow';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {importsGateway} from '@/lib/server/imports';
export const dynamic='force-dynamic';
export default async function ImportsPage(){const identity=await getIdentity();let home,options;try{home=await accountGateway.getHome(identity);options=await importsGateway.options(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');const title=error instanceof AccessError&&error.code==='FORBIDDEN'?'Roster preview permission required':error instanceof AccessError&&error.code==='RELEASE_UNAVAILABLE'?'Roster preview is not in this server release':error instanceof AccessError&&error.code==='MODULE_NOT_LICENSED'?'Student and academic access is not active for this institution':error instanceof AccessError&&error.code==='MODULE_DISABLED'?'Student and academic access is not active for this branch':'Roster preview is temporarily unavailable';return <BrandSurface><main className="container page-space"><PageHeader title="Roster preview"/><Alert tone="danger" title={title}>Current permission, branch scope and both modules are checked on the server.</Alert></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space context-workflow-page"><PageStack><PageHeader title="Preview a roster import" description={`${home.institutionName} · ${home.schoolName}`}/><RosterPreviewFlow options={options}/></PageStack></main></BrandSurface>;
}
