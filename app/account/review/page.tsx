import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {TeacherAccountReview} from '@/components/teacher-account-review';
import {TeacherPortalFrame} from '@/components/teacher-portal-frame';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {accountGateway,contextGateway} from '@/lib/server/access';
import {getCurrentSessionInfo,getIdentity} from '@/lib/server/auth';
import {moduleGateway} from '@/lib/server/tenancy';
import {academicsGateway} from '@/lib/server/academics';
import {attendanceGateway} from '@/lib/server/attendance';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';

export const dynamic='force-dynamic';

export default async function TeacherAccountReviewPage(){
 const identity=await getIdentity();
 let home:Awaited<ReturnType<typeof accountGateway.getHome>>,account:Awaited<ReturnType<typeof accountGateway.getSelf>>,directory:Awaited<ReturnType<typeof contextGateway.getContexts>>,session:NonNullable<Awaited<ReturnType<typeof getCurrentSessionInfo>>>;
 try{[home,account,directory,session]=await Promise.all([accountGateway.getHome(identity),accountGateway.getSelf(identity),contextGateway.getContexts(identity),getCurrentSessionInfo().then(value=>{if(!value)throw new AccessError('UNAUTHENTICATED');return value;})]);}catch(error){if(error instanceof AccessError&&(error.code==='UNAUTHENTICATED'||error.code==='NOT_FOUND'))redirect('/sign-in');return <main id="main-content" className="container page-space"><Alert tone="danger" title="Account details unavailable">Your account was not changed. Refresh and try again.</Alert></main>;}
 if(home.capabilities.includes('school.manage'))redirect('/admin');
 const today=schoolDate(new Date(),home.timezone),[canUseTimetable,canUseClasses,canUseHistory]=await Promise.all([home.capabilities.includes('timetable.read')?moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'timetable','timetable.read').catch(()=>false):false,home.capabilities.includes('class.read')&&home.capabilities.includes('student.read')?academicsGateway.teacherClasses(identity,today).then(()=>true).catch(()=>false):false,home.capabilities.includes('attendance.read_class')?attendanceGateway.teacherHistory(identity,{}).then(()=>true).catch(()=>false):false]);
 return <TeacherPortalFrame home={home} canUseClasses={canUseClasses} canUseTimetable={canUseTimetable} canUseHistory={canUseHistory}><main id="main-content" className="container page-space context-workflow-page"><PageStack><PageHeader eyebrow="My account" title="Review my account and sessions" description={`${home.institutionName} · ${home.schoolName}`}/><TeacherAccountReview account={account} session={session} directory={directory} currentSchoolId={home.scope.schoolId}/></PageStack></main></TeacherPortalFrame>;
}
