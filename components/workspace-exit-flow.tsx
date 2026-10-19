'use client';

import {useRef,useState} from 'react';
import {signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import type {AdminHome} from '@/shared/contracts/access';
import type {ContextDirectory} from '@/shared/contracts/tenancy';
import {Checkbox,SelectField} from '@/components/ui/forms';
import {Alert,Button,Card,Stepper} from '@/components/ui/primitives';

type Destination={id:string;organizationId:string;label:string};

export function WorkspaceExitFlow({home,directory,initialDestination,returnHref='/admin'}:{home:AdminHome;directory:ContextDirectory;initialDestination:string;returnHref?:string}){
 const router=useRouter();
 const destinations:Destination[]=directory.institutions.flatMap(institution=>institution.branches.filter(branch=>branch.selectable&&branch.id!==home.scope.schoolId).map(branch=>({id:branch.id,organizationId:institution.id,label:`${institution.name} · ${branch.name}`})));
 const allowed=initialDestination==='sign-out'||destinations.some(item=>item.id===initialDestination)?initialDestination:'';
 const [destination,setDestination]=useState(allowed),[reviewed,setReviewed]=useState(false),[stage,setStage]=useState<0|1|2>(0),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const heading=useRef<HTMLHeadingElement>(null),selected=destinations.find(item=>item.id===destination);
 function move(next:0|1|2){setStage(next);setError('');requestAnimationFrame(()=>heading.current?.focus());}
 async function confirm(){setBusy(true);setError('');try{
  if(destination==='sign-out'){await signOut({callbackUrl:'/sign-in'});return;}
  if(!selected)throw new Error('missing');
  const response=await fetch('/api/v1/context/switch',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({institutionId:selected.organizationId,branchId:selected.id}),cache:'no-store'});
  if(!response.ok)throw new Error('unavailable');
  sessionStorage.setItem('vschool-context-switching','1');
  if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel('vschool-context');channel.postMessage('context-changed');channel.close();}
  window.location.replace(new URL(returnHref,window.location.origin));
 }catch{setBusy(false);setError('That destination is no longer available. Your current branch remains active. Refresh and choose an authorized destination.');requestAnimationFrame(()=>heading.current?.focus());}}
 const label=destination==='sign-out'?'Sign out':selected?.label??'';
 return <div className="context-workflow-layout">
  <div className="context-workflow-main">
   <Stepper steps={['Destination','Leave this workspace','Confirm']} current={stage}/>
   <Card className="context-workflow-card">
    {stage===0&&<section className="workspace-choice-stage"><div className="section-header"><div><h2 ref={heading} tabIndex={-1}>Destination</h2><p className="muted">Your current branch remains active until you confirm.</p></div></div><SelectField label="Destination" required value={destination} onChange={event=>setDestination(event.target.value)}><option value="">Choose destination</option>{destinations.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}<option value="sign-out">Sign out</option></SelectField><div className="workspace-choice-actions"><Button variant="secondary" onClick={()=>router.push(returnHref)}>Cancel</Button><Button disabled={!destination} onClick={()=>move(1)}>Continue <span aria-hidden="true">→</span></Button></div></section>}
    {stage===1&&<section className="workspace-choice-stage"><div className="section-header"><div><h2 ref={heading} tabIndex={-1}>Leave this workspace</h2><p className="muted">Unsaved changes must be saved or explicitly discarded before continuing.</p></div></div><Checkbox label="I have reviewed any unsaved work." checked={reviewed} onChange={event=>setReviewed(event.target.checked)}/><div className="workspace-choice-actions"><Button variant="secondary" onClick={()=>move(0)}>← Back</Button><Button disabled={!reviewed} onClick={()=>move(2)}>Continue <span aria-hidden="true">→</span></Button></div></section>}
    {stage===2&&<section className="workspace-choice-stage"><div className="section-header"><div><h2 ref={heading} tabIndex={-1}>Confirm</h2><p className="muted">Review the destination before leaving this workspace.</p></div></div><dl className="workspace-choice-review"><div><dt>Current branch</dt><dd>{home.institutionName} · {home.schoolName}</dd></div><div><dt>Destination</dt><dd>{label}</dd></div><div><dt>Unsaved work reviewed</dt><dd>Confirmed</dd></div></dl>{error&&<Alert tone="danger" title="Destination unavailable">{error}</Alert>}<div className="workspace-choice-actions"><Button variant="secondary" disabled={busy} onClick={()=>move(1)}>← Back</Button><Button loading={busy} onClick={()=>void confirm()}>{busy?'Confirming…':'Confirm'} <span aria-hidden="true">✓</span></Button></div></section>}
   </Card>
  </div>
  <aside className="context-workflow-notes" aria-label="Context change guidance"><Card className="padded"><h2>What this changes</h2><p>New context is resolved on the server, or the session is signed out.</p><hr/><h3>Before you continue</h3><p>Clear scoped caches and protected drafts; reauthorize the destination and never reuse the previous branch’s data.</p></Card><Card className="padded"><h3>Something changed?</h3><p>If the target grant was revoked, keep the old context if still authorized and show a safe explanation.</p></Card></aside>
 </div>;
}
