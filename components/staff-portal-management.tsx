'use client';

import {useState} from 'react';
import type {StaffProfileAccess} from '@/shared/contracts/people';
import {StaffInvitationManagement} from '@/components/staff-invitation-management';
import {Button} from '@/components/ui/primitives';
import {Dialog} from '@/components/ui/interactive';

export function StaffPortalManagement({employeeId,access}:{employeeId:string;access:StaffProfileAccess}){
 const [open,setOpen]=useState(false);
 return <>
  <Button variant="ghost" size="small" onClick={()=>setOpen(true)}>{access.state==='NO_ACCOUNT'?'Set up access':'View access'} <span aria-hidden="true">→</span></Button>
  <Dialog drawer className="staff-reference-drawer staff-portal-drawer" title="Staff access" description="Review this staff member’s current account and invitation state." open={open} onClose={()=>setOpen(false)}>
   <StaffInvitationManagement employeeId={employeeId} initial={access}/>
  </Dialog>
 </>;
}
