'use client';

import {useState} from 'react';
import {Dialog} from '@/components/ui/interactive';
import {TextArea,TextField} from '@/components/ui/forms';
import {Avatar,Button} from '@/components/ui/primitives';

const EditIcon=()=> <svg className="staff-section-action-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m16 3 5 5-12 12-6 1 1-6zM14 5l5 5"/></svg>;

export function StaffPersonalEdit({displayName,employeeCode,contactEmail}:{displayName:string;employeeCode:string;contactEmail:string|null}){
 const [open,setOpen]=useState(false);
 return <>
  <Button className="staff-section-action" variant="ghost" size="small" onClick={()=>setOpen(true)}><EditIcon/>Edit</Button>
  <Dialog drawer className="staff-reference-drawer staff-personal-drawer" open={open} onClose={()=>setOpen(false)} title="Edit personal details">
   <div className="staff-personal-edit-form">
    <div className="staff-drawer-person"><Avatar name={displayName}/><div className="staff-drawer-person-copy"><div className="staff-drawer-person-name">{displayName}</div><div className="staff-drawer-person-number">{employeeCode}</div></div></div>
    <div className="staff-edit-fields">
     <TextField label="Full name" value={displayName} disabled readOnly/>
     <TextField label="Contact email" type="email" value={contactEmail??''} placeholder="Not recorded" disabled readOnly hint="This is separate from the sign-in address."/>
     <TextArea label="Reason for change" placeholder="Briefly explain the correction" disabled/>
    </div>
    <p className="staff-contract-note">Personal detail corrections are not available until the staff record policy is approved.</p>
    <div className="drawer-actions"><Button variant="secondary" onClick={()=>setOpen(false)}>Close</Button></div>
   </div>
  </Dialog>
 </>;
}
