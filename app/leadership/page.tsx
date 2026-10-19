import {redirect} from 'next/navigation';
import {LandingAttention,LandingCalendar,LandingQuickAccess,LandingSummary} from '@/components/landing-page';
import {Alert,Card,EmptyState,PageHeader,PageStack,SectionHeader} from '@/components/ui/primitives';
import {leadershipGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {leadershipAttendanceGateway} from '@/lib/server/attendance';

export const dynamic='force-dynamic';

function dateParts(timezone:string){const now=new Date(),date=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now),label=new Intl.DateTimeFormat('en-IN',{timeZone:timezone,year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(now);return {date,label};}
function time(value:string,timezone:string){return new Intl.DateTimeFormat('en-IN',{timeZone:timezone,hour:'numeric',minute:'2-digit'}).format(new Date(value));}

export default async function LeadershipHome(){
 const identity=await getIdentity(),home=await leadershipGateway.getHome(identity).catch(()=>null);
 if(!home)redirect('/choose-workspace');
 const current=dateParts(home.timezone),coverage=home.capabilities.includes('attendance.read_leadership')?await leadershipAttendanceGateway.get(identity).catch(()=>null):null;
 const attention=coverage?.awaiting.items.slice(0,5).map(item=>({id:item.id,title:`${item.sectionName} · ${item.subjectName}`,description:`Due ${time(item.dueAt,coverage.timezone)} · ${item.teacherName??'Teacher assignment unavailable'}`,href:`/leadership/attendance/sessions/${item.id}?date=${coverage.schoolDate}`,actionLabel:'Inspect source',icon:'clock' as const,tone:'warning' as const}))??[];
 return <main id="main-content" className="container page-space"><PageStack className="leadership-home landing-production-page">
  <PageHeader eyebrow="Principal workspace" title="My school today" description={`${current.label} · ${home.schoolName}`}/>
  {home.actingDelegation&&<Alert tone="info" title="Acting Principal access">Your temporary access includes only the school work assigned to you and ends at the stated time.</Alert>}
  {coverage?<>
   <LandingSummary label="School-day attendance summary" metrics={[{label:'Scheduled registers',value:String(coverage.counts.scheduled),detail:'Current school date',icon:'calendar'},{label:'Due registers',value:String(coverage.counts.due),detail:'Due by session end',icon:'clock'},{label:'Registers received',value:String(coverage.counts.received),detail:'Submitted records',icon:'check'},{label:'Awaiting submission',value:String(coverage.counts.awaiting),detail:`${coverage.counts.notDue} not due yet`,icon:'attention'}]}/>
   <div className="landing-grid"><div className="landing-column">
    <LandingAttention title="Attendance follow-up" items={attention} totalLabel={coverage.awaiting.total?`${coverage.awaiting.total} awaiting`:'None awaiting'} totalTone={coverage.awaiting.total?'warning':'neutral'} emptyTitle="No due registers awaiting submission" emptyDescription="Received and awaiting registers reconcile with today’s due total."/>
    <Card className="padded"><SectionHeader title="Attendance oversight" description={`${coverage.counts.received} of ${coverage.counts.due} due registers received`}/><p className="muted">Figures use your current school and access as of {time(coverage.asOf,coverage.timezone)}.</p><a href={`/leadership/attendance?date=${coverage.schoolDate}`}>Review register coverage <span aria-hidden="true">→</span></a></Card>
   </div><div className="landing-column">
    <LandingCalendar today={current.date} entries={[]} loadedRange={{from:current.date,to:current.date,complete:false}} scopeKey={`${home.scope.organizationId}:${home.scope.schoolId}`} state="unsupported"/>
    <LandingQuickAccess links={[{label:'Register coverage',href:`/leadership/attendance?date=${coverage.schoolDate}`,icon:'report'},{label:'School context',href:'/leadership/context',icon:'settings'},{label:'My account',href:'/leadership/account',icon:'staff'}]}/>
   </div></div>
  </>:<Card className="padded leadership-unavailable-card"><EmptyState icon="calendar" title="Attendance overview unavailable" description="No register count is inferred. Open another authorized school area or try Attendance again later."/></Card>}
 </PageStack></main>;
}
