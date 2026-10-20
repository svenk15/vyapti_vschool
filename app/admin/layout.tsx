import type {ReactNode} from 'react';
import {BrandSurface} from '@/components/ui/primitives';
import {AdminPortalFrame} from '@/components/admin-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway,appearanceGateway} from '@/lib/server/access';
import {composeAdminNavigation,getAdminNavigationDestinations,type AdminNavigationItem} from '@/lib/server/admin-navigation';
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
 const [baseDestinations,theme,academics,accountDisplayName,coordinationAvailability,availabilityRecorder,requestQueue,supportConfiguration,facilitiesQueue,financeSummary]=await Promise.all([getAdminNavigationDestinations(identity,home),appearanceGateway.getEffective(identity,home.scope.organizationId,home.scope.schoolId),academicsGateway.workspace(identity).catch(()=>null),peopleGateway.currentAccountDisplayName(identity).catch(()=>null),coordinationGateway.availability(identity).catch(()=>null),peopleAvailabilityGateway.recorder(identity,today).catch(()=>null),requestsGateway.list(identity).catch(()=>null),supportGateway.currentProcedure(identity).then(()=>true).catch(()=>false),facilitiesGateway.list(identity).catch(()=>null),financeGateway.summary(identity,'INR').catch(()=>null)]);
 const dynamicDestinations:AdminNavigationItem[]=[
  ...(requestQueue?.categories.length?[{label:'Requests',href:'/admin/requests',icon:'mail' as const,area:'today' as const}]:[]),
  ...(coordinationAvailability?.enabled&&coordinationAvailability.capabilities.includes('coordination.work')?[{label:'Assigned follow-ups',href:'/admin/coordination',icon:'activity' as const,area:'today' as const}]:[]),
  ...(availabilityRecorder?[{label:'Availability',href:'/admin/teachers/availability',icon:'people' as const,area:'staff' as const}]:[]),
  ...(supportConfiguration?[{label:'Restricted support',href:'/admin/support',icon:'people' as const,area:'services' as const}]:[]),
  ...(facilitiesQueue!==null?[{label:'Facilities',href:'/admin/services/incidents',icon:'activity' as const,area:'services' as const}]:[]),
  ...(financeSummary!==null?[{label:'Finance',href:'/admin/finance/exceptions',icon:'report' as const,area:'services' as const}]:[]),
 ];
 const groups=composeAdminNavigation([...baseDestinations,...dynamicDestinations]);
 const academicYear=academics?.years.find(year=>year.status==='OPEN'&&year.startsOn<=today&&year.endsOn>today)??academics?.years.find(year=>year.status==='OPEN');
 return <BrandSurface palette={theme.themeId}><AdminPortalFrame home={home} groups={groups} academicYearLabel={academicYear?.name??null} accountDisplayName={accountDisplayName}>{children}</AdminPortalFrame></BrandSurface>;
}
