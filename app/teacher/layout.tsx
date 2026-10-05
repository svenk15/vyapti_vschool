import type {ReactNode} from 'react';
import {BrandSurface} from '@/components/ui/primitives';
import {TeacherPortalFrame} from '@/components/teacher-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {brandingGateway} from '@/lib/server/branding';
import {accountGateway} from '@/lib/server/access';
export const dynamic='force-dynamic';

export default async function TeacherLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)return children;
 const home=await accountGateway.getHome(identity).catch(()=>null);
 if(!home)return children;
 const palette=await brandingGateway.effectivePalette(identity).catch(()=>null);
 return <BrandSurface palette={palette??undefined}><TeacherPortalFrame home={home}>{children}</TeacherPortalFrame></BrandSurface>;
}
