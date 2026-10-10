import Link from 'next/link';
import {Alert,Badge,ButtonLink,Card,EmptyState,PageHeader} from '@/components/ui/primitives';
import {contextGateway,accountGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {moduleGateway} from '@/lib/server/tenancy';
import {reportingGateway} from '@/lib/server/reporting';
import type {AdminHome} from '@/shared/contracts/access';
import type {AttendanceReport,SchoolAdminOverview} from '@/shared/contracts/reporting';
import {notFound,redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';

export const dynamic='force-dynamic';
const localDate=(date:Date,timezone:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
function tomorrow(date:string){const value=new Date(`${date}T00:00:00.000Z`);value.setUTCDate(value.getUTCDate()+1);return value.toISOString().slice(0,10);}

export default async function AdminPage(){
 const identity=await getIdentity();let home:AdminHome|null=null,directory=null,summary:AttendanceReport|null=null,adminOverview:SchoolAdminOverview|null=null,summaryFailure=false;
 try{home=await accountGateway.getHome(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');if(error instanceof AccessError&&error.code==='NOT_FOUND')notFound();home=null;}
 if(!home)return <main id="main-content" className="container page-space"><Alert tone="danger" title="School overview unavailable">Your current school access could not be verified. Refresh or sign in again.</Alert></main>;
 directory=await contextGateway.getContexts(identity).catch(()=>null);
 adminOverview=await reportingGateway.schoolAdminOverview(identity).catch(()=>null);
 const canReadAttendance=home.capabilities.includes('attendance.read_school')&&await moduleGateway.canUseCurrent(identity,'attendance','attendance.read_school');
 const canReadStudents=home.capabilities.includes('student.read')&&await moduleGateway.canUseCurrent(identity,'student_core','student.read');
 const canEditAcademics=home.capabilities.includes('class.manage')&&await moduleGateway.canUseCurrent(identity,'academic_core','class.manage');
 const today=localDate(new Date(),home.timezone);
 if(canReadAttendance){try{summary=await reportingGateway.overview(identity,{fromDate:today,toDate:tomorrow(today),limit:50});}catch{summaryFailure=true;}}
 const actions=[
  ...(canReadAttendance?[{label:'Schedule a class',href:'/admin/attendance/sessions',description:'Create today’s class session and review its attendance.'}]:[]),
  ...(canReadStudents?[{label:'Open student records',href:'/admin/students',description:'Register a student or look up an existing school record.'}]:[]),
  ...(canEditAcademics?[{label:'Set up academics',href:'/admin/academics',description:'Manage the academic year, grades, sections and subjects.'}]:[]),
 ];
 const managerDirectory=directory?.institutions.filter(institution=>institution.canManage)??[];
 return <main id="main-content" className="container page-space admin-dashboard">
  <PageHeader eyebrow="School overview" title={home.schoolName} description="A quick look at today’s school activity and the tasks you can take next." actions={actions[0]?<ButtonLink href={actions[0].href}>{actions[0].label}</ButtonLink>:undefined}/>
  {summaryFailure&&<Alert tone="warning" title="Today’s attendance summary is unavailable">Your school settings are available. Try the attendance report again when service is restored.</Alert>}
  {canReadAttendance&&<section aria-label="Today at school" className="dashboard-summary">
   <div className="dashboard-section-heading"><div><p className="eyebrow">{today}</p><h2>Today at school</h2></div>{summary&&<Badge tone={summary.counts.pendingSessions?'warning':'success'}>{summary.counts.pendingSessions?`${summary.counts.pendingSessions} need attention`:'Up to date'}</Badge>}</div>
   {summary?<div className="stat-grid dashboard-stat-grid"><Card className="stat-card"><p className="muted small">Scheduled sessions</p><strong className="stat-value">{summary.counts.expectedSessions+summary.counts.futureSessions}</strong><p className="small muted">Started or scheduled for later today.</p></Card><Card className="stat-card"><p className="muted small">Submitted</p><strong className="stat-value">{summary.counts.submittedSessions}</strong><p className="small muted">Attendance is ready to review.</p></Card><Card className="stat-card"><p className="muted small">Awaiting roll call</p><strong className="stat-value">{summary.counts.pendingSessions}</strong><p className="small muted">Sessions that have started but are not submitted.</p></Card></div>:<Card className="padded"><EmptyState title="No sessions scheduled today" description="When a class session is scheduled for today, its progress will appear here." action={<ButtonLink href="/admin/attendance/sessions" variant="secondary">Schedule a class</ButtonLink>}/></Card>}
  </section>}
  {adminOverview&&<section aria-labelledby="attention-title" className="dashboard-attention"><div className="dashboard-section-heading"><div><p className="eyebrow">School operations</p><h2 id="attention-title">Needs attention</h2></div><ButtonLink href="/admin/setup" variant="secondary">Review setup</ButtonLink></div>{adminOverview.exceptions.length?<div className="dashboard-exception-grid">{adminOverview.exceptions.map(item=><Card className="padded dashboard-exception-card" key={item.id}><Badge tone="warning">{item.count}</Badge><div><h3>{item.label}</h3><p className="small muted">{item.detail}</p><Link className="dashboard-action-link" href={item.href}>Open workspace <span aria-hidden="true">→</span></Link></div></Card>)}</div>:<Card className="padded"><EmptyState title="No current exceptions" description="There are no started registers, roster imports or staff access items requiring action in this branch."/></Card>}</section>}
  <div className="dashboard-columns">
   <section className="dashboard-actions" aria-labelledby="common-actions-title"><div className="dashboard-section-heading"><div><p className="eyebrow">Next steps</p><h2 id="common-actions-title">Common tasks</h2></div></div>{actions.length?<div className="dashboard-action-list">{actions.map((action,index)=><Card className="dashboard-action-card" key={action.href}><span className="dashboard-action-number" aria-hidden="true">0{index+1}</span><div><h3>{action.label}</h3><p className="muted">{action.description}</p><Link href={action.href} className="dashboard-action-link">Open workspace <span aria-hidden="true">→</span></Link></div></Card>)}</div>:<Card className="padded"><EmptyState title="No active workspaces" description="Your current account has no released school workspace actions for this branch."/></Card>}</section>
   <aside className="dashboard-school-card"><Card className="padded"><p className="eyebrow">Current branch</p><h2>{home.institutionName}</h2><dl className="school-facts"><div><dt>Branch code</dt><dd>{home.schoolCode}</dd></div><div><dt>Timezone</dt><dd>{home.timezone}</dd></div></dl>{canReadAttendance&&summary&&<ButtonLink href={`/admin/reports/attendance?fromDate=${today}&toDate=${tomorrow(today)}`} variant="secondary">View attendance report</ButtonLink>}</Card></aside>
  </div>
  {managerDirectory.length>0&&<section className="dashboard-branch-management" aria-labelledby="branch-admin-title"><Card className="padded"><div><p className="eyebrow">Institution administration</p><h2 id="branch-admin-title">Manage branches</h2><p className="muted">Create and review branch details in the institution workspace. Branch setup does not grant staff or module access.</p></div><ButtonLink href="/institutions" variant="secondary">Open institution workspace</ButtonLink></Card></section>}
 </main>;
}
