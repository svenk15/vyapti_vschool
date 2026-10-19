import {redirect} from 'next/navigation';
import {LandingAttention,LandingCalendar,LandingQuickAccess,LandingSummary} from '@/components/landing-page';
import {Alert,Card,EmptyState,PageHeader,PageStack,SectionHeader} from '@/components/ui/primitives';
import {leadershipGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {leadershipAttendanceGateway} from '@/lib/server/attendance';
import {decisionGateway} from '@/lib/server/decisions';
import {coordinationGateway} from '@/lib/server/coordination';
import {learningGateway} from '@/lib/server/learning';
import {assessmentsGateway} from '@/lib/server/assessments';
import {communicationGateway} from '@/lib/server/communication';

export const dynamic='force-dynamic';

function dateParts(timezone:string){const now=new Date(),date=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now),label=new Intl.DateTimeFormat('en-IN',{timeZone:timezone,year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(now);return {date,label};}
function time(value:string,timezone:string){return new Intl.DateTimeFormat('en-IN',{timeZone:timezone,hour:'numeric',minute:'2-digit'}).format(new Date(value));}
function shift(value:string,days:number){const date=new Date(`${value}T12:00:00.000Z`);date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10);}

export default async function LeadershipHome(){
 const identity=await getIdentity(),home=await leadershipGateway.getHome(identity).catch(()=>null);
 if(!home)redirect('/choose-workspace');
 const current=dateParts(home.timezone),[coverage,decisions,followUps,learning,assessment,communication]=await Promise.all([
  home.capabilities.includes('attendance.read_leadership')?leadershipAttendanceGateway.get(identity).catch(()=>null):null,
  decisionGateway.list(identity,{sort:'due',order:'asc',limit:3}).catch(()=>null),
  coordinationGateway.list(identity,{limit:3}).catch(()=>null),
  home.capabilities.includes('learning.read_leadership')?learningGateway.leadershipOverview(identity,{fromDate:shift(current.date,-30),toDate:shift(current.date,1),classId:null,subjectId:null,cursor:null,limit:3}).catch(()=>null):null,
  assessmentsGateway.leadershipReadiness(identity).catch(()=>null),
  home.capabilities.includes('communication.read_leadership')?communicationGateway.listLeadership(identity,{limit:3}).catch(()=>null):null,
 ]);
 const attention=coverage?.awaiting.items.slice(0,5).map(item=>({id:item.id,title:`${item.sectionName} · ${item.subjectName}`,description:`Due ${time(item.dueAt,coverage.timezone)} · ${item.teacherName??'Teacher assignment unavailable'}`,href:`/leadership/attendance/sessions/${item.id}?date=${coverage.schoolDate}`,actionLabel:'Inspect source',icon:'clock' as const,tone:'warning' as const}))??[];
 const decisionItems=decisions?.items.map(item=>({id:`${item.owner}:${item.itemId}`,title:item.title,description:item.typeLabel,href:`/leadership/decisions/${item.owner}/${item.itemId}`,actionLabel:'Review decision',icon:'attention' as const,tone:'warning' as const}))??[];
 const activeFollowUps=followUps?.items.filter(item=>item.status!=='RESOLVED'&&item.status!=='WITHDRAWN')??[];
 const followUpItems=activeFollowUps.slice(0,Math.max(0,3-decisionItems.length)).map(item=>({id:item.id,title:item.kind.replaceAll('_',' ').toLowerCase(),description:`${item.status.replaceAll('_',' ').toLowerCase()}${item.assignee?` · ${item.assignee.displayName}`:''}`,href:`/leadership/coordination/${item.id}`,actionLabel:'Open follow-up',icon:'clock' as const,tone:item.overdue?'danger' as const:'info' as const}));
 const principalAttention=[...decisionItems,...followUpItems];
 const quick=[...(coverage?[{label:'Register coverage',href:`/leadership/attendance?date=${coverage.schoolDate}`,icon:'report' as const}]:[]),...(decisions?[{label:'My decisions',href:'/leadership/decisions',icon:'attention' as const}]:[]),...(learning?[{label:'Learning completion',href:'/leadership/learning',icon:'book' as const}]:[]),...(assessment?[{label:'Assessment readiness',href:'/leadership/assessments',icon:'report' as const}]:[]),...(communication?[{label:'Notice coverage',href:'/leadership/communication',icon:'mail' as const}]:[])];
 return <main id="main-content" className="container page-space"><PageStack className="leadership-home landing-production-page">
  <PageHeader eyebrow="Principal workspace" title="My school today" description={`${current.label} · ${home.schoolName}`}/>
  {home.actingDelegation&&<Alert tone="info" title="Acting Principal access">Your temporary access includes only the school work assigned to you and ends at the stated time.</Alert>}
  {(coverage||decisions||followUps||learning||assessment||communication)?<>
   <LandingSummary label="School leadership summary" metrics={[{label:'Registers received',value:coverage?`${coverage.counts.received} / ${coverage.counts.due}`:'—',detail:coverage?'Of registers currently due':'Attendance unavailable',icon:'check'},{label:'Decisions ready',value:decisions?`${decisions.items.length}${decisions.nextCursor?'+':''}`:'—',detail:'Current owner-authorized queue',icon:'attention'},{label:'Active follow-ups',value:followUps?`${activeFollowUps.length}${followUps.nextCursor?'+':''}`:'—',detail:'Open assigned operational work',icon:'clock'},{label:'Learning awaiting',value:learning?String(learning.counts.awaitingPairs):'—',detail:'Non-excused due learner-assignment pairs',icon:'book'}]}/>
   <div className="landing-grid"><div className="landing-column">
    <LandingAttention title="Needs your decision" items={principalAttention} totalLabel={principalAttention.length?`${principalAttention.length}${decisions?.nextCursor||followUps?.nextCursor?'+':''} current`:'None waiting'} totalTone={principalAttention.length?'warning':'neutral'} emptyTitle="No current decisions or follow-ups" emptyDescription="Only work that its owning module currently authorizes appears here."/>
    {coverage&&<LandingAttention title="Attendance follow-up" items={attention} totalLabel={coverage.awaiting.total?`${coverage.awaiting.total} awaiting`:'None awaiting'} totalTone={coverage.awaiting.total?'warning':'neutral'} emptyTitle="No due registers awaiting submission" emptyDescription="Received and awaiting registers reconcile with today’s due total."/>}
    <Card className="padded"><SectionHeader title="School-wide signals" description="Current owner facts; unavailable sources are not shown as zero."/><dl className="record-facts"><div><dt>Assessment readiness</dt><dd>{assessment?assessment.readyForApproval?'Ready for approval':`${assessment.counts.missing} missing · ${assessment.counts.moderationPending} moderation pending`:'Unavailable'}</dd></div><div><dt>Current notice publications</dt><dd>{communication?communication.total:'Unavailable'}</dd></div><div><dt>Learning assignments in window</dt><dd>{learning?learning.counts.assignments:'Unavailable'}</dd></div></dl></Card>
   </div><div className="landing-column">
    <LandingCalendar today={current.date} entries={[]} loadedRange={{from:current.date,to:current.date,complete:false}} scopeKey={`${home.scope.organizationId}:${home.scope.schoolId}`} state="unsupported"/>
    <LandingQuickAccess links={[...quick,{label:'School context',href:'/leadership/context',icon:'settings'},{label:'My account',href:'/leadership/account',icon:'staff'}]}/>
   </div></div>
  </>:<Card className="padded leadership-unavailable-card"><EmptyState icon="calendar" title="Leadership overview unavailable" description="No school-wide count is inferred. Open another authorized area or try again later."/></Card>}
 </PageStack></main>;
}
