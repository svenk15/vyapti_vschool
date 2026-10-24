import {notFound,redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {AttendanceRegisterWorkspace} from '@/components/attendance/register-workspace';
import {Alert,BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {accountGateway} from '@/lib/server/access';
import {attendanceGateway} from '@/lib/server/attendance';
import {safeAttendanceReturn} from '@/components/attendance/presentation';
import {getIdentity} from '@/lib/server/auth';

export const dynamic='force-dynamic';

export default async function AttendanceReviewPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{returnTo?:string}>}){
 const identity=await getIdentity(),{id}=await params,returnTo=safeAttendanceReturn((await searchParams).returnTo);
 let home,session,history,error:unknown;
 try{
  home=await accountGateway.getHome(identity);
  session=await attendanceGateway.detail(identity,id);
  history=session.status==='SUBMITTED'||session.status==='CANCELLED'?await attendanceGateway.history(identity,id):null;
 }catch(cause){error=cause;}
 if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
 if(error instanceof AccessError&&error.code==='NOT_FOUND')notFound();
 if(!home||!session||(session.status==='SUBMITTED'||session.status==='CANCELLED')&&!history)return <BrandSurface><main className="container page-space"><PageStack><PageHeader title="Attendance register" /><Alert tone="danger" title="Register unavailable">Your current branch access or school-wide attendance permission could not be verified. No empty register has been inferred.</Alert></PageStack></main></BrandSurface>;

 return <BrandSurface><main id="main-content" className="container page-space"><PageStack className="attendance-review-page"><AttendanceRegisterWorkspace initial={session} history={history??null} timezone={home.timezone} returnTo={returnTo} canCorrect={home.capabilities.includes('attendance.correct')} canCancel={home.capabilities.includes(session.status==='SUBMITTED'?'attendance.correct':'class.manage')}/></PageStack></main></BrandSurface>;
}
