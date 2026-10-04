import {redirect} from 'next/navigation';
import {accountGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {brandingGateway} from '@/lib/server/branding';
import {AccessError} from '@/backend/modules/access/contracts';
import {BrandSurface,Alert} from '@/components/ui/primitives';
import {BrandingWorkspaceScreen} from '@/components/branding-workspace';
export const dynamic='force-dynamic';
export default async function BrandingAdminPage(){const identity=await getIdentity();let home,workspace;try{home=await accountGateway.getHome(identity);workspace=await brandingGateway.workspace(identity);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');if(e instanceof AccessError&&e.code==='FORBIDDEN')return <BrandSurface><main className="container page-space"><Alert tone="danger" title="Branding access denied">A current school administrator membership is required for this branch.</Alert></main></BrandSurface>;return <BrandSurface><main className="container page-space"><Alert tone="danger" title="Branding service unavailable">Refresh to try again.</Alert></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space"><BrandingWorkspaceScreen initial={workspace} schoolName={home.schoolName} institutionName={home.institutionName} schoolCode={home.schoolCode}/></main></BrandSurface>;
}
