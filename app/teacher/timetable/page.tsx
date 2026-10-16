import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';
import {TeacherTimetable} from '@/components/teacher-timetable';
import {Alert,BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
const monday=(value:string)=>{const date=new Date(`${value}T12:00:00Z`),day=date.getUTCDay()||7;date.setUTCDate(date.getUTCDate()-(day-1));return date.toISOString().slice(0,10);};
export default async function TeacherTimetablePage({searchParams}:{searchParams:Promise<{week?:string|string[]}>}){const identity=await getIdentity();let initial,today;try{const home=await accountGateway.getHome(identity);today=schoolDate(new Date(),home.timezone);const raw=(await searchParams).week,week=typeof raw==='string'?raw:monday(today);initial=await academicsGateway.teacherTimetableWeek(identity,week);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');}if(!initial||!today)return <BrandSurface><main id="main-content" className="container page-space"><PageStack><PageHeader title="My timetable" description="A clear list of published teaching commitments."/><Alert tone="danger" title="Timetable unavailable">Your current teacher assignment, school scope, module access and timetable permission are checked on every request.</Alert></PageStack></main></BrandSurface>;return <BrandSurface><main id="main-content" className="container page-space"><TeacherTimetable key={initial.weekStart} initial={initial} today={today}/></main></BrandSurface>;}
