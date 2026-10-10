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
const localTime=(value:string,timezone:string)=>new Intl.DateTimeFormat('en-GB',{timeZone:timezone,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
const longSchoolDate=(value:string)=>new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00.000Z`));
function DashboardIcon({name}:{name:'check'|'students'|'attention'|'attendance'|'imports'|'staff'|'setup'}){const paths={
 check:<path d="m5 12 4 4L19 6"/>,students:<><path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M17 8a3 3 0 0 1 0 6M21 20v-2a3 3 0 0 0-2-2.8"/></>,attention:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,attendance:<><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,imports:<><path d="M12 16V4M7 9l5-5 5 5M5 14v5h14v-5"/></>,staff:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 10 0v2M17 8v6M14 11h6"/></>,setup:<><path d="M4 20V8l8-5 8 5v12M8 20v-7h8v7M3 20h18"/></>
 } as const;return <svg className="dashboard-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>;}

export default async function AdminPage(){
 const identity=await getIdentity();let home:AdminHome|null=null,directory=null,summary:AttendanceReport|null=null,adminOverview:SchoolAdminOverview|null=null,summaryFailure=false;
 try{home=await accountGateway.getHome(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');if(error instanceof AccessError&&error.code==='NOT_FOUND')notFound();home=null;}
 if(!home)return <main id="main-content" className="container page-space"><Alert tone="danger" title="School overview unavailable">Your current school access could not be verified. Refresh or sign in again.</Alert></main>;
 directory=await contextGateway.getContexts(identity).catch(()=>null);
 adminOverview=await reportingGateway.schoolAdminOverview(identity).catch(()=>null);
 const canReadAttendance=home.capabilities.includes('attendance.read_school')&&await moduleGateway.canUseCurrent(identity,'attendance','attendance.read_school');
 const canReadStudents=home.capabilities.includes('student.read')&&await moduleGateway.canUseCurrent(identity,'student_core','student.read');
 const canManageStaff=home.capabilities.includes('class.manage')&&await moduleGateway.canUseCurrent(identity,'staff_core','class.manage');
 const today=localDate(new Date(),home.timezone);
 if(canReadAttendance){try{summary=await reportingGateway.overview(identity,{fromDate:today,toDate:tomorrow(today),limit:50});}catch{summaryFailure=true;}}
 const actions=[
  ...(canReadStudents?[{label:'Register a student',href:'/admin/students?action=register',description:'Create a scoped student record and current enrollment.'}]:[]),
  ...(canManageStaff?[{label:'Add a staff profile',href:'/admin/teachers',description:'Create staff identity and employment details.'}]:[]),
  ...(canReadAttendance?[{label:'Schedule a session',href:'/admin/attendance/sessions',description:'Create today’s class session and review its attendance.'}]:[]),
 ];
 const managerDirectory=directory?.institutions.filter(institution=>institution.canManage)??[];
 const activeStudents=adminOverview?.readiness.find(item=>item.id==='students')?.count??0;
 const attentionCount=adminOverview?.exceptions.reduce((total,item)=>total+item.count,0)??0;
 const scheduledCount=summary?summary.counts.expectedSessions+summary.counts.futureSessions:0;
 const currentDaySessions=summary?.sessions.items.filter(item=>item.status!=='CANCELLED')??[];
 const todaySessions=currentDaySessions.length<=3?currentDaySessions:[...currentDaySessions.slice(0,2),currentDaySessions.at(-1)!];
 const completion=adminOverview&&adminOverview.totalCount?Math.round(adminOverview.completeCount/adminOverview.totalCount*100):0;
 return <main id="main-content" className="container page-space admin-dashboard">
  <PageHeader title="A clear start to your school day" description={`${longSchoolDate(today)} · ${home.schoolName}`} actions={<ButtonLink href="/admin/setup" variant="secondary"><DashboardIcon name="setup"/> School setup</ButtonLink>}/>
  {summaryFailure&&<Alert tone="warning" title="Today’s attendance summary is unavailable">Your school settings are available. Try the attendance report again when service is restored.</Alert>}
  <section aria-label="School-day summary" className="dashboard-summary-grid">
   <Card className="dashboard-metric"><div><p>Registers submitted</p><strong>{summary?`${summary.counts.submittedSessions} / ${scheduledCount}`:'—'}</strong><span>Of today’s non-cancelled sessions</span></div><DashboardIcon name="check"/></Card>
   <Card className="dashboard-metric"><div><p>Active students</p><strong>{adminOverview?activeStudents:'—'}</strong><span>{activeStudents?`Across current class placements`:'No current placements'}</span></div><DashboardIcon name="students"/></Card>
   <Card className="dashboard-metric"><div><p>Needs your attention</p><strong>{adminOverview?attentionCount:'—'}</strong><span>Attendance · import · staff access</span></div><DashboardIcon name="attention"/></Card>
  </section>
  <div className="dashboard-work-grid">
   <div className="dashboard-primary-column">
    {adminOverview&&<Card className="dashboard-work-card" aria-labelledby="attention-title"><div className="dashboard-card-title"><h2 id="attention-title">Needs your attention</h2><Badge tone={attentionCount?'warning':'success'}>{attentionCount?`${attentionCount} item${attentionCount===1?'':'s'}`:'Up to date'}</Badge></div>{adminOverview.exceptions.length?<div className="dashboard-work-list">{adminOverview.exceptions.map(item=><div className="dashboard-work-row" key={item.id}><span className="dashboard-work-icon"><DashboardIcon name={item.id}/></span><div><h3>{item.label}</h3><p>{item.detail}</p></div><ButtonLink href={item.href} variant="secondary">{item.actionLabel}</ButtonLink></div>)}</div>:<EmptyState title="No current exceptions" description="There are no started registers, roster imports or staff access items requiring action in this branch."/>}</Card>}
    {adminOverview&&<Card className="dashboard-readiness-card"><div className="dashboard-card-title"><h2>Your school, ready to run</h2><Link href="/admin/setup">View setup <span aria-hidden="true">→</span></Link></div><p>{adminOverview.completeCount} of {adminOverview.totalCount} foundations are ready. Continue with the next saved dependency.</p><progress aria-label="School setup completion" value={completion} max={100}/><div className="dashboard-readiness-badges">{adminOverview.readiness.filter(item=>item.complete).slice(0,4).map(item=><Badge tone="success" key={item.id}>{item.label} ready</Badge>)}</div></Card>}
   </div>
   <div className="dashboard-secondary-column">
    {canReadAttendance&&<Card className="dashboard-sessions-card"><div className="dashboard-card-title"><h2>Today’s sessions</h2><Link href={`/admin/reports/attendance?fromDate=${today}&toDate=${tomorrow(today)}`}>View all</Link></div>{todaySessions.length?<div className="dashboard-session-list">{todaySessions.map(item=><Link href={`/admin/attendance/sessions/${item.id}`} key={item.id} className="dashboard-session-row"><time>{localTime(item.startsAt,home.timezone)}</time><div><strong>{item.subjectName}</strong><span>{item.sectionName}{item.teacherName?` · ${item.teacherName}`:''}</span><Badge tone={item.status==='SUBMITTED'?'success':item.status==='OPEN'?'warning':'info'}>{item.status==='OPEN'?'Not submitted':item.status.charAt(0)+item.status.slice(1).toLowerCase()}</Badge></div></Link>)}</div>:<EmptyState icon="calendar" title="No sessions today" description={`No sessions are scheduled for ${longSchoolDate(today)}. Scheduled sessions will appear here with their current submission state.`} action={<ButtonLink href="/admin/attendance/sessions" variant="secondary">Schedule a session</ButtonLink>}/>}</Card>}
    <Card className="dashboard-quick-card" aria-labelledby="common-actions-title"><div className="dashboard-card-title"><h2 id="common-actions-title">Quick actions</h2></div>{actions.length?<div className="dashboard-quick-list">{actions.map(action=><Link href={action.href} key={action.href}><span aria-hidden="true">→</span>{action.label}</Link>)}</div>:<EmptyState title="No active workspaces" description="Your current role has no released actions in this branch."/>}</Card>
   </div>
  </div>
  {managerDirectory.length>0&&<details className="dashboard-branch-management"><summary>Institution administration</summary><Card className="padded"><div><h2>Manage branches</h2><p className="muted">Create and review branch details in the institution workspace. Branch setup does not grant staff or module access.</p></div><ButtonLink href="/institutions" variant="secondary">Open institution workspace</ButtonLink></Card></details>}
 </main>;
}
