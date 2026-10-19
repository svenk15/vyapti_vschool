'use client';

import {useMemo,useState} from 'react';
import type {AttendanceSessionRecord} from '@/shared/contracts/attendance';
import type {AdminHome} from '@/shared/contracts/access';
import {LandingAttention,LandingCalendar,LandingIcon,LandingQuickAccess,LandingSessions,LandingSummary,type LandingSession} from './landing-page';
import {Alert,Button,Card,PageHeader,PageStack,SectionHeader} from './ui/primitives';

const statusLabel:Record<AttendanceSessionRecord['status'],string>={SCHEDULED:'Scheduled',OPEN:'Not submitted',SUBMITTED:'Submitted',CANCELLED:'Canceled'};
const statusTone:Record<AttendanceSessionRecord['status'],LandingSession['tone']>={SCHEDULED:'info',OPEN:'warning',SUBMITTED:'success',CANCELLED:'neutral'};

export function TeacherSessions({initial,date,home,canUseClasses,canUseHistory}:{initial:readonly AttendanceSessionRecord[];date:string;home:AdminHome;canUseClasses:boolean;canUseHistory:boolean}){
 const [sessions,setSessions]=useState(initial),[day,setDay]=useState(date),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function refresh(next=day){setBusy(true);setError('');try{const response=await fetch(`/api/v1/teacher/sessions?date=${encodeURIComponent(next)}`,{cache:'no-store'}),body=await response.json();if(!response.ok)throw new Error(body.message??'Your schedule is temporarily unavailable.');setSessions(body);setDay(next);}catch(e){setError(e instanceof Error?e.message:'Your schedule is temporarily unavailable.');}finally{setBusy(false);}}
 const formattedDay=new Intl.DateTimeFormat(undefined,{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(`${day}T12:00:00Z`));
 const submitted=sessions.filter(session=>session.status==='SUBMITTED').length,open=sessions.filter(session=>session.status==='OPEN');
 const nextSession=useMemo(()=>sessions.find(session=>session.status==='OPEN'||session.status==='SCHEDULED')??sessions[0],[sessions]);
 const rows:LandingSession[]=sessions.map(session=>({id:session.id,time:new Date(session.startsAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:home.timezone}),subject:session.offering.subjectName,section:session.offering.sectionName,status:statusLabel[session.status],tone:statusTone[session.status],href:`/teacher/sessions/${session.id}`,actionLabel:session.status==='SUBMITTED'?'View register':session.status==='OPEN'?'Continue register':session.status==='CANCELLED'?'View session':'Open register'}));
 return <PageStack className="teacher-day landing-production-page">
  <PageHeader title="My teaching day" description={`${formattedDay} · ${home.schoolName}`} actions={<form className="teacher-day-date" onSubmit={event=>{event.preventDefault();void refresh();}}><label htmlFor="teacher-day-date">Teaching date</label><input id="teacher-day-date" type="date" max={date} value={day} onChange={event=>void refresh(event.target.value)}/><Button variant="secondary" loading={busy} aria-label="Refresh teaching day"><span className="sr-only">Refresh</span><LandingIcon name="refresh"/></Button></form>}/>
  {error&&<Alert tone="danger" title="Schedule unavailable">{error}</Alert>}
  {!error&&<>
   <LandingSummary label="Teaching day summary" metrics={[{label:'Assigned sessions',value:String(sessions.length),detail:'Your assignments only',icon:'calendar'},{label:'Submitted registers',value:`${submitted} / ${sessions.length}`,detail:'Acknowledged submissions',icon:'check'},{label:'Open registers',value:String(open.length),detail:'Started and awaiting submission',icon:'clock'}]}/>
   <div className="landing-grid"><div className="landing-column">
    <LandingAttention title="Registers to finish" items={open.slice(0,3).map(session=>({id:session.id,title:session.offering.subjectName,description:`${session.offering.sectionName} · Register started`,href:`/teacher/sessions/${session.id}`,actionLabel:'Continue register',icon:'clock',tone:'warning'}))} totalLabel={open.length?`${open.length} open`:'None started'} totalTone={open.length?'warning':'neutral'} emptyTitle="No started registers awaiting submission" emptyDescription="This does not include scheduled classes that have not been opened."/>
    <LandingSessions title="Today’s classes" sessions={rows} viewAllHref="/teacher/history"/>
   </div><div className="landing-column">
    <LandingCalendar today={day} entries={[]} loadedRange={{from:day,to:day,complete:false}} scopeKey={`${home.scope.organizationId}:${home.scope.schoolId}`} state="unsupported"/>
    <LandingQuickAccess links={[...(canUseClasses?[{label:'My classes',href:'/teacher/classes',icon:'students' as const}]:[]),...(canUseHistory?[{label:'Attendance history',href:'/teacher/history',icon:'report' as const}]:[]),{label:'My account',href:'/account',icon:'settings'}]}/>
    <Card className="padded"><SectionHeader title="Before your next class" description={nextSession?`${nextSession.offering.subjectName} · ${nextSession.offering.sectionName}`:'All assigned registers are submitted.'}/>{nextSession&&<p className="muted">Check the class and roster, mark every pupil, then review the totals before submitting.</p>}<div className="section-divider"><strong>Need a correction?</strong><p className="muted">Submitted registers stay read-only. The school administrator reviews and records corrections.</p></div></Card>
   </div></div>
  </>}
 </PageStack>;
}
