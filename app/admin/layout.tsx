import type {ReactNode} from 'react';
import {BrandSurface} from '@/components/ui/primitives';
import {AdminPortalFrame} from '@/components/admin-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {getAdminNavigation} from '@/lib/server/admin-navigation';
import {brandingGateway} from '@/lib/server/branding';
import {academicsGateway} from '@/lib/server/academics';
import {peopleAvailabilityGateway,peopleGateway} from '@/lib/server/people';
import {redirect} from 'next/navigation';
import {coordinationGateway} from '@/lib/server/coordination';
import {requestsGateway} from '@/lib/server/requests';
import {supportGateway} from '@/lib/server/support';
import {facilitiesGateway} from '@/lib/server/facilities';
import {financeGateway} from '@/lib/server/finance';
export const dynamic='force-dynamic';

export default async function AdminLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)redirect('/sign-in');
 const home=await accountGateway.getHome(identity).catch(()=>null);
 if(!home)return children;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:home.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const [baseGroups,palette,academics,accountDisplayName,coordinationAvailability,availabilityRecorder,requestQueue,supportConfiguration,facilitiesQueue,financeSummary]=await Promise.all([getAdminNavigation(identity,home),brandingGateway.effectivePalette(identity).catch(()=>null),academicsGateway.workspace(identity).catch(()=>null),peopleGateway.currentAccountDisplayName(identity).catch(()=>null),coordinationGateway.availability(identity).catch(()=>null),peopleAvailabilityGateway.recorder(identity,today).catch(()=>null),requestsGateway.list(identity).catch(()=>null),supportGateway.currentProcedure(identity).then(()=>true).catch(()=>false),facilitiesGateway.list(identity).catch(()=>null),financeGateway.summary(identity,'INR').catch(()=>null)]);
 const groups=baseGroups.map(group=>({...group,items:[...group.items,...(group.id==='communication-work'&&requestQueue?.categories.length?[{label:'My requests',href:'/admin/requests',icon:'mail' as const}]:[]),...(group.id==='communication-work'&&coordinationAvailability?.enabled&&coordinationAvailability.capabilities.includes('coordination.work')?[{label:'Assigned follow-ups',href:'/admin/coordination',icon:'activity' as const}]:[]),...(group.id==='people-access'&&availabilityRecorder?[{label:'Staff availability',href:'/admin/teachers/availability',icon:'people' as const}]:[]),...(group.id==='school-management'&&supportConfiguration?[{label:'Support procedure',href:'/admin/support',icon:'people' as const}]:[]),...(group.id==='services'&&facilitiesQueue!==null?[{label:'Facilities incidents',href:'/admin/services/incidents',icon:'activity' as const}]:[]),...(group.id==='services'&&financeSummary!==null?[{label:'Financial exceptions',href:'/admin/finance/exceptions',icon:'report' as const}]:[])]})).filter(group=>group.items.length>0);
 const academicYear=academics?.years.find(year=>year.status==='OPEN'&&year.startsOn<=today&&year.endsOn>today)??academics?.years.find(year=>year.status==='OPEN');
 return <BrandSurface palette={palette??undefined}><AdminPortalFrame home={home} groups={groups} academicYearLabel={academicYear?.name??null} accountDisplayName={accountDisplayName}>{children}</AdminPortalFrame></BrandSurface>;
}
