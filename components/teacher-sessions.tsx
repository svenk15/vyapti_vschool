'use client';
import {useMemo,useState} from 'react';
import type {AttendanceSessionRecord} from '@/shared/contracts/attendance';
import type {AdminHome} from '@/shared/contracts/access';
import {Alert,Badge,Button,Card,EmptyState,PageHeader,PageStack} from './ui/primitives';

function TeacherIcon({name}:{name:'calendar'|'check'|'clock'|'arrow'|'eye'|'book'|'refresh'}){
 const paths={calendar:<><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></>,check:<path d="m5 12 4 4L19 6"/>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,arrow:<path d="M5 12h14m-5-5 5 5-5 5"/>,eye:<><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></>,book:<><path d="M4 5.5A3.5 3.5 0 0 1 7.5 3H12v16H7.5A3.5 3.5 0 0 0 4 21.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 3H12v16h4.5a3.5 3.5 0 0 1 3.5 2.5Z"/></>,refresh:<><path d="M20 11a8 8 0 1 0 2 5.3"/><path d="M20 4v7h-7"/></>};
 return <svg className="teacher-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

const statusLabel:Record<AttendanceSessionRecord['status'],string>={SCHEDULED:'Scheduled',OPEN:'Not submitted',SUBMITTED:'Submitted',CANCELLED:'Canceled'};
export function TeacherSessions({initial,date,home}:{initial:readonly AttendanceSessionRecord[];date:string;home:AdminHome}){
 const [sessions,setSessions]=useState(initial),[day,setDay]=useState(date),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function refresh(next=day){setBusy(true);setError('');try{const response=await fetch(`/api/v1/teacher/sessions?date=${encodeURIComponent(next)}`,{cache:'no-store'}),body=await response.json();if(!response.ok)throw new Error(body.message??'Your schedule is temporarily unavailable.');setSessions(body);setDay(next);}catch(e){setError(e instanceof Error?e.message:'Your schedule is temporarily unavailable.');}finally{setBusy(false);}}
 const formattedDay=new Intl.DateTimeFormat(undefined,{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(`${day}T12:00:00Z`));
 const submitted=sessions.filter(session=>session.status==='SUBMITTED').length;
 const nextSession=useMemo(()=>sessions.find(session=>session.status!=='SUBMITTED')??sessions[0],[sessions]);
 const action=(session:AttendanceSessionRecord)=>session.status==='SUBMITTED'?{label:'View register',icon:'eye' as const}:{label:session.status==='OPEN'?'Continue register':'Open register',icon:'arrow' as const};
 return <PageStack className="teacher-day">
  <PageHeader title="My teaching day" description="Your assigned classes, with a clear next action." actions={<form className="teacher-day-date" onSubmit={event=>{event.preventDefault();void refresh();}}><label htmlFor="teacher-day-date">Teaching date</label><input id="teacher-day-date" type="date" max={date} value={day} onChange={event=>void refresh(event.target.value)}/><Button variant="secondary" loading={busy} aria-label="Refresh teaching day"><span className="sr-only">Refresh</span><TeacherIcon name="refresh"/></Button></form>}/>
  {error&&<Alert tone="danger" title="Schedule unavailable">{error}</Alert>}
  {sessions.length?<>
   <section className="teacher-day-stats" aria-label="Teaching day summary">
    <Card className="teacher-day-stat"><div><span>Sessions today</span><strong>{sessions.length}</strong><small>Your assignments only</small></div><TeacherIcon name="calendar"/></Card>
    <Card className="teacher-day-stat"><div><span>Submitted registers</span><strong>{submitted} / {sessions.length}</strong><small>Acknowledged submissions</small></div><TeacherIcon name="check"/></Card>
    <Card className="teacher-day-stat"><div><span>Still to submit</span><strong>{sessions.length-submitted}</strong><small>Includes upcoming sessions</small></div><TeacherIcon name="clock"/></Card>
   </section>
   <div className="teacher-day-grid">
    <section className="teacher-day-sessions" aria-labelledby="teacher-day-list-title"><div className="teacher-day-list-heading"><h2 id="teacher-day-list-title">{formattedDay}</h2><span>School-local date · {home.timezone}</span></div><div className="teacher-session-list">{sessions.map(session=>{const item=action(session),featured=session.id===nextSession?.id&&session.status!=='SUBMITTED';return <article key={session.id} className={`teacher-session-card${featured?' teacher-session-featured':''}`}><div className="teacher-session-time"><strong>{new Date(session.startsAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:home.timezone})}</strong><span>{new Date(session.endsAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:home.timezone})}</span></div><div className="teacher-session-summary"><h3>{session.offering.subjectName}</h3><p>{session.offering.sectionName} · {home.schoolName}</p><div className="teacher-session-status"><Badge tone={session.status==='SUBMITTED'?'success':session.status==='OPEN'?'warning':'info'}>{statusLabel[session.status]}</Badge>{featured&&<span>Ready for your class</span>}</div></div><a className={`btn ${featured?'btn-primary':'btn-secondary'}`} aria-label={`${item.label}: ${session.offering.subjectName}, ${session.offering.sectionName}`} href={`/teacher/sessions/${session.id}`}><TeacherIcon name={item.icon}/>{item.label}</a></article>;})}</div></section>
    <aside className="teacher-day-aside"><Card className="teacher-guidance-card"><div className="teacher-card-title"><h2>Before your next class</h2><TeacherIcon name="book"/></div>{nextSession?<><h3>{nextSession.offering.subjectName} · {nextSession.offering.sectionName}</h3><p>Check the class and roster, mark every pupil, then review the totals before submitting.</p><ul><li><TeacherIcon name="check"/>Your teaching assignment is active</li><li><TeacherIcon name="clock"/>Drafts are not submitted records</li></ul><a className="btn btn-secondary" href={`/teacher/sessions/${nextSession.id}`}><TeacherIcon name="arrow"/>{action(nextSession).label}</a></>:<p>All assigned registers are submitted.</p>}</Card><Card className="teacher-guidance-card"><h2>Need a correction?</h2><p>Submitted registers stay read-only. The school administrator reviews and records corrections.</p></Card></aside>
   </div>
  </>:!error?<Card className="teacher-day-empty"><EmptyState title={`No sessions on ${formattedDay}`} description="Choose another date or contact the school administrator if an assigned session is missing." icon="calendar"/></Card>:null}
 </PageStack>;
}
