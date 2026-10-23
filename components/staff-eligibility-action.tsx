'use client';

import {useState} from 'react';
import type {StaffProfileAcademics} from '@/shared/contracts/people';
import {TeachingEligibilityManagement} from '@/components/teaching-eligibility-management';
import {Dialog} from '@/components/ui/interactive';
import {Button} from '@/components/ui/primitives';

export function StaffEligibilityAction({employeeId,employeeName,employmentFrom,employmentTo,initial}:{employeeId:string;employeeName:string;employmentFrom:string;employmentTo:string|null;initial:StaffProfileAcademics}){
 const [open,setOpen]=useState(false);
 return <>
  <Button variant="ghost" size="small" onClick={()=>setOpen(true)}>Review eligibility</Button>
  <Dialog drawer className="staff-reference-drawer staff-eligibility-drawer" open={open} onClose={()=>setOpen(false)} title="Teaching eligibility" description={`Review dates and assignment impact for ${employeeName}.`}>
   {open&&<TeachingEligibilityManagement employeeId={employeeId} employmentFrom={employmentFrom} employmentTo={employmentTo} initial={initial} backHref={`/admin/teachers/${employeeId}`} onClose={()=>setOpen(false)}/>}
  </Dialog>
 </>;
}
