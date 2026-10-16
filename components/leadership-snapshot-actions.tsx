'use client';
import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Alert,Button} from '@/components/ui/primitives';
import type {LeadershipAttendanceExportInput} from '@/shared/contracts/reporting';

type Failure=Error&{status?:number;code?:string};
async function value<T>(response:Response):Promise<T>{const body=await response.json();if(!response.ok){const failure=new Error(body.message??'The snapshot action could not be completed.') as Failure;failure.status=response.status;failure.code=body.code;throw failure;}return body as T;}

export function CaptureLeadershipSnapshot({query,disabled=false}:{query:LeadershipAttendanceExportInput;disabled?:boolean}){
 const router=useRouter(),[busy,setBusy]=useState(false),[retrying,setRetrying]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState(''),intent=useRef<{query:LeadershipAttendanceExportInput;key:string}|null>(null);
 async function capture(){const payload=intent.current??{query,key:crypto.randomUUID()};intent.current=payload;setBusy(true);setMessage('');setError('');try{const saved=await value<{id:string;replayed:boolean}>(await fetch('/api/v1/leadership/reports/snapshots',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':payload.key},body:JSON.stringify(payload)}));intent.current=null;setRetrying(false);setMessage(saved.replayed?'The original retained snapshot was recovered.':'Snapshot captured from the displayed source cutoff.');router.push(`/leadership/reports/snapshots/${saved.id}`);router.refresh();}catch(cause){const failure=cause as Failure;if(!failure.status||failure.status>=500){setRetrying(true);setError('The capture outcome is unknown. Retry the same retained request; no duplicate snapshot will be created.');}else{intent.current=null;setRetrying(false);setError(failure.message);}}finally{setBusy(false);}}
 return <div><div aria-live="polite">{error&&<Alert tone="danger" title="Snapshot not confirmed">{error}</Alert>}{message&&<Alert tone="success" title="Snapshot retained">{message}</Alert>}</div><Button loading={busy} disabled={disabled||busy} onClick={()=>void capture()}>{retrying?'Retry same capture':'Capture snapshot'}</Button></div>;
}

export function RemoveLeadershipSnapshot({id,version}:{id:string;version:number}){
 const router=useRouter(),[confirming,setConfirming]=useState(false),[busy,setBusy]=useState(false),[retrying,setRetrying]=useState(false),[error,setError]=useState(''),intent=useRef<{expectedVersion:number;confirmed:true;key:string}|null>(null);
 async function remove(){const payload=intent.current??{expectedVersion:version,confirmed:true as const,key:crypto.randomUUID()};intent.current=payload;setBusy(true);setError('');try{await value(await fetch(`/api/v1/leadership/reports/snapshots/${id}`,{method:'DELETE',headers:{'Content-Type':'application/json','Idempotency-Key':payload.key},body:JSON.stringify(payload)}));intent.current=null;setRetrying(false);router.push('/leadership/reports/snapshots?removed=1');router.refresh();}catch(cause){const failure=cause as Failure;if(!failure.status||failure.status>=500){setRetrying(true);setError('The removal outcome is unknown. Retry the same retained request.');}else{intent.current=null;setRetrying(false);setError(failure.message);}}finally{setBusy(false);}}
 if(!confirming)return <Button variant="danger" onClick={()=>setConfirming(true)}>Remove retained payload</Button>;
 return <div className="snapshot-removal-confirm"><Alert tone="warning" title="Remove this retained payload?">The aggregate payload will no longer open from this URL. Minimal deletion audit metadata remains; source records are unchanged.</Alert>{error&&<Alert tone="danger" title="Removal not confirmed">{error}</Alert>}<div className="button-row"><Button variant="secondary" disabled={busy} onClick={()=>{setConfirming(false);setRetrying(false);setError('');intent.current=null;}}>Keep snapshot</Button><Button variant="danger" loading={busy} onClick={()=>void remove()}>{retrying?'Retry same removal':'Confirm removal'}</Button></div></div>;
}
