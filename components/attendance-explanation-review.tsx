'use client';

import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Alert,Badge,Button,Card,SectionHeader,Stepper} from '@/components/ui/primitives';
import {Checkbox,SelectField,TextArea} from '@/components/ui/forms';
import type {AttendanceExplanationItem} from '@/shared/contracts/attendance-explanations';

type Action='ACCEPTED'|'DECLINED'|'CLARIFICATION';

export function AttendanceExplanationReview({item,returnTo='/admin/attendance/explanations'}:{item:AttendanceExplanationItem;returnTo?:string}){
 const router=useRouter();
 const heading=useRef<HTMLHeadingElement>(null),intent=useRef<string|null>(null);
 const [step,setStep]=useState<1|2>(1),[action,setAction]=useState<Action>('ACCEPTED'),[response,setResponse]=useState(''),[confirmed,setConfirmed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const move=(next:1|2)=>{setStep(next);requestAnimationFrame(()=>heading.current?.focus());};
 const changeAction=(next:Action)=>{setAction(next);setConfirmed(false);intent.current=null;};
 const changeResponse=(next:string)=>{setResponse(next);setConfirmed(false);intent.current=null;};
 const submit=async()=>{
  setBusy(true);setError('');
  const key=intent.current??crypto.randomUUID();intent.current=key;
  try{
   const clarification=action==='CLARIFICATION';
   const result=await fetch(`/api/v1/attendance-explanations/${item.id}${clarification?'/clarifications':''}`,{method:'POST',headers:{'content-type':'application/json','idempotency-key':key},body:JSON.stringify(clarification?{expectedVersion:item.version,question:response,key}:{expectedVersion:item.version,decision:action,response,key})});
   const data=await result.json();
   if(!result.ok)throw new Error(data.message??'Unable to save this review.');
   intent.current=null;router.refresh();
  }catch(cause){setError(cause instanceof Error?cause.message:'The result is unknown. Retry with the unchanged details to check the saved result.');requestAnimationFrame(()=>heading.current?.focus());}finally{setBusy(false);}
 };
 const open=item.clarification?.status==='OPEN',answered=item.clarification?.status==='ANSWERED';
 return <>
  {item.status==='SUBMITTED'&&!open&&<Stepper steps={['Family evidence','Review action','Confirm']} current={step}/>}
  <div className="branch-edit-grid attendance-explanation-review-grid">
   <Card className="branch-edit-card attendance-explanation-review">
    {error&&<Alert tone="danger" title="Review action not saved">{error} Your selected action and message have been kept.</Alert>}
    {item.status!=='SUBMITTED'?<><SectionHeader title="Absence explanation" actions={<Badge>{item.status}</Badge>}/><Facts item={item}/></>:open?<>
     <SectionHeader title="Waiting for family clarification" actions={<Badge tone="warning">CLARIFICATION OPEN</Badge>}/><Facts item={item}/><Alert tone="info" title="Disposition paused">Only the original, currently authorized submitter can answer this question. Accept and decline remain unavailable until the answer is recorded.</Alert><div className="workflow-actions"><Button variant="secondary" onClick={()=>router.push(returnTo)}>Back to queue</Button></div>
    </>:step===1?<>
     <div className="section-header"><div><h2 ref={heading} tabIndex={-1}>Review the family evidence</h2><p className="muted">Choose a disposition or request one source-bound clarification.</p></div><Badge tone={answered?'success':'warning'}>{answered?'CLARIFICATION ANSWERED':item.status}</Badge></div>
     <Facts item={item}/><SelectField label="Review action" value={action} onChange={event=>changeAction(event.target.value as Action)}><option value="ACCEPTED">Accept explanation</option><option value="DECLINED">Decline explanation</option><option value="CLARIFICATION">Request clarification</option></SelectField><TextArea label={action==='CLARIFICATION'?'Question for the original submitter':'School response'} value={response} maxLength={1000} hint={action==='CLARIFICATION'?'5–1000 characters. Another guardian will not receive this question.':'5–1000 characters. This does not change the attendance mark.'} onChange={event=>changeResponse(event.target.value)}/><div className="workflow-actions"><Button variant="secondary" onClick={()=>router.push(returnTo)}>Back</Button><Button disabled={response.trim().length<5} onClick={()=>move(2)}>Continue <span aria-hidden="true">→</span></Button></div>
    </>:<>
     <div className="section-header"><div><h2 ref={heading} tabIndex={-1}>Confirm review action</h2><p className="muted">The current evidence version and your exact action are checked again when saved.</p></div></div><dl className="branch-review"><div><dt>Student and register</dt><dd>{item.studentName} · {item.schoolDate} · {item.subjectName} · {item.sectionName}</dd></div><div><dt>Action</dt><dd>{action==='CLARIFICATION'?'Request clarification':action==='ACCEPTED'?'Accept explanation':'Decline explanation'}</dd></div><div><dt>{action==='CLARIFICATION'?'Question':'School response'}</dt><dd>{response}</dd></div></dl><Checkbox label={action==='CLARIFICATION'?'I understand only the original currently authorized submitter can answer.':'I understand this decision does not correct the attendance register.'} checked={confirmed} onChange={event=>setConfirmed(event.target.checked)}/><div className="workflow-actions"><Button variant="secondary" disabled={busy} onClick={()=>move(1)}>← Back</Button><Button loading={busy} disabled={!confirmed} onClick={submit}>{action==='CLARIFICATION'?'Send clarification':'Save decision'}</Button></div>
    </>}
   </Card>
   <aside className="branch-edit-aside"><Card className="padded"><h2>What this changes</h2><p>A clarification adds evidence to this review. A disposition records the explanation outcome. Neither action changes the Attendance mark.</p><div className="section-divider"/><h3>Current authority</h3><p>Your assigned reviewer grant and the original submitter&apos;s access are checked again for every protected read and write.</p></Card><Card className="padded"><h3>Something changed?</h3><p>A stale evidence version or revoked access is rejected. Reload the case before confirming a new action.</p></Card></aside>
  </div>
 </>;
}

function Facts({item}:{item:AttendanceExplanationItem}){return <dl className="record-facts"><div><dt>Student</dt><dd>{item.studentName}</dd></div><div><dt>Register</dt><dd>{item.schoolDate} · {item.subjectName} · {item.sectionName}</dd></div><div><dt>Category</dt><dd>{item.category.replaceAll('_',' ')}</dd></div><div><dt>Parent explanation</dt><dd>{item.explanation}</dd></div>{item.clarification&&<><div><dt>Clarification question</dt><dd>{item.clarification.question}</dd></div>{item.clarification.answer&&<div><dt>Original submitter&apos;s answer</dt><dd>{item.clarification.answer}</dd></div>}</>}</dl>;}
