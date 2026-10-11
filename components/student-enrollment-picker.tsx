"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import type {StudentWorkspace} from "@/shared/contracts/students";
import {SelectField,TextField} from "@/components/ui/forms";
import {Alert,Button,Card,SectionHeader} from "@/components/ui/primitives";

type SearchBy="name"|"admissionNumber";

async function readWorkspace(response:Response){
  const value=await response.json();
  if(!response.ok)throw new Error(typeof value.message==="string"?value.message:"Students could not be loaded.");
  return value as StudentWorkspace;
}

export function StudentEnrollmentPicker({initial,returnTo}:{initial:StudentWorkspace;returnTo:string}){
  const router=useRouter(),[data,setData]=useState(initial),[studentId,setStudentId]=useState(""),[searchBy,setSearchBy]=useState<SearchBy>("name"),[search,setSearch]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");

  async function load({cursor,replace=false}:{cursor?:string;replace?:boolean}={}){
    setBusy(true);setError("");
    try{
      const normalized=search.normalize("NFC").trim().slice(0,100),params=new URLSearchParams({status:"ACTIVE",sort:"name",order:"asc",limit:"100"});
      if(normalized){params.set("search",normalized);params.set("by",searchBy);}
      if(cursor)params.set("cursor",cursor);
      const result=await readWorkspace(await fetch(`/api/v1/students?${params}`,{cache:"no-store"}));
      setData(current=>replace?result:{...result,items:[...current.items,...result.items]});
      if(replace)setStudentId("");
    }catch(cause){setError(cause instanceof Error?cause.message:"Students could not be loaded.");}
    finally{setBusy(false);}
  }

  return <div className="branch-edit-grid student-enrollment-grid">
    <Card className="branch-edit-card student-enrollment-card">
      <SectionHeader title="Enrollment" description="Choose an active student before selecting an open academic year."/>
      <form className="student-enrollment-search" onSubmit={event=>{event.preventDefault();void load({replace:true});}}>
        <SelectField label="Search by" value={searchBy} disabled={busy} onChange={event=>setSearchBy(event.target.value==="admissionNumber"?"admissionNumber":"name")}><option value="name">Student name</option><option value="admissionNumber">Admission number</option></SelectField>
        <TextField label="Find student" value={search} maxLength={100} disabled={busy} onChange={event=>setSearch(event.target.value)} placeholder={searchBy==="admissionNumber"?"Enter admission number":"Enter student name"}/>
        <Button type="submit" variant="secondary" disabled={busy} loading={busy}>Search</Button>
      </form>
      {error&&<Alert tone="danger" title="Student search unavailable">{error}</Alert>}
      <SelectField label="Student" required value={studentId} disabled={busy} onChange={event=>setStudentId(event.target.value)}><option value="">Choose a student</option>{data.items.map(student=><option key={student.studentId} value={student.studentId}>{student.displayName} · {student.admissionNumber}</option>)}</SelectField>
      {data.nextCursor&&<div className="directory-footer"><Button type="button" variant="secondary" disabled={busy} loading={busy} onClick={()=>void load({cursor:data.nextCursor??undefined})}>Load more students</Button></div>}
      <div className="workflow-actions"><Button variant="secondary" onClick={()=>router.push(returnTo)}>Cancel</Button><Button disabled={!studentId||busy} onClick={()=>router.push(`/admin/students/${studentId}/enrollment?returnTo=${encodeURIComponent(returnTo)}`)}>Continue <span aria-hidden="true">→</span></Button></div>
    </Card>
    <aside className="branch-edit-aside"><Card className="padded"><h2>What this changes</h2><p>The selected Student remains fixed while the enrollment and dated class placement are reviewed.</p><div className="section-divider"/><h3>Before you continue</h3><p>Search and paging use the authorized current-branch Student directory. They never perform Person identity matching.</p></Card></aside>
  </div>;
}
