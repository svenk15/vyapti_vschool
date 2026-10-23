'use client';

import {useState} from 'react';
import {Avatar,Badge,Button} from '@/components/ui/primitives';
import {Dialog} from '@/components/ui/interactive';

type Assignment=Readonly<{assignmentId:string;subjectName:string;sectionName:string;validFrom:string;validTo:string;current:boolean}>;
const date=(value:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`));
const AssignmentsIcon=()=> <svg className="staff-section-action-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"/></svg>;

export function StaffAssignmentsAction({assignments,employeeName,staffNumber,eligibility,eligibilityPeriod}:{assignments:readonly Assignment[];employeeName:string;staffNumber:string;eligibility:'ENABLED'|'DISABLED'|'NOT_ENABLED';eligibilityPeriod:Readonly<{validFrom:string;validTo:string|null}>|null}){
 const [open,setOpen]=useState(false);
 const eligibilityLabel=eligibility==='ENABLED'?'Eligible to teach':eligibility==='DISABLED'?'Teaching disabled':'Not enabled for teaching';
 return <><Button className="staff-section-action" variant="ghost" size="small" onClick={()=>setOpen(true)}><AssignmentsIcon/>View assignments</Button><Dialog drawer className="staff-reference-drawer" title="Teaching assignments" open={open} onClose={()=>setOpen(false)}><div className="staff-assignments-drawer"><div className="staff-drawer-person"><Avatar name={employeeName}/><div className="staff-drawer-person-copy"><div className="staff-drawer-person-name">{employeeName}</div><div className="staff-drawer-person-number">{staffNumber}</div></div></div>{assignments.length?assignments.map(item=><div className="staff-assignment-row" key={item.assignmentId}><strong>{item.sectionName} · {item.subjectName}</strong><Badge tone="success">Active</Badge></div>):<p className="staff-assignment-empty">No current teaching assignments.</p>}<div className="staff-assignment-handoff"><p className="small muted">Assignment changes continue in Academics.</p><div><span><strong>{eligibilityLabel}</strong>{eligibilityPeriod?` · ${date(eligibilityPeriod.validFrom)} to ${eligibilityPeriod.validTo?date(eligibilityPeriod.validTo):'Current'}`:''}</span></div></div></div></Dialog></>;
}
