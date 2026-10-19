'use client';
import {useState} from 'react';
import {Alert,Button,Card,SectionHeader} from '@/components/ui/primitives';
import {Checkbox} from '@/components/ui/forms';

type Filters=Readonly<{fromDate:string;toDate:string;yearId:string|null;sectionId:string|null;subjectId:string|null}>;

export function AttendanceReportExport({filters}:{filters:Filters}){
 const [pending,setPending]=useState(false),[error,setError]=useState<string>(),[reviewed,setReviewed]=useState(false),[step,setStep]=useState<2|3>(2);
 async function download(){
  setPending(true);setError(undefined);
  const query=new URLSearchParams({fromDate:filters.fromDate,toDate:filters.toDate});
  if(filters.yearId)query.set('yearId',filters.yearId);if(filters.sectionId)query.set('sectionId',filters.sectionId);if(filters.subjectId)query.set('subjectId',filters.subjectId);
  try{
   const response=await fetch(`/api/v1/reports/attendance.csv?${query}`,{credentials:'same-origin',cache:'no-store'});
   if(!response.ok){const body=await response.json().catch(()=>null) as {message?:string}|null;throw new Error(body?.message??'The attendance export could not be prepared.');}
   const disposition=response.headers.get('content-disposition')??'',filename=/filename="([^"]+)"/.exec(disposition)?.[1]??`attendance-report-${filters.fromDate}-${filters.toDate}.csv`,url=URL.createObjectURL(await response.blob()),anchor=document.createElement('a');
   anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);
  }catch(cause){setError(cause instanceof Error?cause.message:'The attendance export could not be prepared.');}
  finally{setPending(false);}
 }
 return <><ol className="workflow-stepper report-result-stepper" aria-label="Attendance report progress"><li className="complete"><span>✓</span>Report scope</li><li className={step===2?'active':'complete'} aria-current={step===2?'step':undefined}><span>{step===3?'✓':'2'}</span>Review export</li><li className={step===3?'active':''} aria-current={step===3?'step':undefined}><span>3</span>Confirm</li></ol><div className="branch-edit-grid report-workflow-grid"><Card className="branch-edit-card report-export-review">{step===2?<><SectionHeader title="Review export" description="Show columns, row count, completeness and the data timestamp."/><Checkbox label="I have reviewed the scope and permitted columns." checked={reviewed} onChange={event=>setReviewed(event.target.checked)}/><div className="workflow-actions"><Button variant="secondary" onClick={()=>history.back()}>← Back</Button><Button disabled={!reviewed} onClick={()=>setStep(3)}>Continue <span aria-hidden="true">→</span></Button></div></>:<><SectionHeader title="Confirm export" description="Generate the authorized CSV from the reviewed report snapshot."/><dl className="branch-review"><div><dt>From date</dt><dd>{filters.fromDate}</dd></div><div><dt>To date</dt><dd>{filters.toDate}</dd></div></dl><div className="workflow-actions"><Button variant="secondary" disabled={pending} onClick={()=>setStep(2)}>← Back</Button><Button onClick={download} loading={pending}>Download submitted CSV</Button></div>{error&&<Alert tone="danger" title="Export unavailable">{error} Your selected filters have been kept.</Alert>}</>}</Card><aside className="branch-edit-aside"><Card className="padded"><h2>What this changes</h2><p>A scoped report and bounded export match the underlying session records.</p><div className="section-divider"/><h3>Before you continue</h3><p>Attendance rate is present plus late, divided by present, late and absent. Excused records are excluded; a zero denominator is unavailable.</p></Card><Card className="padded"><h3>Something changed?</h3><p>Unsubmitted data remains missing. Access is checked again when the export is generated.</p></Card></aside></div></>;
}
