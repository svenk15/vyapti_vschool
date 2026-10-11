import {notFound,redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {AttendanceCorrections} from '@/components/attendance-corrections';
import {AttendanceCancel} from '@/components/attendance-cancel';
import {Alert,Badge,BrandSurface,ButtonLink,Card,PageHeader,PageStack,SectionHeader} from '@/components/ui/primitives';
import {accountGateway} from '@/lib/server/access';
import {attendanceGateway} from '@/lib/server/attendance';
import {getIdentity} from '@/lib/server/auth';

export const dynamic='force-dynamic';

export default async function AttendanceReviewPage({params}:{params:Promise<{id:string}>}){
 const identity=await getIdentity(),{id}=await params;
 let home,session,history,error:unknown;
 try{
  home=await accountGateway.getHome(identity);
  session=await attendanceGateway.detail(identity,id);
  history=session.status==='SUBMITTED'||session.status==='CANCELLED'?await attendanceGateway.history(identity,id):null;
 }catch(cause){error=cause;}
 if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
 if(error instanceof AccessError&&error.code==='NOT_FOUND')notFound();
 if(!home||!session||(session.status==='SUBMITTED'||session.status==='CANCELLED')&&!history)return <BrandSurface><main className="container page-space"><PageStack><PageHeader title="Attendance register" actions={<ButtonLink href="/admin" variant="secondary">Return to Today</ButtonLink>}/><Alert tone="danger" title="Register unavailable">Your current branch access or school-wide attendance permission could not be verified. No empty register has been inferred.</Alert></PageStack></main></BrandSurface>;

 const submitted=session.status==='SUBMITTED',cancelled=session.status==='CANCELLED';
 const title=submitted?'Correct submitted attendance':cancelled?'Canceled attendance register':'Attendance session';
 const start=new Date(session.startsAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:home.timezone});
 const end=new Date(session.endsAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:home.timezone});
 const sessionLabel=`${session.offering.subjectName} · ${session.offering.sectionName} · ${session.schoolDate} · ${start}`;
 return <BrandSurface><main id="main-content" className="container page-space"><PageStack className="attendance-review-page branch-edit-page">
  <PageHeader title={title} description={`${home.institutionName} · ${home.schoolName}`} actions={!submitted&&!cancelled?<ButtonLink href="/admin/attendance/sessions" variant="secondary">All sessions</ButtonLink>:undefined}/>
  {!submitted&&!cancelled&&<Card className="padded settings-panel attendance-session-summary-card"><SectionHeader title="Session summary" description={`${session.schoolDate} · ${start}–${end} · ${home.timezone}`} actions={<Badge tone="info">{session.status}</Badge>}/><dl className="record-facts"><div><dt>Class and subject</dt><dd>{session.offering.sectionName} · {session.offering.subjectName}</dd></div><div><dt>Register</dt><dd>Awaiting teacher submission</dd></div><div><dt>School date</dt><dd>{session.schoolDate}</dd></div><div><dt>Frozen roster</dt><dd>{session.roster?.length??0} student{session.roster?.length===1?'':'s'}</dd></div></dl></Card>}
  {(session.status==='SCHEDULED'||session.status==='OPEN')&&<AttendanceCancel initial={session}/>}
  {submitted||cancelled?<AttendanceCorrections initial={session} initialHistory={history!} sessionLabel={sessionLabel}/>:<Alert tone="info" title="Register not submitted">An administrator can inspect or cancel this session, but only the assigned teacher can mark and submit attendance.</Alert>}
 </PageStack></main></BrandSurface>;
}
