import type {ReactNode} from 'react';
import {BrandSurface} from '@/components/ui/primitives';
import {AdminPortalFrame} from '@/components/admin-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {getAdminNavigation} from '@/lib/server/admin-navigation';
import {brandingGateway} from '@/lib/server/branding';
export const dynamic='force-dynamic';

export default async function AdminLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)return children;
 const home=await accountGateway.getHome(identity).catch(()=>null);
 if(!home)return children;
 const [groups,palette]=await Promise.all([getAdminNavigation(identity,home),brandingGateway.effectivePalette(identity).catch(()=>null)]);
 return <BrandSurface palette={palette??undefined}><AdminPortalFrame home={home} groups={groups}>{children}</AdminPortalFrame></BrandSurface>;
}
