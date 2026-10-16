'use client';

import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import type {AttendanceCancelResult,AttendanceCorrectionResult,AttendanceHistory,AttendanceMarkEntry,AttendanceSessionRecord,AttendanceStatus} from '@/shared/contracts/attendance';
import {Alert,Badge,Button,Card,SectionHeader} from '@/components/ui/primitives';
import {Checkbox,SelectField,TextArea,TextField} from '@/components/ui/forms';

type CorrectionPayload={expectedVersion:number;changes:AttendanceMarkEntry[];reason:string;key:string};
type CancelPayload={expectedVersion:number;reason:string;key:string};
type CommandState='editable'|'submitting'|'success'|'rejected'|'stale'|'unknown';
type ApiFailure={kind:'api';status:number;code:string;message:string;retryable:boolean};
type Stage=0|1|2;
type SecondaryPanel='history'|'cancel'|null;
const labels:Record<AttendanceStatus,string>={PRESENT:'Present',ABSENT:'Absent',LATE:'Late',EXCUSED:'Excused'};
const shown=(entry:AttendanceMarkEntry|undefined)=>entry?`${labels[entry.status]}${entry.status==='LATE'?` (${entry.lateMinutes} min)`:''}`:'—';

function historyLines(changes:Readonly<Record<string,unknown>>,names:ReadonlyMap<string,string>){
 if(typeof changes.fromStatus==='string'&&changes.toStatus==='CANCELLED')return [`Session: ${changes.fromStatus} → Canceled`];
 const rows=Array.isArray(changes.changes)?changes.changes:Array.isArray(changes.entries)?changes.entries:[];
 return rows.flatMap((item,index)=>{
  if(!item||typeof item!=='object')return [];
  const value=item as Record<string,unknown>,studentId=typeof value.studentId==='string'?value.studentId:'',name=names.get(studentId)??'Student';
  if(value.from&&typeof value.from==='object'&&value.to&&typeof value.to==='object')return [`${name}: ${shown(value.from as AttendanceMarkEntry)} → ${shown(value.to as AttendanceMarkEntry)}`];
  if(typeof value.status==='string'&&value.studentId)return [`${name}: ${labels[value.status as AttendanceStatus]??'Updated'}${value.lateMinutes?` (${String(value.lateMinutes)} min)`:''}`];
  return [`Attendance change ${index+1}`];
 });
}
async function responseJson<T>(response:Response):Promise<T>{
 let value:Record<string,unknown>={};
 try{value=await response.json() as Record<string,unknown>;}catch{/* A malformed error body remains a confirmed response. */}
 if(!response.ok)throw {kind:'api',status:response.status,code:typeof value.code==='string'?value.code:'UNAVAILABLE',message:typeof value.message==='string'?value.message:'The request could not be completed.',retryable:value.retryable===true} satisfies ApiFailure;
 return value as T;
}
const isApiFailure=(value:unknown):value is ApiFailure=>Boolean(value&&typeof value==='object'&&(value as {kind?:unknown}).kind==='api');

function HistoryCard({history,names,error,busy,onRefresh,onClose}:{history:AttendanceHistory;names:ReadonlyMap<string,string>;error:string;busy:boolean;onRefresh:()=>void;onClose?:()=>void}){
 return <Card id="attendance-history" className="padded settings-panel attendance-history-card"><SectionHeader title="Revision history" description="Immutable submission, correction and cancellation events for this register." actions={<div className="button-row">{error&&<Button variant="secondary" size="small" loading={busy} onClick={onRefresh}>Refresh history</Button>}{onClose&&<Button variant="ghost" size="small" onClick={onClose}>Close history</Button>}</div>}/>{error&&<Alert tone="warning" title="History temporarily unavailable">{error}</Alert>}<ol className="attendance-history-list">{history.revisions.map(revision=><li key={revision.number}><strong>Revision {revision.number} · {revision.kind}</strong><p>{new Date(revision.occurredAt).toLocaleString()} · {revision.actorDisplayName}</p>{revision.reason&&<p>Reason: {revision.reason}</p>}<ul>{historyLines(revision.changes,names).map((line,index)=><li key={`${revision.number}-${index}`}>{line}</li>)}</ul></li>)}</ol></Card>;
}

function Progress({stage}:{stage:Stage}){
 const steps=['Select the record','Record evidence','Confirm'];
 return <ol className="workflow-stepper attendance-correction-stepper" aria-label="Attendance correction progress">{steps.map((label,index)=><li key={label} className={stage===index?'active':stage>index?'complete':''} aria-current={stage===index?'step':undefined}><span>{stage>index?'✓':index+1}</span>{label}</li>)}</ol>;
}

export function AttendanceCorrections({initial,initialHistory,sessionLabel,returnTo='/admin/attendance/sessions?view=monitor'}:{initial:AttendanceSessionRecord;initialHistory:AttendanceHistory;sessionLabel:string;returnTo?:string}){
 const router=useRouter(),roster=initial.roster??[],names=new Map(roster.map(student=>[student.studentId,student.displayName])),stageHeading=useRef<HTMLDivElement>(null);
 const [records,setRecords]=useState<readonly AttendanceMarkEntry[]>(initial.records??[]),[history,setHistory]=useState(initialHistory),[version,setVersion]=useState(initial.version);
 const [stage,setStage]=useState<Stage>(0),[selectedStudentId,setSelectedStudentId]=useState(''),[selectedSessionId,setSelectedSessionId]=useState(''),[selectedStatus,setSelectedStatus]=useState<AttendanceStatus|''>(''),[lateMinutes,setLateMinutes]=useState('1'),[reason,setReason]=useState(''),[reviewed,setReviewed]=useState(false),[errors,setErrors]=useState<Record<string,string>>({});
 const [correctionState,setCorrectionState]=useState<CommandState>('editable'),[correctionMessage,setCorrectionMessage]=useState(''),[retainedCorrection,setRetainedCorrection]=useState<CorrectionPayload|null>(null),[staleAttempt,setStaleAttempt]=useState<CorrectionPayload|null>(null),[staleRefreshError,setStaleRefreshError]=useState('');
 const [confirmedChange,setConfirmedChange]=useState<{from:AttendanceMarkEntry;to:AttendanceMarkEntry}|null>(null);
 const [historyError,setHistoryError]=useState(''),[historyBusy,setHistoryBusy]=useState(false),[panel,setPanel]=useState<SecondaryPanel>(null);
 const [cancelReason,setCancelReason]=useState(''),[cancelState,setCancelState]=useState<CommandState>('editable'),[cancelMessage,setCancelMessage]=useState(''),[retainedCancel,setRetainedCancel]=useState<CancelPayload|null>(null),[cancelled,setCancelled]=useState(initial.status==='CANCELLED'),[cancelledAt,setCancelledAt]=useState<string|null>(initial.cancelledAt??null);
 const current=new Map(records.map(entry=>[entry.studentId,entry])),before=current.get(selectedStudentId),parsedLate=Number(lateMinutes);
 const changed:AttendanceMarkEntry[]=before&&selectedStatus&&(before.status!==selectedStatus||(selectedStatus==='LATE'&&before.lateMinutes!==parsedLate))?[{studentId:selectedStudentId,status:selectedStatus,...(selectedStatus==='LATE'?{lateMinutes:parsedLate}:{})}]:[];
 const correctionLocked=correctionState==='submitting'||correctionState==='unknown'||correctionState==='stale'||cancelState==='submitting'||cancelState==='unknown';
 const hasCorrectionDraft=Boolean(selectedStudentId||selectedSessionId||selectedStatus||reason.trim());
 const cancelLocked=cancelState==='submitting'||cancelState==='unknown'||correctionState==='submitting'||correctionState==='unknown'||correctionState==='stale'||hasCorrectionDraft;
 const cancelActionLocked=cancelState==='submitting'||correctionState==='submitting'||correctionState==='unknown'||correctionState==='stale'||hasCorrectionDraft;

 useEffect(()=>{stageHeading.current?.focus();},[stage]);

 function chooseStudent(studentId:string){setSelectedStudentId(studentId);setSelectedStatus('');setLateMinutes('1');setReviewed(false);setErrors({});}
 function chooseStatus(status:AttendanceStatus|''){setSelectedStatus(status);setReviewed(false);setErrors({});if(correctionState==='rejected'||correctionState==='success'){setCorrectionState('editable');setCorrectionMessage('');}}
 function validate(currentStage:Stage){
  const next:Record<string,string>={};
  if(currentStage===0){
   if(!selectedStudentId)next.student='Choose a student from this frozen roster.';
   if(!selectedSessionId)next.session='Choose the submitted session.';
   if(!selectedStatus)next.status='Choose the corrected attendance status.';
   else if(selectedStatus==='LATE'&&(!Number.isInteger(parsedLate)||parsedLate<1||parsedLate>480))next.late='Enter whole late minutes from 1 to 480.';
   else if(before&&changed.length===0)next.status='Choose a status or late duration that differs from the submitted value.';
  }
  if(currentStage===1){const normalized=reason.normalize('NFC').trim();if(normalized.length<5||normalized.length>500)next.reason='Enter a meaningful reason of 5–500 characters.';if(!reviewed)next.reviewed='Confirm that you reviewed the original and corrected status.';}
  setErrors(next);return Object.keys(next).length===0;
 }
 function continueFrom(currentStage:0|1){if(!validate(currentStage))return;setStage((currentStage+1) as Stage);}
 function resetCorrection(){setStage(0);setSelectedStudentId('');setSelectedSessionId('');setSelectedStatus('');setLateMinutes('1');setReason('');setReviewed(false);setErrors({});setRetainedCorrection(null);setStaleAttempt(null);setConfirmedChange(null);setCorrectionState('editable');setCorrectionMessage('');}
 async function refreshHistory(){setHistoryBusy(true);try{setHistory(await responseJson<AttendanceHistory>(await fetch(`/api/v1/sessions/${initial.id}/history`,{cache:'no-store'})));setHistoryError('');return true;}catch{setHistoryError('The correction is saved, but its latest history could not be loaded. Retry this read without repeating the correction.');return false;}finally{setHistoryBusy(false);}}
 async function loadAuthoritative(payload:CorrectionPayload){
  setStaleRefreshError('');
  try{
   const session=await responseJson<AttendanceSessionRecord>(await fetch(`/api/v1/sessions/${initial.id}`,{cache:'no-store'}));
   if(session.status!=='SUBMITTED')throw new Error('This register is no longer submitted and cannot be corrected.');
   const authoritative=session.records??[],attempt=payload.changes[0];
   setVersion(session.version);setRecords(authoritative);
   if(attempt){setSelectedStudentId(attempt.studentId);setSelectedStatus(attempt.status);setLateMinutes(String(attempt.lateMinutes??1));}
   setReason(payload.reason);setReviewed(false);await refreshHistory();
  }catch(value){setStaleRefreshError(value instanceof Error?value.message:'Current register data could not be loaded.');}
 }
 async function save(){
  if(!retainedCorrection&&(!validate(1)||changed.length!==1))return;
  const payload=retainedCorrection??{expectedVersion:version,changes:[...changed],reason:reason.normalize('NFC').trim(),key:crypto.randomUUID()};
  setRetainedCorrection(payload);setCorrectionState('submitting');setCorrectionMessage('');setHistoryError('');
  try{
   const saved=await responseJson<AttendanceCorrectionResult>(await fetch(`/api/v1/sessions/${initial.id}/corrections`,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':payload.key},body:JSON.stringify(payload)}));
   const nextRecords=records.map(record=>{const update=saved.changes.find(change=>change.studentId===record.studentId);return update?{studentId:record.studentId,...update.to}:record;});
   const savedChange=saved.changes[0];
   if(savedChange)setConfirmedChange({from:{studentId:savedChange.studentId,...savedChange.from},to:{studentId:savedChange.studentId,...savedChange.to}});
   setVersion(saved.version);setRecords(nextRecords);setRetainedCorrection(null);setStaleAttempt(null);setCorrectionState('success');setCorrectionMessage(`Correction ${saved.revision} saved. ${saved.changes.length} record${saved.changes.length===1?'':'s'} updated.`);router.refresh();await refreshHistory();
  }catch(value){
   if(isApiFailure(value)&&value.code==='STALE_VERSION'){setCorrectionState('stale');setCorrectionMessage(value.message);setStaleAttempt(payload);setRetainedCorrection(null);await loadAuthoritative(payload);}
   else if(!isApiFailure(value)||value.status===503||value.retryable){setCorrectionState('unknown');setCorrectionMessage('The result is unknown. Retry the exact retained correction; its values and request key will not change.');}
   else{setCorrectionState('rejected');setCorrectionMessage(value.message);setRetainedCorrection(null);}
  }
 }
 function reviewStale(){setCorrectionState('editable');setCorrectionMessage('Current records are loaded. Review the intended change, confirm it again, then submit a new command.');setRetainedCorrection(null);setStaleAttempt(null);setReviewed(false);setStage(0);}
 async function cancelSession(){
  const payload=retainedCancel??{expectedVersion:version,reason:cancelReason.normalize('NFC').trim(),key:crypto.randomUUID()};setRetainedCancel(payload);setCancelState('submitting');setCancelMessage('');
  try{const saved=await responseJson<AttendanceCancelResult>(await fetch(`/api/v1/sessions/${initial.id}/cancel`,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':payload.key},body:JSON.stringify(payload)}));setVersion(saved.version);setCancelled(true);setCancelledAt(saved.cancelledAt);setRetainedCancel(null);setCancelState('success');setCancelMessage(`Cancellation revision ${saved.revision} saved.`);router.refresh();await refreshHistory();}
  catch(value){if(isApiFailure(value)&&value.code==='STALE_VERSION'){setCancelState('stale');setCancelMessage(value.message);setRetainedCancel(null);}else if(!isApiFailure(value)||value.status===503||value.retryable){setCancelState('unknown');setCancelMessage('The cancellation result is unknown. Retry the exact retained request; its reason and request key will not change.');}else{setCancelState('rejected');setCancelMessage(value.message);setRetainedCancel(null);}}
 }

 if(cancelled)return <><Card className="padded settings-panel attendance-records-card"><SectionHeader title="Session canceled" description="This session is read-only. Its roster, submitted records and prior revisions are retained." actions={<Badge>CANCELLED</Badge>}/>{cancelMessage&&<Alert tone="success" title="Cancellation confirmed">{cancelMessage}</Alert>}{cancelledAt&&<p className="small muted">Canceled {new Date(cancelledAt).toLocaleString()}</p>}<h3>Retained submitted records</h3>{roster.length===0?<p>No roster was frozen before cancellation.</p>:<div className="table-scroll"><table className="data-table"><caption>Read-only records for the canceled session</caption><thead><tr><th>Student</th><th>Attendance</th><th>Late minutes</th></tr></thead><tbody>{roster.map(student=>{const record=records.find(value=>value.studentId===student.studentId);return <tr key={student.studentId}><th scope="row">{student.displayName}</th><td>{shown(record)}</td><td>{record?.lateMinutes??'—'}</td></tr>;})}</tbody></table></div>}</Card><HistoryCard history={history} names={names} error={historyError} busy={historyBusy} onRefresh={()=>void refreshHistory()}/></>;

 const selectedStudent=roster.find(student=>student.studentId===selectedStudentId);
 return <>
  <Progress stage={stage}/>
  <div className="branch-edit-grid attendance-correction-grid">
   <Card className="branch-edit-card attendance-correction-card">
    {correctionState==='editable'&&correctionMessage&&<Alert tone="info" title="Review current values">{correctionMessage}</Alert>}
    {stage===0&&<><div ref={stageHeading} tabIndex={-1}><SectionHeader title="Select the record" description="Corrections preserve the original submission."/></div><form onSubmit={event=>{event.preventDefault();continueFrom(0);}}><div className="attendance-correction-fields"><SelectField label="Student" required value={selectedStudentId} disabled={correctionLocked} error={errors.student} onChange={event=>chooseStudent(event.target.value)}><option value="">Choose student</option>{roster.map(student=><option key={student.studentId} value={student.studentId}>{student.displayName} · {student.rollNumber??'No roll number'} · {shown(current.get(student.studentId))}</option>)}</SelectField><SelectField label="Session" required value={selectedSessionId} disabled={correctionLocked} error={errors.session} onChange={event=>{setSelectedSessionId(event.target.value);setErrors({});}}><option value="">Choose session</option><option value={initial.id}>{sessionLabel}</option></SelectField><SelectField label="Corrected status" required value={selectedStatus} disabled={!selectedStudentId||correctionLocked} error={errors.status} onChange={event=>chooseStatus(event.target.value as AttendanceStatus|'')}><option value="">Choose corrected status</option>{Object.entries(labels).map(([status,label])=><option value={status} key={status}>{label}</option>)}</SelectField>{selectedStatus==='LATE'&&<TextField label="Late minutes" required type="number" min={1} max={480} step={1} value={lateMinutes} disabled={correctionLocked} error={errors.late} onChange={event=>{setLateMinutes(event.target.value);setReviewed(false);setErrors({});}}/>}</div><div className="workflow-actions"><Button variant="secondary" onClick={()=>router.push(returnTo)}>Cancel</Button><Button type="submit" disabled={correctionLocked}>Continue <span aria-hidden="true">→</span></Button></div><Button className="workflow-draft-action" variant="ghost" disabled title="Draft persistence and resume are not implemented.">Save draft and leave</Button></form></>}
    {stage===1&&<><div ref={stageHeading} tabIndex={-1}><SectionHeader title="Record evidence" description="A meaningful reason is mandatory."/></div><form onSubmit={event=>{event.preventDefault();continueFrom(1);}}><div className="attendance-correction-evidence"><TextArea label="Reason" required value={reason} minLength={5} maxLength={500} rows={4} disabled={correctionLocked} error={errors.reason} onChange={event=>{setReason(event.target.value);setReviewed(false);setErrors({});}} hint="5–500 characters. The reason is retained in attendance history."/><Checkbox label="I have reviewed the original and corrected status." checked={reviewed} disabled={correctionLocked} onChange={event=>{setReviewed(event.target.checked);setErrors({});}}/>{errors.reviewed&&<p className="field-error" role="alert">{errors.reviewed}</p>}</div><div className="workflow-actions"><Button variant="secondary" disabled={correctionLocked} onClick={()=>setStage(0)}>Back</Button><Button type="submit" disabled={correctionLocked}>Continue <span aria-hidden="true">→</span></Button></div><Button className="workflow-draft-action" variant="ghost" disabled title="Draft persistence and resume are not implemented.">Save draft and leave</Button></form></>}
    {stage===2&&<><div ref={stageHeading} tabIndex={-1}><h2>Review and confirm</h2><p className="muted attendance-correction-help">Check the intended outcome before recording the correction.</p></div>{correctionState==='success'&&correctionMessage&&<Alert tone="success" title="Correction saved" dismissLabel="Close correction saved message" onDismiss={()=>setCorrectionMessage('')}>{correctionMessage}</Alert>}{correctionState==='unknown'&&<Alert tone="warning" title="Correction outcome unknown">{correctionMessage}</Alert>}{correctionState==='stale'&&<Alert tone="warning" title="Register changed before this correction">{correctionMessage}</Alert>}{correctionState==='rejected'&&<Alert tone="danger" title="Correction rejected">{correctionMessage}</Alert>}{staleAttempt&&<div className="attendance-stale-review" aria-label="Attempted correction compared with current register"><h3>Attempted change retained for review</h3><ul>{staleAttempt.changes.map(change=><li key={change.studentId}><strong>{names.get(change.studentId)??'Student'}</strong><span>Current: {shown(current.get(change.studentId))}</span><span>Attempted: {shown(change)}</span></li>)}</ul>{staleRefreshError?<><Alert tone="danger" title="Current register unavailable">{staleRefreshError}</Alert><Button variant="secondary" onClick={()=>void loadAuthoritative(staleAttempt)}>Retry current data</Button></>:<Button variant="secondary" onClick={reviewStale}>Review against current register</Button>}</div>}<dl className="branch-review attendance-correction-review"><div><dt>Student</dt><dd>{selectedStudent?.displayName??'—'}</dd></div><div><dt>Session</dt><dd>{sessionLabel}</dd></div><div><dt>Submitted status</dt><dd>{shown(confirmedChange?.from??before)}</dd></div><div><dt>Corrected status</dt><dd>{shown(confirmedChange?.to??changed[0])}</dd></div><div className="attendance-correction-review-reason"><dt>Reason</dt><dd>{reason.normalize('NFC').trim()}</dd></div><div><dt>Review</dt><dd>{reviewed?'Confirmed':'Required'}</dd></div></dl><div className="section-divider"/><h3>Expected outcome</h3><p className="small muted attendance-correction-outcome">A new correction revision appears with actor, reason and time. The original submission remains in immutable history.</p>{correctionState==='success'?<div className="workflow-actions"><Button variant="secondary" onClick={()=>setPanel('history')}>View revision history</Button><Button onClick={resetCorrection}>Correct another record</Button></div>:correctionState!=='stale'&&<div className="workflow-actions"><Button variant="secondary" disabled={correctionLocked} onClick={()=>setStage(1)}>Back</Button><Button loading={correctionState==='submitting'} disabled={correctionState==='submitting'||cancelState==='submitting'||cancelState==='unknown'||(!retainedCorrection&&(changed.length!==1||reason.trim().length<5||!reviewed))} onClick={()=>void save()}>{correctionState==='unknown'?'Retry correction':'Confirm correction'} <span aria-hidden="true">✓</span></Button></div>}</>}
   </Card>
   <aside className="branch-edit-aside"><Card className="padded"><h2>What this changes</h2><p>A new correction revision appears with actor, reason and time.</p><div className="section-divider"/><h3>Before you continue</h3><p>Only submitted attendance is correctable; the server compares the expected revision in the same authorized transaction.</p></Card><Card className="padded"><h3>Something changed?</h3><p>Another editor’s correction shows a conflict and comparison; an unknown result reuses the same request receipt.</p><div className="section-divider"/><div className="attendance-related-actions"><Button variant="ghost" size="small" onClick={()=>setPanel(panel==='history'?null:'history')}>{panel==='history'?'Hide revision history':'View revision history'}</Button><Button variant="ghost" size="small" disabled={cancelLocked} onClick={()=>setPanel(panel==='cancel'?null:'cancel')}>{panel==='cancel'?'Hide cancellation':'Cancel this session'}</Button>{hasCorrectionDraft&&<Button variant="ghost" size="small" onClick={resetCorrection}>Reset correction</Button>}</div>{cancelLocked&&<p className="small muted">Finish or reset the correction flow before cancellation.</p>}</Card></aside>
  </div>
  {panel==='history'&&<HistoryCard history={history} names={names} error={historyError} busy={historyBusy} onRefresh={()=>void refreshHistory()} onClose={()=>setPanel(null)}/>}
  {panel==='cancel'&&<Card id="attendance-cancel" className="padded settings-panel attendance-cancel-card"><SectionHeader title="Cancel session" description="Cancellation is destructive. It retains the roster, submitted records and history and cannot be undone." actions={<Button variant="ghost" size="small" onClick={()=>setPanel(null)}>Close cancellation</Button>}/>{cancelState==='unknown'&&<Alert tone="warning" title="Cancellation outcome unknown">{cancelMessage}</Alert>}{cancelState==='stale'&&<Alert tone="warning" title="Session changed before cancellation">{cancelMessage}</Alert>}{cancelState==='rejected'&&<Alert tone="danger" title="Cancellation rejected">{cancelMessage}</Alert>}<div className="settings-form"><TextArea label="Cancellation reason" value={cancelReason} minLength={5} maxLength={500} rows={3} disabled={cancelLocked} onChange={event=>setCancelReason(event.target.value)} hint={hasCorrectionDraft?'Reset the correction draft before canceling this session.':'5–500 characters. The reason is retained in attendance history.'}/><div className="form-actions"><Button variant="danger" loading={cancelState==='submitting'} disabled={cancelActionLocked||(!retainedCancel&&cancelReason.trim().length<5)} onClick={()=>void cancelSession()}>{cancelState==='unknown'?'Retry cancellation':'Cancel session'}</Button></div></div></Card>}
 </>;
}
