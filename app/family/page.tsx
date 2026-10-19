import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {LandingAttention,LandingCalendar,LandingQuickAccess,LandingSessions,LandingSummary,type LandingCalendarEntry,type LandingSession} from '@/components/landing-page';
import {calendarEntryRange,calendarWeek} from '@/components/landing-calendar-model';
import {Alert,BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {communicationGateway} from '@/lib/server/communication';
import {eventsGateway} from '@/lib/server/events';
import {familyPageContext} from '@/lib/server/family-page';
import {guardiansGateway} from '@/lib/server/guardians';
import {learningGateway} from '@/lib/server/learning';
import type {GuardianAttendanceHistory,GuardianTimetableWeek} from '@/shared/contracts/guardians';
import type {LearningAssignmentSummary} from '@/shared/contracts/learning';

export const dynamic='force-dynamic';
const localDate=(timezone:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const monday=(value:string)=>{const day=new Date(`${value}T00:00:00.000Z`),weekday=day.getUTCDay()||7;day.setUTCDate(day.getUTCDate()-(weekday-1));return day.toISOString().slice(0,10);};
const localTime=(value:string,timezone:string)=>new Intl.DateTimeFormat('en-IN',{timeZone:timezone,hour:'numeric',minute:'2-digit'}).format(new Date(value));

export default async function FamilyHome({searchParams}:{searchParams:Promise<{child?:string|string[]}>}){
 const params=await searchParams,{identity,workspace,selected}=await familyPageContext(Array.isArray(params.child)?undefined:params.child),suffix=`?child=${encodeURIComponent(selected.studentId)}`,firstName=selected.displayName.split(/\s+/)[0],schoolDate=localDate(selected.timezone),today=new Intl.DateTimeFormat('en-IN',{timeZone:selected.timezone,weekday:'long',day:'numeric',month:'long'}).format(new Date());
 let attendance:GuardianAttendanceHistory|null=null,timetable:GuardianTimetableWeek|null=null,assignments:readonly LearningAssignmentSummary[]|null=null,notices:Awaited<ReturnType<typeof communicationGateway.listParent>>|null=null,eventsRows:Awaited<ReturnType<typeof eventsGateway.listParent>>=[],attendanceUnavailable=false,timetableUnavailable=false,learningUnavailable=false,noticesUnavailable=false,calendarUnavailable=false;
 if(selected.purposes.includes('attendance.read_child'))try{attendance=await guardiansGateway.attendance(identity,selected.studentId,schoolDate,schoolDate);}catch{attendanceUnavailable=true;}
 if(selected.purposes.includes('timetable.read_child'))try{timetable=await guardiansGateway.timetable(identity,selected.studentId,monday(schoolDate));}catch{timetableUnavailable=true;}
 if(selected.purposes.includes('learning.assignment.read_child'))try{assignments=await learningGateway.listParent(identity,selected.studentId);}catch{learningUnavailable=true;}
 if(selected.purposes.includes('communication.notice.read'))try{notices=await communicationGateway.listParent(identity,selected.studentId);}catch{noticesUnavailable=true;}
 const calendarRange=calendarWeek(schoolDate);
 if(selected.purposes.includes('calendar.event.read_child'))try{eventsRows=await eventsGateway.listParent(identity,selected.studentId,{from:calendarRange.from,category:'ALL'});}catch{calendarUnavailable=true;}
 const todayLessons=(timetable?.lessons.filter(lesson=>lesson.date===schoolDate)??[]).sort((a,b)=>a.startsAt.localeCompare(b.startsAt)||a.occurrenceId.localeCompare(b.occurrenceId));
 const sessions:LandingSession[]=todayLessons.map(lesson=>({id:lesson.occurrenceId,time:localTime(lesson.startsAt,selected.timezone),subject:lesson.subjectName,section:lesson.sectionName,teacher:lesson.teacherName,status:'Upcoming',tone:'info',href:`/family/timetable${suffix}`,actionLabel:'View timetable'}));
 const events:LandingCalendarEntry[]=eventsRows.map(row=>({id:row.id,title:row.title,...calendarEntryRange(row.schedule,selected.timezone),timeLabel:row.schedule.kind==='ALL_DAY'?'All day':localTime(row.schedule.startsAt,selected.timezone),typeLabel:row.category==='HOLIDAY'?'Holiday':row.category==='CLASS_EVENT'?'Class event':row.category==='MEETING'?'Meeting':'School event',closure:row.category==='HOLIDAY',canceled:row.status==='CANCELED',href:`/family/calendar/${row.id}${suffix}`}));
 const attendanceToday=attendance?.items.filter(item=>item.date===schoolDate)??[],attendanceValue=attendanceUnavailable?'—':attendanceToday.length===0?'Not yet submitted':attendanceToday.length===1?attendanceToday[0].status:`${attendanceToday.length} submitted`,attendanceDetail=attendanceUnavailable?'Attendance unavailable':attendanceToday.length===0?`${schoolDate} · no submitted register`:`${schoolDate} · ${attendanceToday.map(item=>item.status.toLowerCase()).join(', ')}`;
 const noticeAttention=notices?.filter(row=>row.status==='PUBLISHED'&&(!row.readAt||row.requiresAcknowledgement&&!row.acknowledgedAt))??[];
 const due=(value:string)=>new Intl.DateTimeFormat('en-IN',{timeZone:selected.timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
 const hasNotices=selected.purposes.includes('communication.notice.read'),quick=[...(selected.purposes.includes('attendance.read_child')?[{label:'Attendance',href:`/family/attendance${suffix}`,icon:'check' as const}]:[]),...(selected.purposes.includes('learning.assignment.read_child')?[{label:'Learning',href:`/family/learning${suffix}`,icon:'book' as const}]:[]),...(selected.purposes.includes('results.read_child')?[{label:'Published results',href:`/family/results${suffix}`,icon:'report' as const}]:[]),...(selected.purposes.includes('timetable.read_child')?[{label:'Timetable',href:`/family/timetable${suffix}`,icon:'calendar' as const}]:[])];
 return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack className="workspace-dashboard family-dashboard landing-production-page">
  <PageHeader title={`A clear view of ${firstName}’s school day`} description={`${today} · ${selected.schoolName} · ${selected.classLabel??'Class unavailable'}`}/>
  <LandingSummary label={`${firstName} school-day summary`} metrics={[{label:'Attendance today',value:attendanceValue,detail:attendanceDetail,icon:'check'},{label:'Published classes today',value:timetable?String(todayLessons.length):'—',detail:timetableUnavailable?'Timetable unavailable':'Effective timetable',icon:'calendar'},{label:'Published assignments',value:assignments?String(assignments.length):'—',detail:learningUnavailable?'Learning unavailable':'Visible to this child context',icon:'book'},...(hasNotices?[{label:'Notices needing attention',value:notices?String(noticeAttention.length):'—',detail:noticesUnavailable?'Notices unavailable':'Unread or awaiting acknowledgement',icon:'mail' as const}]:[])]}/>
  <div className="landing-grid"><div className="landing-column">
   {(attendanceUnavailable||learningUnavailable||timetableUnavailable||noticesUnavailable)&&<Alert tone="warning" title="Some school-day information is temporarily unavailable">Open the relevant area below to try that authorized view again.</Alert>}
   {assignments&&<LandingAttention title="Learning coming up" items={assignments.slice(0,3).map(row=>({id:row.id,title:row.title,description:`${row.offering.subject} · Due ${due(row.dueAt)}`,href:`/family/learning/${row.id}${suffix}`,actionLabel:'View assignment',icon:'book',tone:'info'}))} totalLabel={assignments.length?`${assignments.length} published`:'None published'} totalTone="neutral" emptyTitle="No published assignments" emptyDescription="Published work for this child will appear here."/>}
   {notices&&<LandingAttention title="School notices" items={noticeAttention.slice(0,3).map(row=>({id:row.noticeId,title:row.title,description:row.requiresAcknowledgement&&!row.acknowledgedAt?'Acknowledgement requested':'Unread notice',href:`/family/notices/${row.noticeId}${suffix}`,actionLabel:'Read notice',icon:'mail',tone:row.requiresAcknowledgement&&!row.acknowledgedAt?'warning':'info'}))} totalLabel={noticeAttention.length?`${noticeAttention.length} to review`:'None waiting'} totalTone={noticeAttention.some(row=>row.requiresAcknowledgement&&!row.acknowledgedAt)?'warning':'neutral'} emptyTitle="No notices need your attention" emptyDescription="New unread notices and acknowledgement requests for this child will appear here."/>}
   {timetable&&<LandingSessions title={`${firstName}’s classes today`} sessions={sessions} viewAllHref={`/family/timetable${suffix}`}/>}
  </div><div className="landing-column">
   <LandingCalendar today={schoolDate} entries={events} loadedRange={{...calendarRange,complete:eventsRows.length<100}} scopeKey={`${selected.schoolId}:${selected.studentId}`} href={selected.purposes.includes('calendar.event.read_child')?`/family/calendar${suffix}`:undefined} retryHref={`/family${suffix}`} state={!selected.purposes.includes('calendar.event.read_child')?'unauthorized':calendarUnavailable?'failed':'ready'}/>
   {quick.length>0&&<LandingQuickAccess links={quick}/>}
  </div></div>
 </PageStack></main></FamilyPortalFrame></BrandSurface>;
}
