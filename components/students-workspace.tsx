"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ExistingPersonChoice, StudentWorkspace } from "@/shared/contracts/students";
import { SelectField,TextField } from "@/components/ui/forms";
import { Alert, Badge, Button, ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui/primitives";

async function json<T>(response:Response):Promise<T>{const value=await response.json();if(!response.ok)throw new Error(typeof value.message==="string"?value.message:"Student request could not be completed.");return value as T;}

export function StudentsWorkspace({initial,institutionName,schoolName}:{initial:StudentWorkspace;institutionName:string;schoolName:string}){
  const router=useRouter(),[data,setData]=useState(initial),[search,setSearch]=useState(""),[appliedSearch,setAppliedSearch]=useState(""),[status,setStatus]=useState<"ACTIVE"|"ARCHIVED"|"ALL">("ACTIVE"),[appliedStatus,setAppliedStatus]=useState<"ACTIVE"|"ARCHIVED"|"ALL">("ACTIVE"),[firstName,setFirstName]=useState(""),[lastName,setLastName]=useState(""),[admissionNumber,setAdmissionNumber]=useState(""),[exactName,setExactName]=useState(""),[choices,setChoices]=useState<readonly ExistingPersonChoice[]>([]),[selectedPersonId,setSelectedPersonId]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[failed,setFailed]=useState(false);
  async function runSearch(value=search){setBusy(true);setMessage("");setFailed(false);try{const params=new URLSearchParams({search:value,status});const result=await json<StudentWorkspace>(await fetch(`/api/v1/students?${params}`,{cache:"no-store"}));setData(result);setAppliedSearch(value);setAppliedStatus(status);}catch(error){setFailed(true);setMessage(error instanceof Error?error.message:"Students could not be loaded. Try again.");}finally{setBusy(false);}}
  async function loadMore(){if(!data.nextCursor)return;setBusy(true);setMessage("");setFailed(false);try{const params=new URLSearchParams({search:appliedSearch,status:appliedStatus,cursor:data.nextCursor});const result=await json<StudentWorkspace>(await fetch(`/api/v1/students?${params}`,{cache:"no-store"}));setData(current=>({...result,items:[...current.items,...result.items]}));}catch(error){setFailed(true);setMessage(error instanceof Error?error.message:"More students could not be loaded. Try again.");}finally{setBusy(false);}}
  async function findPerson(){setBusy(true);setMessage("");setFailed(false);setSelectedPersonId("");try{const result=await json<{items:readonly ExistingPersonChoice[]}>(await fetch(`/api/v1/people/selection?q=${encodeURIComponent(exactName)}`,{cache:"no-store"}));setChoices(result.items);if(!result.items.length)setMessage("No exact Person name matched. This search does not create or link a Person.");}catch(error){setFailed(true);setMessage(error instanceof Error?error.message:"Existing Person choices could not be loaded.");}finally{setBusy(false);}}
  async function create(){setBusy(true);setMessage("");setFailed(false);try{const key=crypto.randomUUID(),response=await fetch("/api/v1/students",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify({firstName,lastName,admissionNumber,existingPersonId:selectedPersonId||null,key})}),result=await json<{studentId:string}>(response);router.push(`/admin/students/${result.studentId}`);router.refresh();}catch(error){setFailed(true);setMessage(error instanceof Error?error.message:"Student registration failed. Retry with a new request.");}finally{setBusy(false);}}
  return <>
    <PageHeader eyebrow={`${institutionName} · ${schoolName}`} title="Students" description="Register branch students and inspect their school identity." actions={<ButtonLink href="/admin" variant="secondary">School home</ButtonLink>}/>
    {message&&<div role={failed?"alert":"status"} aria-live="polite" aria-label="Student feedback"><Alert tone={failed?"danger":"info"} title={failed?"Request not completed":"Student lookup"}>{message}</Alert></div>}
    <div className="two-columns section-space">
      <Card className="padded">
        <h2>Register student</h2><p className="muted small">A new Person is created by default. Reuse an existing Person only after an exact name lookup and your explicit selection. Names and admission numbers do not identify the same person automatically.</p>
        <div className="control-stack">
          <TextField label="First name" required maxLength={100} autoComplete="given-name" value={firstName} onChange={event=>setFirstName(event.target.value)}/>
          <TextField label="Last name" maxLength={100} autoComplete="family-name" value={lastName} onChange={event=>setLastName(event.target.value)}/>
          <TextField label="Admission number" required maxLength={40} value={admissionNumber} onChange={event=>setAdmissionNumber(event.target.value)} hint="Leading zeros are preserved."/>
          <fieldset className="control-stack"><legend>Existing Person (optional)</legend><TextField label="Exact full name" maxLength={100} value={exactName} onChange={event=>setExactName(event.target.value)} hint="Searches this institution for exact full-name matches only."/><Button type="button" variant="secondary" disabled={busy||exactName.trim().length<2} onClick={()=>void findPerson()}>Find exact Person</Button>
            {choices.length>0&&<div className="control-stack" aria-label="Exact Person choices">{choices.map(choice=><label key={choice.personId} className="choice-row"><input type="radio" name="existingPerson" value={choice.personId} checked={selectedPersonId===choice.personId} onChange={()=>setSelectedPersonId(choice.personId)}/><span>{choice.displayName}</span></label>)}</div>}
            {selectedPersonId&&<Button type="button" size="small" variant="ghost" onClick={()=>setSelectedPersonId("")}>Use a new Person instead</Button>}
          </fieldset>
          <Button disabled={busy||!firstName.trim()||!admissionNumber.trim()} loading={busy} onClick={()=>void create()}>Register student</Button>
        </div>
      </Card>
      <Card className="padded">
        <div className="spread"><div><h2>Students in this branch</h2><p className="muted small">Search matches admission number or name. It does not select an existing Person.</p></div><Badge>{data.items.length} shown</Badge></div>
        <div className="two-columns"><TextField label="Search students" maxLength={100} value={search} onChange={event=>setSearch(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();void runSearch();}}}/><SelectField label="Student status" value={status} onChange={event=>setStatus(event.target.value as "ACTIVE"|"ARCHIVED"|"ALL")}><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option><option value="ALL">All statuses</option></SelectField><Button type="button" variant="secondary" disabled={busy} onClick={()=>void runSearch()}>Search students</Button></div>
        {data.items.length===0?<EmptyState title={appliedSearch?"No matching students":"No students registered"} description={appliedSearch?"Try another name or admission number.":"Register a student to start this branch’s student directory."}/>:<div className="table-scroll"><table className="data-table"><caption>Registered students in the current branch</caption><thead><tr><th scope="col">Admission number</th><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Enrollment</th></tr></thead><tbody>{data.items.map(student=><tr key={student.studentId}><td><Link href={`/admin/students/${student.studentId}`}>{student.admissionNumber}</Link></td><td>{student.displayName}</td><td>{student.status}</td><td>{student.enrollment?`${student.enrollment.yearCode} · ${student.enrollment.yearName}`:"Not enrolled"}</td></tr>)}</tbody></table></div>}
        {data.nextCursor&&<div className="section-space"><Button type="button" variant="secondary" disabled={busy} onClick={()=>void loadMore()}>Load more students</Button></div>}
      </Card>
    </div>
  </>;
}
