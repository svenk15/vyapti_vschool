'use client';

import {useState} from 'react';
import type {StaffProfileAcademics} from '@/shared/contracts/people';
import {TeachingEligibilityManagement} from '@/components/teaching-eligibility-management';
import {Dialog} from '@/components/ui/interactive';
import {Button} from '@/components/ui/primitives';

const EligibilityIcon=()=> <svg className="staff-section-action-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5h16v16H4zM8 3v4M16 3v4M4 10h16m-11 5 2 2 4-5"/></svg>;

export function StaffEligibilityAction({employeeId,employeeName,employmentFrom,employmentTo,initial}:{employeeId:string;employeeName:string;employmentFrom:string;employmentTo:string|null;initial:StaffProfileAcademics}){
 const [open,setOpen]=useState(false);
 return <>
  <Button className="staff-section-action" variant="ghost" size="small" onClick={()=>setOpen(true)}><EligibilityIcon/>Review eligibility</Button>
  <Dialog drawer className="staff-reference-drawer staff-eligibility-drawer" open={open} onClose={()=>setOpen(false)} title="Teaching eligibility" description={`Review dates and assignment impact for ${employeeName}.`}>
   {open&&<TeachingEligibilityManagement employeeId={employeeId} employmentFrom={employmentFrom} employmentTo={employmentTo} initial={initial} backHref={`/admin/teachers/${employeeId}`} onClose={()=>setOpen(false)}/>}
  </Dialog>
 </>;
}
