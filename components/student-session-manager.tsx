'use client';
import {useRef,useState} from 'react';
import {signOut} from 'next-auth/react';
import type {AccountSessionDirectory} from '@/shared/contracts/access';
import {Alert,Badge,Button} from './ui/primitives';

function dateTime(value:string){return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}
function label(value:'DESKTOP_WEB'|'MOBILE_WEB'){return value==='MOBILE_WEB'?'Mobile web browser':'Desktop web browser';}

export function StudentSessionManager({initial,returnHref}: {initial:AccountSessionDirectory;returnHref:string}){
 const [sessions,setSessions]=useState(initial.sessions),[selectedId,setSelectedId]=useState(''),[stage,setStage]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 const heading=useRef<HTMLHeadingElement>(null),status=useRef<HTMLDivElement>(null),selected=sessions.find(item=>item.id===selectedId);
 function move(value:number){setStage(value);setError('');requestAnimationFrame(()=>heading.current?.focus());}
 async function complete(){if(!selected)return;setBusy(true);setError('');if(selected.current){try{await signOut({callbackUrl:'/sign-in'});return;}catch{setError('The current session could not be ended. It remains active; try again.');setBusy(false);requestAnimationFrame(()=>status.current?.focus());return;}}try{const response=await fetch(`/api/v1/me/sessions/${selected.id}`,{method:'DELETE'}),body=await response.json();if(!response.ok)throw new Error(body.message??'Unable to end this session.');setSessions(current=>current.filter(item=>item.id!==selected.id));setMessage(body.replayed?'That session was already ended.':'The selected session is now signed out.');setStage(2);requestAnimationFrame(()=>status.current?.focus());}catch(reason){setError(reason instanceof Error?reason.message:'Unable to end this session. Try again.');requestAnimationFrame(()=>status.current?.focus());}finally{setBusy(false);}}
 return <div className="student-session-manager">
  {stage<2&&<div className="student-session-step"><b>{stage+1}</b><span>Step {stage+1} of 2</span></div>}
  <div ref={status} tabIndex={-1}>{error&&<Alert tone="danger" title="Session remains active">{error}</Alert>}{stage===2&&<Alert tone="success" title="Session ended">{message}</Alert>}</div>
  {stage===0&&<><h3 ref={heading} tabIndex={-1}>Review sessions</h3><p className="muted">Choose the browser session you want to end.</p><div className="student-session-list" aria-label="Your signed-in sessions">
   {sessions.map(session=><label className="student-session-row" key={session.id}>
    <input type="radio" name="account-session" value={session.id} checked={selectedId===session.id} onChange={()=>setSelectedId(session.id)}/><div className="student-session-icon" aria-hidden="true">{session.label==='MOBILE_WEB'?'▯':'▭'}</div>
    <span className="student-session-copy"><span><strong>{label(session.label)}</strong>{session.current&&<Badge tone="success">Current</Badge>}</span><span>Started <time dateTime={session.startedAt}>{dateTime(session.startedAt)}</time></span><span>Expires <time dateTime={session.expiresAt}>{dateTime(session.expiresAt)}</time></span></span>
   </label>)}
  </div><div className="student-session-actions"><Button variant="secondary" onClick={()=>location.assign(returnHref)}>Back</Button><Button disabled={!selected} onClick={()=>move(1)}>Continue <span aria-hidden="true">→</span></Button></div></>}
  {stage===1&&selected&&<><h3 ref={heading} tabIndex={-1}>Revoke or sign out</h3><p className="muted">Confirm the exact session. Access ends only when you use the final action.</p><dl className="record-facts student-session-review"><div><dt>Browser</dt><dd>{label(selected.label)}</dd></div><div><dt>Session</dt><dd>{selected.current?'Current signed-in browser':'Another signed-in browser'}</dd></div><div><dt>Started</dt><dd>{dateTime(selected.startedAt)}</dd></div><div><dt>Expires</dt><dd>{dateTime(selected.expiresAt)}</dd></div></dl><div className="student-session-actions"><Button variant="secondary" disabled={busy} onClick={()=>move(0)}>Back</Button><Button loading={busy} onClick={complete}>Sign out selected session</Button></div></>}
  {stage===2&&<><h3 ref={heading} tabIndex={-1}>Session access ended</h3><p className="muted">Server revocation is active. Reloading that browser cannot restore school data.</p><div className="student-session-actions"><Button onClick={()=>{setSelectedId('');setMessage('');move(0);}}>Review remaining sessions</Button></div></>}
  <p className="small muted">Only privacy-safe browser categories and times are shown. Password recovery still signs out every session.</p>
 </div>;
}
