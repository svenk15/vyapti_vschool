import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {TeacherSessions} from '@/components/teacher-sessions';
import {Alert,BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {attendanceGateway} from '@/lib/server/attendance';
import {academicsGateway} from '@/lib/server/academics';
import {learningGateway} from '@/lib/server/learning';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';
export const dynamic='force-dynamic';
export default async function TeacherTodayPage(){const identity=await getIdentity();let home,initial,today,canUseClasses=false,learning:Awaited<ReturnType<typeof learningGateway.teacherWorkspace>>|null=null;try{home=await accountGateway.getHome(identity);today=schoolDate(new Date(),home.timezone);initial=await attendanceGateway.teacherDay(identity,today);[canUseClasses,learning]=await Promise.all([home.capabilities.includes('class.read')&&home.capabilities.includes('student.read')?academicsGateway.teacherClasses(identity,today).then(()=>true).catch(()=>false):false,home.capabilities.includes('learning.assignment.write')?learningGateway.teacherWorkspace(identity).catch(()=>null):null]);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');}if(!home||!initial||!today)return <BrandSurface><main id="main-content" className="container page-space"><PageStack><PageHeader title="My teaching day" description="Review your assigned sessions for the selected school date."/><Alert tone="danger" title="Schedule unavailable">Your current account, teacher assignment, branch permissions and attendance access are checked on every request.</Alert></PageStack></main></BrandSurface>;return <BrandSurface><main id="main-content" className="container page-space"><TeacherSessions initial={initial} date={today} home={home} canUseClasses={canUseClasses} canUseHistory={home.capabilities.includes('attendance.read_class')} learning={learning}/></main></BrandSurface>;}
