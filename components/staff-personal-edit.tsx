'use client';

import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {useStaffCorrection} from '@/components/staff-correction-context';
import {Dialog} from '@/components/ui/interactive';
import {TextArea,TextField} from '@/components/ui/forms';
import {Alert,Avatar,Button} from '@/components/ui/primitives';

type Attempt=Readonly<{key:string;body:Readonly<{expectedVersion:number;firstName:string;lastName:string;contactEmail:string|null;reason:string}>}>;
const EditIcon=()=> <svg className="staff-section-action-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m16 3 5 5-12 12-6 1 1-6zM14 5l5 5"/></svg>;

export function StaffPersonalEdit({employeeId,firstName,lastName,personVersion,employeeCode,contactEmail,open:controlledOpen,onOpenChange,hideTrigger=false}:{employeeId:string;firstName:string;lastName:string;personVersion:number;employeeCode:string;contactEmail:string|null;open?:boolean;onOpenChange?:(open:boolean)=>void;hideTrigger?:boolean}){
 const router=useRouter(),attempt=useRef<Attempt|null>(null),{pending,setPending}=useStaffCorrection(),[internalOpen,setInternalOpen]=useState(false),[given,setGiven]=useState(firstName),[family,setFamily]=useState(lastName),[email,setEmail]=useState(contactEmail??''),[reason,setReason]=useState(''),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false),[refreshFailed,setRefreshFailed]=useState(false),[error,setError]=useState('');
 const open=controlledOpen??internalOpen;
 function changeOpen(next:boolean){if(controlledOpen===undefined)setInternalOpen(next);onOpenChange?.(next);}
 const normalizedEmail=email.trim()?email.trim().toLowerCase():null,unchanged=given.trim()===firstName&&family.trim()===lastName&&normalizedEmail===contactEmail,blocked=Boolean(pending&&pending!=='personal');
 function close(){changeOpen(false);if(!pending&&!refreshFailed){setSaved(false);setError('');setReason('');attempt.current=null;}}
 async function refresh(){setBusy(true);try{const response=await fetch(`/api/v1/employees/${employeeId}`,{cache:'no-store'});if(!response.ok)throw new Error();setRefreshFailed(false);router.refresh();}catch{setRefreshFailed(true);}finally{setBusy(false);}}
 async function check(){const current=attempt.current;if(!current)return;setBusy(true);try{const response=await fetch(`/api/v1/employees/status/StaffPersonCorrected/${current.key}`,{cache:'no-store'}),result=await response.json();if(!response.ok)throw new Error(result.message??'Pending change could not be checked.');if(result.state==='UNKNOWN'){setError('The saved outcome is still unknown. Check again before saving another change.');return;}attempt.current=null;setPending(null);setSaved(true);setError('');await refresh();}catch(cause){setError(cause instanceof Error?cause.message:'Pending change could not be checked.');}finally{setBusy(false);}}
 async function save(){const current=attempt.current??{key:crypto.randomUUID(),body:{expectedVersion:personVersion,firstName:given.trim(),lastName:family.trim(),contactEmail:normalizedEmail,reason:reason.trim()}};attempt.current=current;setBusy(true);setError('');try{const response=await fetch(`/api/v1/employees/${employeeId}/person`,{method:'PATCH',headers:{'Content-Type':'application/json','Idempotency-Key':current.key},body:JSON.stringify({...current.body,key:current.key}),signal:AbortSignal.timeout(10000)}),result=await response.json();if(!response.ok){if(response.status<500){attempt.current=null;setPending(null);}setError(result.message??'Personal details could not be saved.');return;}attempt.current=null;setPending(null);setSaved(true);await refresh();}catch{setPending('personal');setError('Save outcome is unknown. Check the pending change before saving another.');}finally{setBusy(false);}}
 const name=`${firstName} ${lastName}`.trim();
 return <>
  {!hideTrigger&&<Button className="staff-section-action" variant="ghost" size="small" aria-label="Edit personal details" onClick={()=>changeOpen(true)}><EditIcon/>Edit</Button>}
  <Dialog drawer className="staff-reference-drawer staff-personal-drawer" open={open} onClose={close} title="Edit personal details">
   <div className="staff-personal-edit-form">
    <div className="staff-drawer-person"><Avatar name={name}/><div className="staff-drawer-person-copy"><div className="staff-drawer-person-name">{name}</div><div className="staff-drawer-person-number">{employeeCode}</div></div></div>
    {saved?<Alert tone="success" title="Personal details saved">{refreshFailed?'The change is saved. Refresh the profile to load the latest details.':'The profile now shows the corrected People record. The sign-in address is unchanged.'}{refreshFailed&&<div className="button-row"><Button variant="secondary" loading={busy} onClick={()=>void refresh()}>Refresh profile</Button></div>}</Alert>:<>
     {error&&<Alert tone={pending==='personal'?'warning':'danger'} title={pending==='personal'?'Outcome not confirmed':'Change not saved'}>{error}{pending==='personal'&&<div className="button-row"><Button variant="secondary" loading={busy} onClick={()=>void check()}>Check pending change</Button><Button variant="ghost" disabled={busy} onClick={()=>void save()}>Retry same change</Button></div>}</Alert>}
     {blocked&&<Alert tone="warning" title="Another change is pending">Check the pending change before saving another.</Alert>}
     <div className="staff-edit-fields">
      <TextField label="First name" required maxLength={100} value={given} disabled={busy} onChange={event=>setGiven(event.target.value)}/>
      <TextField label="Last name" maxLength={100} value={family} disabled={busy} onChange={event=>setFamily(event.target.value)}/>
      <TextField label="Contact email" type="email" maxLength={254} value={email} placeholder="name@example.com" disabled={busy} onChange={event=>setEmail(event.target.value)} hint="This is separate from the sign-in address."/>
      <TextArea label="Reason for change" required maxLength={500} placeholder="Briefly explain the correction" value={reason} disabled={busy} onChange={event=>setReason(event.target.value)}/>
     </div>
    </>}
    <div className="drawer-actions">{saved?<Button variant="secondary" onClick={close}>Close</Button>:<><Button variant="secondary" disabled={busy} onClick={close}>{pending==='personal'?'Close':'Cancel'}</Button><Button loading={busy} disabled={busy||Boolean(pending)||unchanged||!given.trim()||reason.trim().length<5} onClick={()=>void save()}>Save</Button></>}</div>
   </div>
  </Dialog>
 </>;
}
