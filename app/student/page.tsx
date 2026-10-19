import Link from 'next/link';
import {nextStudentClass} from '@/backend/modules/academics/application/student-next-class';
import {LandingAttention,LandingCalendar,LandingQuickAccess,LandingSessions,LandingSummary,type LandingCalendarEntry,type LandingSession} from '@/components/landing-page';
import {StudentPortalFrame} from '@/components/student-portal-frame';
import {Alert,BrandSurface,Card,PageHeader,PageStack,SectionHeader} from '@/components/ui/primitives';
import {eventsGateway} from '@/lib/server/events';
import {getIdentity} from '@/lib/server/auth';
import {learningGateway} from '@/lib/server/learning';
import {studentPageContext} from '@/lib/server/student-page';
import {studentPortalGateway} from '@/lib/server/student-portal';
import type {LearningAssignmentPage} from '@/shared/contracts/learning';
import type {StudentSelfTimetableWeek} from '@/shared/contracts/student-portal';

export const dynamic='force-dynamic';
const civil=(instant:Date,timezone:string)=>{const values=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(instant).filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));return `${values.year}-${values.month}-${values.day}`;};
const monday=(value:string)=>{const day=new Date(`${value}T00:00:00.000Z`),weekday=day.getUTCDay()||7;day.setUTCDate(day.getUTCDate()-(weekday-1));return day.toISOString().slice(0,10);};
const localTime=(value:string,timezone:string)=>new Intl.DateTimeFormat('en-IN',{timeZone:timezone,hour:'numeric',minute:'2-digit'}).format(new Date(value));
const eventDay=(value:string)=>value.slice(0,10);

export default async function StudentHome({searchParams}:{searchParams:Promise<{student?:string|string[]}>}){
 const params=await searchParams,{workspace,selected}=await studentPageContext(Array.isArray(params.student)?undefined:params.student),query=`?student=${encodeURIComponent(selected.studentId)}`,now=new Date(),schoolDate=civil(now,selected.timezone),today=new Intl.DateTimeFormat('en-IN',{timeZone:selected.timezone,weekday:'long',day:'numeric',month:'long'}).format(now),identity=await getIdentity();
 let timetable:StudentSelfTimetableWeek|null=null,timetableUnavailable=false,learning:LearningAssignmentPage|null=null,learningUnavailable=false,calendarRows:Awaited<ReturnType<typeof eventsGateway.listStudent>>=[],calendarUnavailable=false;
 if(selected.purposes.includes('timetable.read_self'))try{timetable=await studentPortalGateway.timetable(identity,selected.studentId,monday(schoolDate));}catch{timetableUnavailable=true;}
 if(selected.purposes.includes('learning.assignment.read_self'))try{learning=await learningGateway.queryStudent(identity,selected.studentId,{q:'',by:'title',sort:'due',order:'asc',status:'actionable',cursor:null,limit:3});}catch{learningUnavailable=true;}
 if(selected.purposes.includes('calendar.event.read_self'))try{calendarRows=await eventsGateway.listStudent(identity,selected.studentId,{from:schoolDate,category:'ALL'});}catch{calendarUnavailable=true;}
 const nextClass=timetable?nextStudentClass(timetable,schoolDate,now):null,dueAssignments=learning?.items??[],todayLessons=(timetable?.lessons.filter(lesson=>lesson.date===schoolDate)??[]).sort((a,b)=>a.startsAt.localeCompare(b.startsAt)||a.occurrenceId.localeCompare(b.occurrenceId));
 const due=(value:string)=>new Intl.DateTimeFormat('en-IN',{timeZone:selected.timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
 const sessions:LandingSession[]=todayLessons.map(lesson=>({id:lesson.occurrenceId,time:localTime(lesson.startsAt,selected.timezone),title:lesson.subjectName,context:lesson.sectionName,teacher:lesson.teacherName,status:'Upcoming',tone:'info',href:`/student/timetable${query}`,actionLabel:'View timetable'}));
 const events:LandingCalendarEntry[]=calendarRows.map(row=>({id:row.id,title:row.title,startsOn:row.schedule.kind==='ALL_DAY'?row.schedule.startsOn:eventDay(row.schedule.startsAt),endsOn:row.schedule.kind==='ALL_DAY'?row.schedule.endsOn:eventDay(row.schedule.endsAt),timeLabel:row.schedule.kind==='ALL_DAY'?'All day':localTime(row.schedule.startsAt,selected.timezone),typeLabel:row.category==='HOLIDAY'?'Holiday':row.category==='CLASS_EVENT'?'Class event':row.category==='MEETING'?'Meeting':'School event',closure:row.category==='HOLIDAY'||row.status==='CANCELED',href:`/student/calendar/${row.id}${query}`}));
 const quick=[...(selected.purposes.includes('learning.assignment.read_self')?[{label:'Assignments',href:`/student/assignments${query}`,icon:'book' as const}]:[]),...(selected.purposes.includes('timetable.read_self')?[{label:'Timetable',href:`/student/timetable${query}`,icon:'calendar' as const}]:[]),...(selected.purposes.includes('attendance.read_self')?[{label:'Attendance',href:`/student/attendance${query}`,icon:'check' as const}]:[]),...(selected.purposes.includes('results.read_self')?[{label:'Published results',href:`/student/results${query}`,icon:'report' as const}]:[])];
 return <BrandSurface><StudentPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack className="workspace-dashboard student-dashboard landing-production-page">
  <PageHeader title="My day" description={`${today} · ${selected.schoolName} · ${selected.classLabel}`}/>
  <LandingSummary label="My school-day summary" metrics={[{label:'Published classes today',value:timetable?String(todayLessons.length):'—',detail:timetableUnavailable?'Timetable unavailable':'Effective timetable',icon:'calendar'},{label:'Actionable work',value:learning?`${dueAssignments.length}${learning.nextCursor?'+':''}`:'—',detail:learning?.nextCursor?'First three shown':'Current published assignments',icon:'book'},{label:'Next class',value:nextClass?localTime(nextClass.startsAt,selected.timezone):timetable?'Complete':'—',detail:nextClass?`${nextClass.subjectName} · ${nextClass.teacherName}`:timetable?'No more published classes today':'Timetable unavailable',icon:'clock'}]}/>
  <div className="landing-grid"><div className="landing-column">
   {learningUnavailable&&<Alert tone="warning" title="Assignments are temporarily unavailable">Open Assignments to try again.</Alert>}
   {learning&&<LandingAttention title="Focus on next" items={dueAssignments.map(row=>({id:row.id,title:row.title,description:`${row.offering.subject} · Due ${due(row.dueAt)}`,href:`/student/assignments/${row.id}${query}${row.workStatus==='FEEDBACK_AVAILABLE'||row.workStatus==='DRAFT'?'&work=1':''}`,actionLabel:row.workStatus==='FEEDBACK_AVAILABLE'?'Read feedback':row.workStatus==='DRAFT'?'Resume draft':'Open assignment',icon:row.workStatus==='FEEDBACK_AVAILABLE'?'mail':'book',tone:row.workStatus==='FEEDBACK_AVAILABLE'?'info':'warning'}))} totalLabel={learning.nextCursor?'First 3':'Current'} emptyTitle="No actionable work" emptyDescription="Published work requiring your action will appear here."/>}
   {!timetableUnavailable&&<LandingSessions title="Today’s classes" sessions={sessions} viewAllHref={selected.purposes.includes('timetable.read_self')?`/student/timetable${query}`:undefined}/>}
  </div><div className="landing-column">
   <LandingCalendar today={schoolDate} entries={events} href={selected.purposes.includes('calendar.event.read_self')?`/student/calendar${query}`:undefined} unavailable={!selected.purposes.includes('calendar.event.read_self')||calendarUnavailable}/>
   {quick.length>0&&<LandingQuickAccess links={quick}/>}
   <Card className="padded"><SectionHeader title="My class" description={`${selected.classLabel} · ${selected.academicYear}`}/><dl className="record-facts"><div><dt>School</dt><dd>{selected.schoolName}</dd></div><div><dt>Admission number</dt><dd>{selected.admissionNumber}</dd></div></dl><div className="section-divider"><Link href={`/student/account${query}`}>Open account help <span aria-hidden="true">→</span></Link></div></Card>
  </div></div>
 </PageStack></main></StudentPortalFrame></BrandSurface>;
}
