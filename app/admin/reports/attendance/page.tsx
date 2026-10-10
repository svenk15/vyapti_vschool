import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {AttendanceReportExport} from '@/components/attendance-report-export';
import {Alert,Badge,BrandSurface,Button,ButtonLink,Card,EmptyState,PageHeader,PageStack,SectionHeader,StatCard} from '@/components/ui/primitives';
import {SelectField,TextField} from '@/components/ui/forms';
import {ServerTable} from '@/components/ui/server-table';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {reportingGateway} from '@/lib/server/reporting';
import type {AttendanceReport,AttendanceReportRow} from '@/shared/contracts/reporting';

export const dynamic='force-dynamic';
const first=(value:string|string[]|undefined)=>Array.isArray(value)?undefined:value;
const localDate=(date:Date,timezone:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const statusTone=(status:AttendanceReportRow['status'])=>status==='SUBMITTED'?'success':status==='CANCELLED'?'neutral':status==='OPEN'?'warning':'info';
const reportError=(error:unknown)=>error instanceof AccessError&&error.code==='VALIDATION'?{title:'Check the report filters',message:'Use valid dates in chronological order and select no more than 31 days.'}:error instanceof AccessError&&error.code==='FORBIDDEN'?{title:'Report unavailable',message:'Your current branch role does not allow school attendance reports.'}:error instanceof AccessError&&error.code==='NOT_FOUND'?{title:'Filter unavailable',message:'One of these filters is not available in the current branch. Remove it and try again.'}:{title:'Report temporarily unavailable',message:'Your filters are unchanged. Check branch access and attendance availability, then retry.'};

export default async function AttendanceReportPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const identity=await getIdentity(),params=await searchParams;let report:AttendanceReport|undefined,home,workspace,error:unknown;
 try{
  home=await accountGateway.getHome(identity);workspace=await academicsGateway.workspace(identity);
  const today=localDate(new Date(),home.timezone),fromDefault=new Date(`${today}T00:00:00Z`),toDefault=new Date(`${today}T00:00:00Z`);fromDefault.setUTCDate(fromDefault.getUTCDate()-6);toDefault.setUTCDate(toDefault.getUTCDate()+1);
  report=await reportingGateway.overview(identity,{fromDate:first(params.fromDate)??fromDefault.toISOString().slice(0,10),toDate:first(params.toDate)??toDefault.toISOString().slice(0,10),yearId:first(params.yearId),sectionId:first(params.sectionId),subjectId:first(params.subjectId),cursor:first(params.cursor),limit:50});
 }catch(cause){error=cause;}
 if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
 const fallback={fromDate:first(params.fromDate)??'',toDate:first(params.toDate)??'',yearId:first(params.yearId)??'',sectionId:first(params.sectionId)??'',subjectId:first(params.subjectId)??''},filters=report?{fromDate:report.filters.fromDate,toDate:report.filters.toDate,yearId:report.filters.yearId??'',sectionId:report.filters.sectionId??'',subjectId:report.filters.subjectId??''}:fallback,failure=reportError(error);
 const nextQuery=report?.sessions.nextCursor?new URLSearchParams({fromDate:report.filters.fromDate,toDate:report.filters.toDate,...(report.filters.yearId?{yearId:report.filters.yearId}:{}),...(report.filters.sectionId?{sectionId:report.filters.sectionId}:{}),...(report.filters.subjectId?{subjectId:report.filters.subjectId}:{}),cursor:report.sessions.nextCursor}).toString():null;
 return <BrandSurface><main id="main-content" className="container page-space"><PageStack className="attendance-report-page">
  <PageHeader eyebrow={home?`${home.institutionName} · ${home.schoolName}`:undefined} title="Attendance report" description="Review register completion and attendance outcomes for one branch and date range." actions={report?<AttendanceReportExport filters={report.filters}/>:undefined}/>
  {!report&&<Alert tone="danger" title={failure.title}>{failure.message}</Alert>}
  <Card className="report-filter-card"><SectionHeader title="Report filters" description="The end date is exclusive. Select no more than 31 days."/><form action="/admin/reports/attendance" method="get" className="report-filter-toolbar">
   <TextField label="From date" name="fromDate" type="date" required defaultValue={filters.fromDate}/><TextField label="To date (exclusive)" name="toDate" type="date" required defaultValue={filters.toDate}/>
   <SelectField label="Academic year" name="yearId" defaultValue={filters.yearId}><option value="">All years</option>{workspace?.years.map(year=><option key={year.id} value={year.id}>{year.name}</option>)}</SelectField><SelectField label="Section" name="sectionId" defaultValue={filters.sectionId}><option value="">All sections</option>{workspace?.sections.map(section=><option key={section.id} value={section.id}>{section.name}</option>)}</SelectField><SelectField label="Subject" name="subjectId" defaultValue={filters.subjectId}><option value="">All subjects</option>{workspace?.subjects.map(subject=><option key={subject.id} value={subject.id}>{subject.name}</option>)}</SelectField><Button type="submit">Apply filters</Button>
  </form></Card>
  {report&&<><section className="report-summary" aria-labelledby="report-summary-title"><SectionHeader title="Summary" description={`As of ${new Date(report.asOf).toLocaleString([],{timeZone:home?.timezone})}`}/><span id="report-summary-title" className="sr-only">Attendance summary</span><div className="grid-cards report-stat-grid">
   <StatCard label="Sessions submitted / expected" value={`${report.counts.submittedSessions} / ${report.counts.expectedSessions}`} detail="Expected sessions have started."/><StatCard label="Pending sessions" value={String(report.counts.pendingSessions)} detail="Started registers awaiting submission."/><StatCard label="Future sessions" value={String(report.counts.futureSessions)} detail="Scheduled sessions not yet due."/><StatCard label="Cancelled sessions" value={String(report.counts.cancelledSessions)} detail="Retained for history; excluded from totals."/><StatCard label="Student-session absences" value={String(report.counts.absent)} detail="Missing attendance is never counted absent."/><StatCard label="Attendance rate" value={report.rate.value===null?'Unavailable':`${report.rate.value.toFixed(1)}%`} detail={`${report.rate.numerator} present or late ÷ ${report.rate.denominator} present, late or absent. Excused excluded.`}/>
  </div></section><Card className="directory-card report-session-directory"><div className="directory-heading"><SectionHeader title="Sessions in selected range" description={`Present ${report.counts.present} · Late ${report.counts.late} · Absent ${report.counts.absent} · Excused ${report.counts.excused}`}/></div>
   {report.sessions.items.length===0?<EmptyState title="No matching attendance sessions" description="Adjust the date range or filters to review another set of sessions." icon="calendar"/>:<ServerTable caption="Attendance sessions and submitted counts" rows={report.sessions.items} rowKey={session=>session.id} columns={[{key:'date',label:'Date',rowHeader:true,render:session=>session.schoolDate},{key:'class',label:'Section · subject',render:session=><span className="report-class-cell"><strong>{session.sectionName}</strong><small>{session.subjectName}</small></span>},{key:'status',label:'Status',render:session=><Badge tone={statusTone(session.status)}>{session.status}</Badge>},{key:'present',label:'Present',render:session=>session.present},{key:'late',label:'Late',render:session=>session.late},{key:'absent',label:'Absent',render:session=>session.absent},{key:'excused',label:'Excused',render:session=>session.excused},{key:'review',label:'Action',render:session=><ButtonLink href={`/admin/attendance/sessions/${session.id}`} variant="secondary">Review session</ButtonLink>}]}/ >}
   <div className="directory-footer"><p className="small muted">{report.explanation}</p>{nextQuery&&<ButtonLink variant="secondary" href={`?${nextQuery}`}>Next page</ButtonLink>}</div></Card></>}
 </PageStack></main></BrandSurface>;
}
