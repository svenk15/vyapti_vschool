import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {AttendanceScheduler} from '@/components/attendance-scheduler';
import {AttendanceAdminList} from '@/components/attendance-admin-list';
import {Alert,BrandSurface,PageHeader} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {attendanceGateway} from '@/lib/server/attendance';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';
export const dynamic='force-dynamic';
export default async function ScheduleSessionsPage(){const identity=await getIdentity();let home,offerings,sessions;let unavailable=false;try{home=await accountGateway.getHome(identity);await attendanceGateway.authorizeAdmin(identity);const today=schoolDate(new Date(),home.timezone),workspace=await academicsGateway.workspace(identity),year=workspace.years.find(y=>y.status==='OPEN');[offerings,sessions]=await Promise.all([year?academicsGateway.offerings(identity,year.id):Promise.resolve([]),attendanceGateway.schoolDay(identity,today)]);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');unavailable=true;}if(!home||unavailable)return <BrandSurface><main id="main-content" className="container page-space"><PageHeader title="Schedule class session"/><Alert tone="danger" title="Attendance unavailable">Current branch permissions and module access are checked when loading and scheduling. Refresh after access or service issues are resolved.</Alert></main></BrandSurface>;return <BrandSurface><main id="main-content" className="container page-space"><AttendanceScheduler offerings={offerings??[]} today={schoolDate(new Date(),home.timezone)} timezone={home.timezone} home={home}/><AttendanceAdminList sessions={sessions??[]}/></main></BrandSurface>;}
