import Link from 'next/link';
import {Alert,ButtonLink,Card,EmptyState,PageHeader} from '@/components/ui/primitives';
import {contextGateway,accountGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {moduleGateway} from '@/lib/server/tenancy';
import {reportingGateway} from '@/lib/server/reporting';
import type {AdminHome} from '@/shared/contracts/access';
import type {AttendanceReport,SchoolAdminOverview} from '@/shared/contracts/reporting';
import {notFound,redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {eventsGateway} from '@/lib/server/events';
import {LandingAttention,LandingCalendar,LandingQuickAccess,LandingSessions,LandingSummary,type LandingCalendarEntry,type LandingSession} from '@/components/landing-page';

export const dynamic='force-dynamic';
const localDate=(date:Date,timezone:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
function tomorrow(date:string){const value=new Date(`${date}T00:00:00.000Z`);value.setUTCDate(value.getUTCDate()+1);return value.toISOString().slice(0,10);}
const localTime=(value:string,timezone:string)=>new Intl.DateTimeFormat('en-GB',{timeZone:timezone,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
const longSchoolDate=(value:string)=>new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00.000Z`));
function DashboardIcon({name}:{name:'check'|'students'|'attention'|'attendance'|'imports'|'staff'|'gear'|'report'|'plus'|'arrow'}){const paths={
 check:<path d="m5 12 4 4L19 6"/>,students:<><path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M17 8a3 3 0 0 1 0 6M21 20v-2a3 3 0 0 0-2-2.8"/></>,attention:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,attendance:<><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,imports:<><path d="M12 16V4M7 9l5-5 5 5M5 14v5h14v-5"/></>,staff:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 10 0v2M17 8v6M14 11h6"/></>,gear:<><path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/></>,report:<><path d="M4 3v18h17"/><path d="M8 17v-5m5 5V7m5 10V9"/></>,plus:<path d="M12 5v14M5 12h14"/>,arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>
 } as const;return <svg className="dashboard-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>;}

const sessionStatus=(status:AttendanceReport['sessions']['items'][number]['status'])=>status==='OPEN'?'Not submitted':status.charAt(0)+status.slice(1).toLowerCase();
const sessionTone=(status:AttendanceReport['sessions']['items'][number]['status'])=>status==='SUBMITTED'?'success' as const:status==='OPEN'?'warning' as const:'info' as const;

export default async function AdminPage(){
 const identity=await getIdentity();let home:AdminHome|null=null,directory=null,summary:AttendanceReport|null=null,adminOverview:SchoolAdminOverview|null=null,summaryFailure=false,calendarUnavailable=false,calendarRows:Awaited<ReturnType<typeof eventsGateway.listAdmin>>=[];
 try{home=await accountGateway.getHome(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');if(error instanceof AccessError&&error.code==='NOT_FOUND')notFound();home=null;}
 if(!home)return <main id="main-content" className="container page-space"><Alert tone="danger" title="School overview unavailable">Your current school access could not be verified. Refresh or sign in again.</Alert></main>;
 directory=await contextGateway.getContexts(identity).catch(()=>null);
 adminOverview=await reportingGateway.schoolAdminOverview(identity).catch(()=>null);
 const canReadAttendance=home.capabilities.includes('attendance.read_school')&&await moduleGateway.canUseCurrent(identity,'attendance','attendance.read_school');
 const canReadStudents=home.capabilities.includes('student.read')&&await moduleGateway.canUseCurrent(identity,'student_core','student.read');
 const canManageStudents=home.capabilities.includes('student.manage')&&await moduleGateway.canUseCurrent(identity,'student_core','student.manage');
 const canManageStaff=home.capabilities.includes('class.manage')&&await moduleGateway.canUseCurrent(identity,'staff_core','class.manage');
 const canManageSchool=home.capabilities.includes('school.manage');
 const canPublishCommunication=home.capabilities.includes('communication.publish');
 const today=localDate(new Date(),home.timezone);
 if(canReadAttendance){try{summary=await reportingGateway.overview(identity,{fromDate:today,toDate:tomorrow(today),limit:50});}catch{summaryFailure=true;}}
 if(canPublishCommunication){try{calendarRows=await eventsGateway.listAdmin(identity);}catch{calendarUnavailable=true;}}
 const quickAccess=[
  ...(canReadStudents?[{label:'Student directory',href:'/admin/students',icon:'students' as const}]:[]),
  ...(canManageStaff?[{label:'Staff directory',href:'/admin/teachers',icon:'staff' as const}]:[]),
  ...(canReadAttendance?[{label:'Attendance report',href:`/admin/reports/attendance?fromDate=${today}&toDate=${tomorrow(today)}`,icon:'report' as const}]:[]),
  ...(canManageSchool?[{label:'School settings',href:'/admin/school',icon:'settings' as const}]:[]),
 ];
 const managerDirectory=directory?.institutions.filter(institution=>institution.canManage)??[];
 const activeStudents=adminOverview?.readiness.find(item=>item.id==='students')?.count??0;
 const attentionCount=adminOverview?.exceptions.reduce((total,item)=>total+item.count,0)??0;
 const scheduledCount=summary?summary.counts.expectedSessions+summary.counts.futureSessions:0;
 const currentDaySessions=summary?.sessions.items.filter(item=>item.status!=='CANCELLED')??[];
 const todaySessions=currentDaySessions.length<=3?currentDaySessions:[...currentDaySessions.slice(0,2),currentDaySessions.at(-1)!];
 const completion=adminOverview&&adminOverview.totalCount?Math.round(adminOverview.completeCount/adminOverview.totalCount*100):0;
 const remainingReadiness=adminOverview?.readiness.filter(item=>!item.complete)??[];
 const exceptionCategoryCount=adminOverview?.exceptions.length??0;
 const eventDate=(value:string)=>value.slice(0,10);
 const calendarEntries:LandingCalendarEntry[]=calendarRows.filter(row=>row.status==='PUBLISHED'||row.status==='CANCELED').map(row=>({id:row.id,title:row.title,startsOn:row.schedule.kind==='ALL_DAY'?row.schedule.startsOn:eventDate(row.schedule.startsAt),endsOn:row.schedule.kind==='ALL_DAY'?row.schedule.endsOn:eventDate(row.schedule.endsAt),timeLabel:row.schedule.kind==='ALL_DAY'?'All day':localTime(row.schedule.startsAt,home.timezone),typeLabel:row.category==='HOLIDAY'?'Holiday':row.category==='CLASS_EVENT'?'Class event':'Meeting',closure:row.category==='HOLIDAY'||row.status==='CANCELED',href:`/admin/events/${row.id}`}));
 const landingSessions:LandingSession[]=todaySessions.map(item=>({id:item.id,time:localTime(item.startsAt,home.timezone),title:item.sectionName,context:item.subjectName,teacher:item.teacherName??undefined,status:sessionStatus(item.status),tone:sessionTone(item.status),href:`/admin/attendance/sessions/${item.id}`,actionLabel:item.status==='SUBMITTED'?'Review':'Open session'}));
 return <main id="main-content" className="container page-space admin-dashboard">
  <PageHeader title="Your school day, at a glance" description={`${longSchoolDate(today)} · ${home.schoolName}`} actions={<div className="button-row">{canManageStudents&&<ButtonLink href="/admin/students/register"><DashboardIcon name="plus"/> Register student</ButtonLink>}<ButtonLink href="/admin/setup" variant="secondary"><DashboardIcon name="gear"/> School setup</ButtonLink></div>}/>
  {!canReadAttendance&&<Alert tone="info" title="Attendance is unavailable in this branch">The attendance module or your current school-wide attendance capability is not active. Other authorized overview information remains available.</Alert>}
  {summaryFailure&&<Alert tone="warning" title="Today’s attendance summary is unavailable">No zero count or empty schedule has been inferred. <Link href="/admin">Retry Today</Link> or open Attendance when the service is restored.</Alert>}
  {!adminOverview&&<Alert tone="warning" title="School overview data is unavailable">Student readiness and attention items could not be loaded. Attendance remains separate below when it is available.</Alert>}
  <LandingSummary label="School-day summary" metrics={[{label:'Registers submitted',value:summary?`${summary.counts.submittedSessions} / ${scheduledCount}`:'—',detail:'Of today’s non-cancelled sessions',icon:'check'},{label:'Active students',value:adminOverview?String(activeStudents):'—',detail:activeStudents?'Across current class placements':'No current placements',icon:'students'},{label:'Needs your attention',value:adminOverview?String(attentionCount):'—',detail:'Attendance · import · staff access',icon:'attention'}]}/>
  <div className="dashboard-work-grid landing-grid">
   <div className="dashboard-primary-column">
    {adminOverview&&<LandingAttention items={adminOverview.exceptions.map(item=>({id:item.id,title:item.label,description:item.detail,href:item.href,actionLabel:item.actionLabel,icon:item.id==='imports'?'upload':item.id==='staff'?'staff':'clock'}))} totalLabel={attentionCount?`${exceptionCategoryCount} ${exceptionCategoryCount===1?'category':'categories'} · ${attentionCount} ${attentionCount===1?'issue':'issues'}`:'Up to date'} emptyTitle="No current exceptions" emptyDescription="There are no started registers, roster imports or staff access items requiring action in this branch."/>}
    {canReadAttendance&&summary&&<LandingSessions sessions={landingSessions} viewAllHref={`/admin/reports/attendance?fromDate=${today}&toDate=${tomorrow(today)}`}/>}
   </div>
   <div className="dashboard-secondary-column">
    <LandingCalendar today={today} entries={calendarEntries} href={canPublishCommunication?'/admin/events':undefined} unavailable={!canPublishCommunication||calendarUnavailable}/>
    {quickAccess.length?<LandingQuickAccess links={quickAccess}/>:<Card><EmptyState title="No available destinations" description="Your current permissions do not expose any dashboard shortcuts in this branch."/></Card>}
    {adminOverview&&<Card className="dashboard-readiness-card"><div className="dashboard-card-title"><h2>School setup</h2><Link href="/admin/setup">View setup <DashboardIcon name="arrow"/></Link></div><p>{adminOverview.completeCount} of {adminOverview.totalCount} foundations are ready.</p><progress aria-label="School setup completion" value={completion} max={100}/>{remainingReadiness.length?<ul className="dashboard-readiness-remaining" aria-label="Remaining setup requirements">{remainingReadiness.map(item=><li key={item.id}><strong>{item.label}</strong><span>{item.detail}</span></li>)}</ul>:<p className="dashboard-readiness-complete">All required foundations are ready.</p>}</Card>}
   </div>
  </div>
  {managerDirectory.length>0&&<details className="dashboard-branch-management"><summary>Institution administration</summary><Card className="padded"><div><h2>Manage branches</h2><p className="muted">Create and review branch details in the institution workspace. Branch setup does not grant staff or module access.</p></div><ButtonLink href="/institutions" variant="secondary">Open institution workspace</ButtonLink></Card></details>}
 </main>;
}
