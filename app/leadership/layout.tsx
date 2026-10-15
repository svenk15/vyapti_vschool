import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {BrandSurface} from '@/components/ui/primitives';
import {PrincipalPortalFrame} from '@/components/principal-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {leadershipGateway} from '@/lib/server/access';
import {brandingGateway} from '@/lib/server/branding';

export const dynamic='force-dynamic';

export default async function LeadershipLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)redirect('/sign-in');
 const home=await leadershipGateway.getHome(identity).catch(()=>null);
 if(!home)redirect('/choose-workspace');
 const palette=await brandingGateway.effectivePalette(identity).catch(()=>null);
 return <BrandSurface palette={palette??undefined}><PrincipalPortalFrame home={home}>{children}</PrincipalPortalFrame></BrandSurface>;
}
