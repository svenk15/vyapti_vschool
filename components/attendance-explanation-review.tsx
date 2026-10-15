'use client';

import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Alert,Badge,Button,Card,SectionHeader,Stepper} from '@/components/ui/primitives';
import {Checkbox,SelectField,TextArea} from '@/components/ui/forms';
import type {AttendanceExplanationItem} from '@/shared/contracts/attendance-explanations';

type Decision='ACCEPTED'|'DECLINED';

export function AttendanceExplanationReview({item}:{item:AttendanceExplanationItem}){
 const router=useRouter();
 const heading=useRef<HTMLHeadingElement>(null),intent=useRef<string|null>(null);
 const [step,setStep]=useState<1|2>(1),[decision,setDecision]=useState<Decision>('ACCEPTED'),[response,setResponse]=useState(''),[confirmed,setConfirmed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const move=(next:1|2)=>{setStep(next);requestAnimationFrame(()=>heading.current?.focus());};
 const changeDecision=(next:Decision)=>{setDecision(next);setConfirmed(false);intent.current=null;};
 const changeResponse=(next:string)=>{setResponse(next);setConfirmed(false);intent.current=null;};
 const submit=async()=>{
  setBusy(true);setError('');
  const key=intent.current??crypto.randomUUID();intent.current=key;
  try{
   const result=await fetch(`/api/v1/attendance-explanations/${item.id}`,{method:'POST',headers:{'content-type':'application/json','idempotency-key':key},body:JSON.stringify({expectedVersion:item.version,decision,response,key})});
   const data=await result.json();
   if(!result.ok)throw new Error(data.message??'Unable to review this explanation.');
   intent.current=null;router.refresh();
  }catch(cause){
   setError(cause instanceof Error?cause.message:'The result is unknown. Retry with the unchanged decision to check the saved result.');
   requestAnimationFrame(()=>heading.current?.focus());
  }finally{setBusy(false);}
 };
 return <>
  {item.status==='SUBMITTED'&&<Stepper steps={['Parent request','Review disposition','Confirm']} current={step}/>}
  <div className="branch-edit-grid attendance-explanation-review-grid">
   <Card className="branch-edit-card attendance-explanation-review">
    {error&&<Alert tone="danger" title="Decision not saved">{error} Your selected disposition and response have been kept.</Alert>}
    {item.status!=='SUBMITTED'?<><SectionHeader title="Absence explanation" actions={<Badge>{item.status}</Badge>}/><Facts item={item}/></>:step===1?<>
     <div className="section-header"><div><h2 ref={heading} tabIndex={-1}>Review disposition</h2><p className="muted">A separate authorized correction is needed if attendance itself changes.</p></div><Badge tone="warning">{item.status}</Badge></div>
     <Facts item={item}/>
     <SelectField label="Decision" value={decision} onChange={event=>changeDecision(event.target.value as Decision)}><option value="ACCEPTED">Accept explanation</option><option value="DECLINED">Decline explanation</option></SelectField>
     <TextArea label="School response" value={response} maxLength={1000} hint="5–1000 characters. This does not change the attendance mark." onChange={event=>changeResponse(event.target.value)}/>
     <div className="workflow-actions"><Button variant="secondary" onClick={()=>router.push('/admin/attendance/explanations')}>Back</Button><Button disabled={response.trim().length<5} onClick={()=>move(2)}>Continue <span aria-hidden="true">→</span></Button></div>
    </>:<>
     <div className="section-header"><div><h2 ref={heading} tabIndex={-1}>Confirm disposition</h2><p className="muted">Check the response before recording the immutable review outcome.</p></div></div>
     <dl className="branch-review"><div><dt>Student and register</dt><dd>{item.studentName} · {item.schoolDate} · {item.subjectName} · {item.sectionName}</dd></div><div><dt>Decision</dt><dd>{decision==='ACCEPTED'?'Accept explanation':'Decline explanation'}</dd></div><div><dt>School response</dt><dd>{response}</dd></div></dl>
     <Checkbox label="I understand this decision does not correct the attendance register." checked={confirmed} onChange={event=>setConfirmed(event.target.checked)}/>
     <div className="workflow-actions"><Button variant="secondary" disabled={busy} onClick={()=>move(1)}>← Back</Button><Button loading={busy} disabled={!confirmed} onClick={submit}>Save decision</Button></div>
    </>}
   </Card>
   <aside className="branch-edit-aside"><Card className="padded"><h2>What this changes</h2><p>The family receives the permitted disposition. Attendance changes only through the separate correction workflow.</p><div className="section-divider"/><h3>Before you continue</h3><p>Current guardian access and designated reviewer authority are checked again when the decision is saved.</p></Card><Card className="padded"><h3>Something changed?</h3><p>A stale explanation or revoked access is rejected. Return to the queue to reload current state.</p></Card></aside>
  </div>
 </>;
}

function Facts({item}:{item:AttendanceExplanationItem}){
 return <dl className="record-facts"><div><dt>Student</dt><dd>{item.studentName}</dd></div><div><dt>Register</dt><dd>{item.schoolDate} · {item.subjectName} · {item.sectionName}</dd></div><div><dt>Category</dt><dd>{item.category.replaceAll('_',' ')}</dd></div><div><dt>Parent explanation</dt><dd>{item.explanation}</dd></div></dl>;
}
