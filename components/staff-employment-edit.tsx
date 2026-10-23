'use client';

import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Dialog} from '@/components/ui/interactive';
import {SelectField,TextArea,TextField} from '@/components/ui/forms';
import {Alert,Avatar,Button} from '@/components/ui/primitives';

type Category='TEACHING'|'ADMINISTRATION'|'SUPPORT'|'UNCLASSIFIED';
type Attempt=Readonly<{key:string;body:Readonly<{expectedVersion:number;category:Exclude<Category,'UNCLASSIFIED'>;reason:string}>}>;
const EditIcon=()=> <svg className="staff-section-action-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m16 3 5 5-12 12-6 1 1-6zM14 5l5 5"/></svg>;

export function StaffEmploymentEdit({employeeId,employeeName,employeeCode,joiningDate,version,category}:{employeeId:string;employeeName:string;employeeCode:string;joiningDate:string;version:number;category:Category}){
 const router=useRouter(),attempt=useRef<Attempt|null>(null),[open,setOpen]=useState(false),[selected,setSelected]=useState<Exclude<Category,'UNCLASSIFIED'>>(category==='UNCLASSIFIED'?'SUPPORT':category),[reason,setReason]=useState(''),[busy,setBusy]=useState(false),[unknown,setUnknown]=useState(false),[saved,setSaved]=useState(false),[error,setError]=useState('');
 const unchanged=category!=='UNCLASSIFIED'&&selected===category;
 function close(){if(unknown)return;setOpen(false);setSaved(false);setError('');setReason('');attempt.current=null;}
 async function save(){const current=attempt.current??{key:crypto.randomUUID(),body:{expectedVersion:version,category:selected,reason:reason.trim()}};attempt.current=current;setBusy(true);setError('');try{const response=await fetch(`/api/v1/employees/${employeeId}/category`,{method:'PATCH',headers:{'Content-Type':'application/json','Idempotency-Key':current.key},body:JSON.stringify({...current.body,key:current.key}),signal:AbortSignal.timeout(10000)}),result=await response.json();if(!response.ok){if(response.status<500){attempt.current=null;setUnknown(false);}throw new Error(result.message??'Employment details could not be saved.');}attempt.current=null;setUnknown(false);setSaved(true);router.refresh();}catch(cause){setUnknown(true);setError(cause instanceof Error&&cause.message!=='Failed to fetch'?cause.message:'Save outcome is unknown. Retry the same change before starting another.');}finally{setBusy(false);}}
 return <>
  <Button className="staff-section-action" variant="ghost" size="small" onClick={()=>setOpen(true)}><EditIcon/>Edit</Button>
  <Dialog drawer className="staff-reference-drawer staff-employment-drawer" open={open} onClose={close} title="Edit employment details">
   <div className="staff-employment-edit-form">
    <div className="staff-drawer-person"><Avatar name={employeeName}/><div className="staff-drawer-person-copy"><div className="staff-drawer-person-name">{employeeName}</div><div className="staff-drawer-person-number">{employeeCode}</div></div></div>
    {saved?<Alert tone="success" title="Employment details saved">The staff category is updated. Access and teaching eligibility are unchanged.</Alert>:<>
     {error&&<Alert tone={unknown?'warning':'danger'} title={unknown?'Outcome not confirmed':'Change not saved'}>{error}{unknown&&<div className="button-row"><Button variant="secondary" loading={busy} onClick={()=>void save()}>Retry same change</Button></div>}</Alert>}
     <div className="staff-edit-fields">
      <TextField label="Employee code" value={employeeCode} disabled readOnly hint="Employee code corrections require an approved staff record policy."/>
      <SelectField label="Staff category" required value={selected} disabled={busy||unknown} onChange={event=>{setSelected(event.target.value as Exclude<Category,'UNCLASSIFIED'>);setError('');}}><option value="TEACHING">Teaching</option><option value="ADMINISTRATION">Administration</option><option value="SUPPORT">Support</option></SelectField>
      <div className="staff-readonly-field"><span>Joining date</span><strong>{joiningDate}</strong><small>Contact the school office for a historical date correction.</small></div>
      <TextArea label="Reason for change" required maxLength={500} placeholder="Briefly explain the correction" value={reason} disabled={busy||unknown} onChange={event=>setReason(event.target.value)}/>
     </div>
    </>}
    <div className="drawer-actions">{saved?<Button variant="secondary" onClick={close}>Close</Button>:<><Button variant="secondary" disabled={busy||unknown} onClick={close}>Cancel</Button><Button loading={busy} disabled={busy||unknown||unchanged||reason.trim().length<1} onClick={()=>void save()}>Save</Button></>}</div>
   </div>
  </Dialog>
 </>;
}
