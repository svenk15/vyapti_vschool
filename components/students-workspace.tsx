'use client';
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import type {ExistingPersonChoice,StudentWorkspace} from '@/shared/contracts/students';
import type {AdminHome} from '@/shared/contracts/access';
import {TextField} from '@/components/ui/forms';
import {Alert,Badge,Button,Card,EmptyState,PageHeader} from '@/components/ui/primitives';
import {ServerTable} from '@/components/ui/server-table';
import {ListToolbar} from '@/components/portal/list-toolbar';
import {FilterDrawer,type FilterSelection} from '@/components/portal/filter-drawer';

type StudentStatus='ACTIVE'|'ARCHIVED'|'ALL';
async function json<T>(response:Response):Promise<T>{const value=await response.json();if(!response.ok)throw new Error(typeof value.message==='string'?value.message:'Student request could not be completed.');return value as T;}

export function StudentsWorkspace({initial,home,initialSearch,initialStatus}:{initial:StudentWorkspace;home:AdminHome;initialSearch:string;initialStatus:StudentStatus}){
 const router=useRouter(),[navigating,startNavigation]=useTransition(),[data,setData]=useState(initial),[search,setSearch]=useState(initialSearch),[filterOpen,setFilterOpen]=useState(false),[firstName,setFirstName]=useState(''),[lastName,setLastName]=useState(''),[admissionNumber,setAdmissionNumber]=useState(''),[exactName,setExactName]=useState(''),[choices,setChoices]=useState<readonly ExistingPersonChoice[]>([]),[selectedPersonId,setSelectedPersonId]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[failed,setFailed]=useState(false);
 const unavailable=busy||navigating;
 function runSearch(value=search,status=initialStatus){const normalized=value.normalize('NFC').trim().slice(0,100),params=new URLSearchParams();if(normalized)params.set('search',normalized);if(status!=='ACTIVE')params.set('status',status);startNavigation(()=>router.push(`/admin/students${params.size?`?${params}`:''}`));}
 async function loadMore(){if(!data.nextCursor)return;setBusy(true);setMessage('');setFailed(false);try{const params=new URLSearchParams({search:initialSearch,status:initialStatus,cursor:data.nextCursor});const result=await json<StudentWorkspace>(await fetch(`/api/v1/students?${params}`,{cache:'no-store'}));setData(current=>({...result,items:[...current.items,...result.items]}));}catch(error){setFailed(true);setMessage(error instanceof Error?error.message:'More students could not be loaded. Try again.');}finally{setBusy(false);}}
 async function findPerson(){setBusy(true);setMessage('');setFailed(false);setSelectedPersonId('');try{const result=await json<{items:readonly ExistingPersonChoice[]}>(await fetch(`/api/v1/people/selection?q=${encodeURIComponent(exactName)}`,{cache:'no-store'}));setChoices(result.items);if(!result.items.length)setMessage('No exact Person name matched. This search does not create or link a Person.');}catch(error){setFailed(true);setMessage(error instanceof Error?error.message:'Existing Person choices could not be loaded.');}finally{setBusy(false);}}
 async function create(){setBusy(true);setMessage('');setFailed(false);try{const key=crypto.randomUUID(),response=await fetch('/api/v1/students',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify({firstName,lastName,admissionNumber,existingPersonId:selectedPersonId||null,key})}),result=await json<{studentId:string}>(response);router.push(`/admin/students/${result.studentId}`);router.refresh();}catch(error){setFailed(true);setMessage(error instanceof Error?error.message:'Student registration failed. Retry with a new request.');}finally{setBusy(false);}}
 function applyFilters(selection:FilterSelection){const candidate=selection.status?.[0],status:StudentStatus=candidate==='ARCHIVED'||candidate==='ALL'?candidate:'ACTIVE';runSearch(search,status);}
 return <>
  <PageHeader eyebrow={`${home.institutionName} · ${home.schoolName}`} title="Students" description="Register branch students and inspect their school identity."/>
  {message&&<div role={failed?'alert':'status'} aria-live="polite" aria-label="Student feedback"><Alert tone={failed?'danger':'info'} title={failed?'Request not completed':'Student lookup'}>{message}</Alert></div>}
  <div className="two-columns section-space">
   <Card className="padded">
    <h2>Register student</h2><p className="muted small">A new Person is created by default. Reuse an existing Person only after an exact name lookup and your explicit selection. Names and admission numbers do not identify the same person automatically.</p>
    <div className="control-stack">
     <TextField label="First name" required maxLength={100} autoComplete="given-name" value={firstName} onChange={event=>setFirstName(event.target.value)}/>
     <TextField label="Last name" maxLength={100} autoComplete="family-name" value={lastName} onChange={event=>setLastName(event.target.value)}/>
     <TextField label="Admission number" required maxLength={40} value={admissionNumber} onChange={event=>setAdmissionNumber(event.target.value)} hint="Leading zeros are preserved."/>
     <fieldset className="control-stack"><legend>Existing Person (optional)</legend><TextField label="Exact full name" maxLength={100} value={exactName} onChange={event=>setExactName(event.target.value)} hint="Searches this institution for exact full-name matches only."/><Button type="button" variant="secondary" disabled={unavailable||exactName.trim().length<2} onClick={()=>void findPerson()}>Find exact Person</Button>
      {choices.length>0&&<div className="control-stack" aria-label="Exact Person choices">{choices.map(choice=><label key={choice.personId} className="choice-row"><input type="radio" name="existingPerson" value={choice.personId} checked={selectedPersonId===choice.personId} onChange={()=>setSelectedPersonId(choice.personId)}/><span>{choice.displayName}</span></label>)}</div>}
      {selectedPersonId&&<Button type="button" size="small" variant="ghost" onClick={()=>setSelectedPersonId('')}>Use a new Person instead</Button>}
     </fieldset>
     <Button disabled={unavailable||!firstName.trim()||!admissionNumber.trim()} loading={busy} onClick={()=>void create()}>Register student</Button>
    </div>
   </Card>
   <Card className="directory-card">
    <div className="directory-heading"><div><h2>Students in this branch</h2><p className="muted small">Search matches admission number or name. It does not select an existing Person.</p></div><Badge>{data.items.length} shown</Badge></div>
    <ListToolbar attributes={[{value:'student',label:'Name or admission',placeholder:'Search students'}]} selectedAttribute="student" draftText={search} appliedSearch={initialSearch} onAttributeChange={()=>{}} onDraftTextChange={setSearch} onCommitSearch={value=>runSearch(value)} filterCount={initialStatus==='ALL'?0:1} onOpenFilters={()=>setFilterOpen(true)} busy={unavailable} inputLabel="Search students"/>
    {data.items.length===0?<EmptyState title={initialSearch?'No matching students':'No students registered'} description={initialSearch?'Try another name or admission number.':'Register a student to start this branch’s student directory.'} icon="people"/>:<ServerTable caption="Registered students in the current branch" rows={data.items} rowKey={student=>student.studentId} columns={[{key:'admission',label:'Admission number',rowHeader:true,render:student=>student.admissionNumber},{key:'name',label:'Name',render:student=>student.displayName},{key:'status',label:'Status',render:student=>student.status},{key:'enrollment',label:'Enrollment',render:student=>student.enrollment?`${student.enrollment.yearCode} · ${student.enrollment.yearName}`:'Not enrolled'},{key:'view',label:'View',render:student=><Link className="btn btn-ghost btn-small" href={`/admin/students/${student.studentId}`} aria-label={`View ${student.displayName}`}>View</Link>}]}/>}
    {data.nextCursor&&<div className="directory-footer"><Button type="button" variant="secondary" disabled={unavailable} onClick={()=>void loadMore()}>Load more students</Button></div>}
   </Card>
  </div>
  <FilterDrawer open={filterOpen} onClose={()=>setFilterOpen(false)} attributes={[{id:'status',label:'Student status',mode:'single',options:[{value:'ACTIVE',label:'Active students'},{value:'ARCHIVED',label:'Archived students'},{value:'ALL',label:'All statuses'}]}]} applied={{status:[initialStatus]}} onApply={applyFilters}/>
 </>;
}
