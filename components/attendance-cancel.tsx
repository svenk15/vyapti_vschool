'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import type {AttendanceCancelResult,AttendanceSessionRecord} from '@/shared/contracts/attendance';
import {Alert,Button,Card} from '@/components/ui/primitives';
import {TextArea} from '@/components/ui/forms';

export function AttendanceCancel({initial}:{initial:AttendanceSessionRecord}){
 const router=useRouter(),[reason,setReason]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState<AttendanceCancelResult|null>(null),[key,setKey]=useState('');
 async function cancel(){setBusy(true);setError('');const commandKey=key||crypto.randomUUID();setKey(commandKey);try{const response=await fetch(`/api/v1/sessions/${initial.id}/cancel`,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':commandKey},body:JSON.stringify({expectedVersion:initial.version,reason:reason.normalize('NFC').trim(),key:commandKey})}),body=await response.json();if(!response.ok)throw new Error(typeof body.message==='string'?body.message:'Cancellation could not be confirmed.');setSaved(body as AttendanceCancelResult);router.refresh();}catch(value){setError(value instanceof Error?value.message:'Cancellation could not be confirmed. Retry the same request.');}finally{setBusy(false);}}
 if(initial.status==='CANCELLED'||saved)return <Card className="padded section-space"><h2>Session canceled</h2><p>Attendance records and prior revisions are retained for review. This session is read-only and will not be restored.</p>{(saved?.cancelledAt??initial.cancelledAt)&&<p>Cancelled {new Date(saved?.cancelledAt??initial.cancelledAt!).toLocaleString()}</p>}{saved&&<p role="status">Cancellation revision {saved.revision} saved.</p>}</Card>;
 return <Card className="padded section-space"><h2>Cancel session</h2><p>Cancellation retains the roster, submitted records and history. It cannot be undone.</p>{error&&<div role="alert"><Alert tone="danger" title="Cancellation not confirmed">{error}</Alert></div>}<div className="control-stack"><TextArea label="Cancellation reason" value={reason} minLength={5} maxLength={500} rows={3} disabled={busy} onChange={event=>setReason(event.target.value)} hint="5–500 characters. The reason is retained in attendance history."/><Button loading={busy} disabled={busy||reason.trim().length<5} onClick={()=>void cancel()}>Cancel session</Button></div></Card>;
}
