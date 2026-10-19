import {redirect} from 'next/navigation';
import {Alert,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
import {leadershipGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {leadershipAttendanceGateway} from '@/lib/server/attendance';
import Link from 'next/link';

export const dynamic='force-dynamic';

function schoolDate(timezone:string){return new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date());}

export default async function LeadershipHome(){
 const identity=await getIdentity(),home=await leadershipGateway.getHome(identity).catch(()=>null);
 if(!home)redirect('/choose-workspace');
 const coverage=home.capabilities.includes('attendance.read_leadership')?await leadershipAttendanceGateway.get(identity).catch(()=>null):null;
 return <main id="main-content" className="container page-space"><PageStack className="leadership-home">
  <PageHeader eyebrow="Principal workspace" title="My school today" description={`${schoolDate(home.timezone)} · ${home.schoolName}`}/>
  {home.actingDelegation&&<Alert tone="info" title="Acting Principal access">Your temporary access includes only the school work assigned to you and ends at the stated time.</Alert>}
  {coverage?<>
   <Card className="dashboard-summary-strip leadership-summary-strip" aria-label="Attendance coverage summary">
    <div className="dashboard-summary-item"><div><span>Due registers</span><strong>{coverage.counts.due}</strong><p>Due by session end</p></div></div>
    <div className="dashboard-summary-item"><div><span>Registers received</span><strong>{coverage.counts.received}</strong><p>Submitted records</p></div></div>
    <div className="dashboard-summary-item"><div><span>Awaiting submission</span><strong>{coverage.counts.awaiting}</strong><p>{coverage.counts.notDue} not due yet</p></div></div>
   </Card>
   <div className="workspace-dashboard-grid leadership-dashboard-grid">
    <Card className="padded workspace-dashboard-primary"><h2>Attendance oversight</h2><div className="leadership-coverage-summary"><strong>{coverage.counts.received} of {coverage.counts.due} due registers received</strong><p>{coverage.counts.awaiting?`${coverage.counts.awaiting} awaiting submission`:'No due registers are awaiting submission'}.</p><Link className="text-link" href={`/leadership/attendance?date=${coverage.schoolDate}`}>Review attendance coverage <span aria-hidden="true">→</span></Link><span className="small muted">As of {new Date(coverage.asOf).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:coverage.timezone})} · {coverage.timezone}</span></div></Card>
    <Card className="workspace-dashboard-actions"><div className="dashboard-card-title"><h2>Quick access</h2></div><div className="workspace-action-list"><Link href={`/leadership/attendance?date=${coverage.schoolDate}`}><span>Register coverage</span><span aria-hidden="true">→</span></Link><Link href="/leadership/context"><span>School context</span><span aria-hidden="true">→</span></Link><Link href="/leadership/account"><span>My account</span><span aria-hidden="true">→</span></Link></div></Card>
   </div>
  </>:<Card className="padded leadership-unavailable-card"><EmptyState icon="calendar" title="Attendance overview unavailable" description="No register count is inferred. Use the authorized navigation to open another available school area or try Attendance again later."/></Card>}
  <p className="small muted leadership-source-note">Figures shown here use your current branch and access.</p>
 </PageStack></main>;
}
