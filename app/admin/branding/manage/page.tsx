import {redirect} from 'next/navigation';
import {accountGateway,appearanceGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {brandingGateway} from '@/lib/server/branding';
import {AccessError} from '@/backend/modules/access/contracts';
import {BrandSurface,Alert} from '@/components/ui/primitives';
import {BrandingWorkspaceScreen} from '@/components/branding-workspace';
export const dynamic='force-dynamic';
export default async function BrandingManagementPage(){const identity=await getIdentity();let home,workspace,appearance;try{home=await accountGateway.getHome(identity);[workspace,appearance]=await Promise.all([brandingGateway.workspace(identity),appearanceGateway.getBranch(identity)]);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');if(e instanceof AccessError&&(e.code==='FORBIDDEN'||e.code==='NOT_FOUND'))return <BrandSurface><main className="container page-space"><Alert tone="danger" title="Branding access denied">A current school administrator membership is required for this branch.</Alert></main></BrandSurface>;return <BrandSurface><main className="container page-space"><Alert tone="danger" title="Branding service unavailable">Refresh to try again.</Alert></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space"><BrandingWorkspaceScreen initial={workspace} appearance={appearance} schoolName={home.schoolName} institutionName={home.institutionName} schoolCode={home.schoolCode}/></main></BrandSurface>;
}
