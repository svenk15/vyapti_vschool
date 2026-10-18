import {redirect} from 'next/navigation';
import {Alert,Badge,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
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
  <PageHeader eyebrow="Principal workspace" title="My school today" description={`${home.institutionName} · ${home.schoolName} · ${schoolDate(home.timezone)}`}/>
  <Alert tone="info" title={home.actingDelegation?'Acting Principal access':'Your school view'}>{home.actingDelegation?'Your temporary access includes only the school work assigned to you and ends at the stated time.':'Your dashboard shows the school information and actions currently available to you.'}</Alert>
  <section className="leadership-day-card" aria-labelledby="leadership-priorities-title"><div><Badge tone="success">Current branch</Badge><h2 id="leadership-priorities-title">Today’s priorities</h2><p>Attendance and other available school work appear here for this branch.</p></div><span className="leadership-day-icon" aria-hidden="true">✓</span></section>
  <div className="leadership-foundation-grid">
   <Card className="padded"><h2>Attendance oversight</h2>{coverage?<div className="leadership-coverage-summary"><strong>{coverage.counts.received} of {coverage.counts.due} due registers received</strong><p>{coverage.counts.awaiting?`${coverage.counts.awaiting} awaiting submission`:'No due registers are awaiting submission'}. {coverage.counts.notDue} not due yet.</p><Link className="text-link" href={`/leadership/attendance?date=${coverage.schoolDate}`}>Review attendance coverage <span aria-hidden="true">→</span></Link><span className="small muted">As of {new Date(coverage.asOf).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:coverage.timezone})} · Due at scheduled session end</span></div>:<EmptyState icon="calendar" title="Oversight projection unavailable" description="No register count is inferred. Check Attendance availability and try again."/>}</Card>
   <Card className="padded"><h2>Other school areas</h2><EmptyState icon="document" title="No additional dashboard summaries" description="Use the navigation to open other school areas available to you."/></Card>
  </div>
  <p className="small muted">Figures shown here use your current branch and access.</p>
 </PageStack></main>;
}
