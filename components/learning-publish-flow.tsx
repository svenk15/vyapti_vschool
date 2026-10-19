'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useRef,useState} from 'react';
import type {LearningAssignmentSummary,LearningCommandResult,LearningOffering} from '@/shared/contracts/learning';
import {Alert,Button,Card,PageHeader,SectionHeader,Stepper} from './ui/primitives';
import {SelectField,TextArea,TextField} from './ui/forms';

const fresh=()=>crypto.randomUUID();
const localParts=(instant:Date,timezone:string)=>Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(instant).filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
const instantToLocal=(value:string,timezone:string)=>{const p=localParts(new Date(value),timezone);return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;};
const localToInstant=(value:string,timezone:string)=>{const target=Date.parse(`${value}:00.000Z`);let candidate=target;for(let i=0;i<4;i++){const p=localParts(new Date(candidate),timezone),shown=Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day),Number(p.hour),Number(p.minute)),correction=target-shown;if(!correction)break;candidate+=correction;}return new Date(candidate).toISOString();};
async function command(response:Response){const body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.message??'The assignment could not be saved.');return body as LearningCommandResult;}

export function LearningPublishFlow({offerings,timezone,initial}:{offerings:readonly LearningOffering[];timezone:string;initial?:LearningAssignmentSummary}){
 const router=useRouter();
 const [stage,setStage]=useState(0),[saved,setSaved]=useState(initial),[offeringId,setOfferingId]=useState(initial?.offering.id??offerings[0]?.id??''),[title,setTitle]=useState(initial?.title??''),[instructions,setInstructions]=useState(initial?.instructions??''),[dueAt,setDueAt]=useState(initial?instantToLocal(initial.dueAt,timezone):''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');
 const key=useRef<string|null>(null),heading=useRef<HTMLHeadingElement>(null),selected=offerings.find(row=>row.id===offeringId),taskValid=!!selected&&title.trim().length>0&&instructions.trim().length>0,submissionValid=taskValid&&dueAt.length>0;
 const move=(next:number)=>{setStage(next);setError('');requestAnimationFrame(()=>heading.current?.focus());};

 async function save(nextStage?:number){
  setBusy(true);setError('');key.current??=fresh();
  try{
   const body={...(saved?{expectedRevision:saved.revision}:{}),fields:{offeringId,title,instructions,dueAt:localToInstant(dueAt,timezone)},key:key.current},response=await fetch(saved?`/api/v1/learning/assignments/${saved.id}`:'/api/v1/learning/assignments',{method:saved?'PATCH':'POST',headers:{'content-type':'application/json','idempotency-key':key.current},body:JSON.stringify(body)}),result=await command(response);
   setSaved({id:result.assignmentId,status:result.status,revision:result.revision,version:result.version,title,instructions,dueAt:localToInstant(dueAt,timezone),offering:selected!,recipientCount:result.recipientCount,publishedAt:null});
   key.current=null;setMessage('Draft saved. You can reload and continue it.');if(nextStage!==undefined)move(nextStage);router.refresh();
  }catch(cause){setError(cause instanceof Error?cause.message:'The assignment could not be saved.');}finally{setBusy(false);}
 }

 async function publish(){
  if(!saved)return;setBusy(true);setError('');const intent=fresh();
  try{const result=await command(await fetch(`/api/v1/learning/assignments/${saved.id}/publish`,{method:'POST',headers:{'content-type':'application/json','idempotency-key':intent},body:JSON.stringify({expectedRevision:saved.revision,key:intent})}));setMessage(`Assignment published to ${result.recipientCount} Student${result.recipientCount===1?'':'s'}.`);router.push('/teacher/learning');router.refresh();}catch(cause){setError(cause instanceof Error?cause.message:'The assignment could not be published.');}finally{setBusy(false);}
 }

 const stageTitle=['Task details','Submission rules','Review assignment','Confirm publication'][stage];
 return <div className="notice-compose-page">
  <PageHeader title={saved?'Continue assignment draft':'Create assignment'} description={`Current assigned class · Due times use ${timezone}`}/>
  <Stepper steps={['Task','Submission','Publication review','Confirm']} current={stage}/>
  <div className="branch-edit-grid"><Card className="padded branch-edit-card">
   <h2 ref={heading} tabIndex={-1}>{stageTitle}</h2>
   {error&&<Alert tone="danger" title="Assignment not saved" onDismiss={()=>setError('')}>{error}</Alert>}
   {message&&<Alert tone="success" title="Learning updated" onDismiss={()=>setMessage('')}>{message}</Alert>}
   {stage===0&&<div className="settings-form">
    <SelectField label="Assigned class" value={offeringId} disabled={!!saved} onChange={event=>{setOfferingId(event.target.value);key.current=null;}}>{offerings.map(row=><option key={row.id} value={row.id}>{row.subject} · {row.classLabel}</option>)}</SelectField>
    <TextField label="Assignment title" required maxLength={120} value={title} onChange={event=>{setTitle(event.target.value);key.current=null;}}/>
    <TextArea label="Instructions" required maxLength={2000} hint="Add the task instructions. Do not include private Student information." value={instructions} onChange={event=>{setInstructions(event.target.value);key.current=null;}}/>
    <div className="workflow-actions"><Link className="btn btn-secondary btn-normal" href="/teacher/learning">Cancel</Link><Button disabled={!taskValid} onClick={()=>move(1)}>Continue <span aria-hidden="true">→</span></Button></div>
   </div>}
   {stage===1&&<div className="settings-form">
    <TextField label={`Due (${timezone})`} type="datetime-local" required value={dueAt} onChange={event=>{setDueAt(event.target.value);key.current=null;}}/>
    <dl className="record-facts"><div><dt>Submission type</dt><dd>Written response</dd></div><div><dt>Late work</dt><dd>Not accepted</dd></div><div><dt>After submission</dt><dd>Read-only receipt</dd></div></dl>
    <div className="workflow-actions"><Button variant="secondary" onClick={()=>move(0)}>Back</Button><Button variant="secondary" loading={busy} disabled={!submissionValid} onClick={()=>void save()}>Save draft</Button><Button loading={busy} disabled={!submissionValid} onClick={()=>void save(2)}>Save and continue <span aria-hidden="true">→</span></Button></div>
   </div>}
   {stage===2&&<>
    <dl className="record-facts"><div><dt>Class</dt><dd>{selected?.classLabel}</dd></div><div><dt>Subject</dt><dd>{selected?.subject}</dd></div><div><dt>Due</dt><dd>{dueAt} · {timezone}</dd></div><div><dt>Submission</dt><dd>Written response · late work not accepted</dd></div><div><dt>Status</dt><dd>Draft revision {saved?.revision}</dd></div></dl>
    <section className="notice-message-preview"><h3>{title}</h3><p>{instructions}</p></section>
    <div className="workflow-actions"><Button variant="secondary" onClick={()=>move(1)}>Back</Button><Button disabled={!saved} onClick={()=>move(3)}>Continue <span aria-hidden="true">→</span></Button></div>
   </>}
   {stage===3&&<><Alert title="Final confirmation">Publish the reviewed draft to currently eligible Students and separately authorized Parent/Student accounts. The published version is immutable.</Alert><dl className="record-facts"><div><dt>Assignment</dt><dd>{title}</dd></div><div><dt>Audience</dt><dd>{selected?.classLabel}</dd></div><div><dt>Due</dt><dd>{dueAt} · {timezone}</dd></div></dl><div className="workflow-actions"><Button variant="secondary" onClick={()=>move(2)}>Back</Button><Button loading={busy} disabled={!saved} onClick={()=>void publish()}>Publish assignment</Button></div></>}
  </Card><aside className="branch-edit-aside"><Card className="padded"><SectionHeader title="Own assigned class"/><p>Only a current Teacher assignment can create or publish this task.</p><div className="section-divider"/><h3>Exact audience</h3><p className="small muted">Later access grants and enrollments do not change this published version.</p></Card><Card className="padded"><h3>Assignment scope</h3><p className="small muted">Students can submit a written response and receive Teacher feedback. File submissions, questions, grading and deadline extensions are not available here.</p></Card></aside></div>
 </div>;
}
