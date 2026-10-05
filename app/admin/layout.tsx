import type {ReactNode} from 'react';
import {BrandSurface} from '@/components/ui/primitives';
import {AdminPortalFrame} from '@/components/admin-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {getAdminNavigation} from '@/lib/server/admin-navigation';
export const dynamic='force-dynamic';

export default async function AdminLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)return children;
 const home=await accountGateway.getHome(identity).catch(()=>null);
 if(!home)return children;
 const groups=await getAdminNavigation(identity,home);
 return <BrandSurface><AdminPortalFrame home={home} groups={groups}>{children}</AdminPortalFrame></BrandSurface>;
}
