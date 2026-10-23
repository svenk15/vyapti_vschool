'use client';

import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Dialog} from '@/components/ui/interactive';
import {SelectField,TextArea} from '@/components/ui/forms';
import {Alert,Button} from '@/components/ui/primitives';

type Category='TEACHING'|'ADMINISTRATION'|'SUPPORT'|'UNCLASSIFIED';
type Attempt=Readonly<{key:string;body:Readonly<{expectedVersion:number;category:Exclude<Category,'UNCLASSIFIED'>;reason:string}>}>;

export function StaffEmploymentEdit({employeeId,employeeCode,joiningDate,version,category}:{employeeId:string;employeeCode:string;joiningDate:string;version:number;category:Category}){
 const router=useRouter(),attempt=useRef<Attempt|null>(null),[open,setOpen]=useState(false),[selected,setSelected]=useState<Exclude<Category,'UNCLASSIFIED'>>(category==='UNCLASSIFIED'?'SUPPORT':category),[reason,setReason]=useState(''),[busy,setBusy]=useState(false),[unknown,setUnknown]=useState(false),[saved,setSaved]=useState(false),[error,setError]=useState('');
 const unchanged=category!=='UNCLASSIFIED'&&selected===category;
 function close(){if(unknown)return;setOpen(false);setSaved(false);setError('');setReason('');attempt.current=null;}
 async function save(){const current=attempt.current??{key:crypto.randomUUID(),body:{expectedVersion:version,category:selected,reason:reason.trim()}};attempt.current=current;setBusy(true);setError('');try{const response=await fetch(`/api/v1/employees/${employeeId}/category`,{method:'PATCH',headers:{'Content-Type':'application/json','Idempotency-Key':current.key},body:JSON.stringify({...current.body,key:current.key}),signal:AbortSignal.timeout(10000)}),result=await response.json();if(!response.ok){if(response.status<500){attempt.current=null;setUnknown(false);}throw new Error(result.message??'Employment details could not be saved.');}attempt.current=null;setUnknown(false);setSaved(true);router.refresh();}catch(cause){setUnknown(true);setError(cause instanceof Error&&cause.message!=='Failed to fetch'?cause.message:'Save outcome is unknown. Retry the same change before starting another.');}finally{setBusy(false);}}
 return <>
  <Button variant="ghost" size="small" onClick={()=>setOpen(true)}>Edit</Button>
  <Dialog drawer className="staff-reference-drawer staff-employment-drawer" open={open} onClose={close} title="Edit employment" description="Update the supported employment detail for this staff record.">
   <div className="staff-employment-edit-form">
    {saved?<Alert tone="success" title="Employment details saved">The staff category is updated. Access and teaching eligibility are unchanged.</Alert>:<>
     {error&&<Alert tone={unknown?'warning':'danger'} title={unknown?'Outcome not confirmed':'Change not saved'}>{error}{unknown&&<div className="button-row"><Button variant="secondary" loading={busy} onClick={()=>void save()}>Retry same change</Button></div>}</Alert>}
     <dl className="staff-access-action-facts"><div><dt>Employee code</dt><dd>{employeeCode}</dd></div><div><dt>Joining date</dt><dd>{joiningDate}</dd></div></dl>
     <SelectField label="Staff category" required value={selected} disabled={busy||unknown} onChange={event=>{setSelected(event.target.value as Exclude<Category,'UNCLASSIFIED'>);setError('');}}><option value="TEACHING">Teaching</option><option value="ADMINISTRATION">Administration</option><option value="SUPPORT">Support</option></SelectField>
     <TextArea label="Reason" required maxLength={500} value={reason} disabled={busy||unknown} onChange={event=>setReason(event.target.value)}/>
    </>}
    <div className="drawer-actions">{saved?<Button variant="secondary" onClick={close}>Close</Button>:<><Button variant="secondary" disabled={busy||unknown} onClick={close}>Cancel</Button><Button loading={busy} disabled={busy||unknown||unchanged||reason.trim().length<1} onClick={()=>void save()}>Save employment</Button></>}</div>
   </div>
  </Dialog>
 </>;
}
