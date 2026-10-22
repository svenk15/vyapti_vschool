'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/primitives';
import {Dialog} from '@/components/ui/interactive';

type Assignment=Readonly<{assignmentId:string;subjectName:string;sectionName:string;validFrom:string;validTo:string;current:boolean}>;
const date=(value:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`));

export function StaffAssignmentsAction({assignments}:{assignments:readonly Assignment[]}){
 const [open,setOpen]=useState(false);
 return <><Button variant="ghost" size="small" onClick={()=>setOpen(true)}>View assignments <span aria-hidden="true">→</span></Button><Dialog drawer title="Teaching assignments" open={open} onClose={()=>setOpen(false)}><div className="staff-assignments-drawer">{assignments.map(item=><div className="staff-assignment-row" key={item.assignmentId}><div><strong>{item.sectionName} · {item.subjectName}</strong><span>{date(item.validFrom)} to {date(item.validTo)}</span></div><span className="quiet-status">Active</span></div>)}<p className="small muted">Assignment changes continue in Academics.</p><div className="drawer-actions"><Button variant="secondary" onClick={()=>setOpen(false)}>Close</Button></div></div></Dialog></>;
}
