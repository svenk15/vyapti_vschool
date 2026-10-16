import type {ReactNode} from 'react';
import {BrandSurface} from '@/components/ui/primitives';
import {AdminPortalFrame} from '@/components/admin-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {getAdminNavigation} from '@/lib/server/admin-navigation';
import {brandingGateway} from '@/lib/server/branding';
import {academicsGateway} from '@/lib/server/academics';
import {peopleGateway} from '@/lib/server/people';
import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';

export default async function AdminLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)redirect('/sign-in');
 const home=await accountGateway.getHome(identity).catch(()=>null);
 if(!home)return children;
 const [groups,palette,academics,accountDisplayName]=await Promise.all([getAdminNavigation(identity,home),brandingGateway.effectivePalette(identity).catch(()=>null),academicsGateway.workspace(identity).catch(()=>null),peopleGateway.currentAccountDisplayName(identity).catch(()=>null)]);
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:home.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const academicYear=academics?.years.find(year=>year.status==='OPEN'&&year.startsOn<=today&&year.endsOn>today)??academics?.years.find(year=>year.status==='OPEN');
 return <BrandSurface palette={palette??undefined}><AdminPortalFrame home={home} groups={groups} academicYearLabel={academicYear?.name??null} accountDisplayName={accountDisplayName}>{children}</AdminPortalFrame></BrandSurface>;
}
