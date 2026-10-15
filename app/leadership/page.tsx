import {redirect} from 'next/navigation';
import {Alert,Badge,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
import {leadershipGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';

export const dynamic='force-dynamic';

function schoolDate(timezone:string){return new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date());}

export default async function LeadershipHome(){
 const identity=await getIdentity(),home=await leadershipGateway.getHome(identity).catch(()=>null);
 if(!home)redirect('/choose-workspace');
 return <main id="main-content" className="container page-space"><PageStack className="leadership-home">
  <PageHeader eyebrow="Principal workspace" title="My school today" description={`${home.institutionName} · ${home.schoolName} · ${schoolDate(home.timezone)}`}/>
  <Alert tone="info" title="Branch-scoped leadership view">This workspace shows only information released for your explicit Principal grant. Operational owner permissions are checked independently.</Alert>
  <section className="leadership-day-card" aria-labelledby="leadership-priorities-title"><div><Badge tone="success">Current branch</Badge><h2 id="leadership-priorities-title">Today’s priorities</h2><p>Operational summaries appear here only after their source owner, definition and drill-down permission are available.</p></div><span className="leadership-day-icon" aria-hidden="true">✓</span></section>
  <div className="leadership-foundation-grid">
   <Card className="padded"><h2>Attendance oversight</h2><EmptyState icon="calendar" title="Oversight projection not released" description="No register count is inferred. Attendance status will appear after the bounded owner projection is verified."/></Card>
   <Card className="padded"><h2>Other school areas</h2><EmptyState icon="document" title="No additional leadership modules enabled" description="Unavailable modules are omitted rather than shown as zero or presented as working actions."/></Card>
  </div>
  <p className="small muted">Access and branch context are live. Dashboard metrics and decision actions remain separate owner-module releases.</p>
 </PageStack></main>;
}
