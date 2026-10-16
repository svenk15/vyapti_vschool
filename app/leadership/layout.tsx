import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {BrandSurface} from '@/components/ui/primitives';
import {PrincipalPortalFrame} from '@/components/principal-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {leadershipGateway} from '@/lib/server/access';
import {brandingGateway} from '@/lib/server/branding';
import {moduleGateway} from '@/lib/server/tenancy';
import {reportingGateway} from '@/lib/server/reporting';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';

export default async function LeadershipLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)redirect('/sign-in');
 const home=await leadershipGateway.getHome(identity).catch(()=>null);
 if(!home)redirect('/choose-workspace');
 const [palette,canUseAttendance,canUseTimetable,canUseLearning,canUseCommunication,exportAvailability,snapshotAvailability,coordinationAvailability]=await Promise.all([brandingGateway.effectivePalette(identity).catch(()=>null),home.capabilities.includes('attendance.read_leadership')?moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'attendance','attendance.read_leadership').catch(()=>false):false,home.capabilities.includes('timetable.read_leadership')?moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'timetable','timetable.read_leadership').catch(()=>false):false,home.capabilities.includes('learning.read_leadership')?moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'homework','learning.read_leadership').catch(()=>false):false,home.capabilities.includes('communication.read_leadership')?moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'communication','communication.read_leadership').catch(()=>false):false,reportingGateway.leadershipExportAvailability(identity).catch(()=>null),reportingGateway.leadershipSnapshotAvailability(identity).catch(()=>null),coordinationGateway.availability(identity).catch(()=>null)]);
 return <BrandSurface palette={palette??undefined}><PrincipalPortalFrame home={home} canUseAttendance={canUseAttendance} canUseCoordination={coordinationAvailability?.enabled===true&&coordinationAvailability.capabilities.some(capability=>capability!=='coordination.work')} canUseTimetable={canUseTimetable} canUseLearning={canUseLearning} canUseCommunication={canUseCommunication} canUseReports={exportAvailability?.canExport===true||snapshotAvailability?.enabled===true}>{children}</PrincipalPortalFrame></BrandSurface>;
}
