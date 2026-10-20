"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {ExistingPersonChoice,StudentProfile} from "@/shared/contracts/students";
import {Checkbox,SelectField,TextField} from "@/components/ui/forms";
import {Alert,Button,ButtonLink,Card,SectionHeader} from "@/components/ui/primitives";

type IdentityMode="NEW"|"PERSON_ID"|"ADMISSION_NUMBER";
type CreatedStudent=StudentProfile&Readonly<{replayed:boolean}>;
type RegistrationPayload=Readonly<{firstName:string;lastName:string;admissionNumber:string;admittedOn:string;existingPersonId:string|null;key:string}>;
type Failure=Error&{code?:string;status?:number;retryable?:boolean};

async function responseJson<T>(response:Response):Promise<T>{
  const result=await response.json();
  if(!response.ok)throw Object.assign(new Error(typeof result.message==="string"?result.message:"Student registration could not be completed."),{code:result.code,status:response.status,retryable:result.retryable}) as Failure;
  return result as T;
}

export function StudentRegistrationWorkflow({returnTo}:{returnTo:string}){
  const router=useRouter(),summary=useRef<HTMLDivElement>(null);
  const [mode,setMode]=useState<IdentityMode>("NEW"),[lookup,setLookup]=useState(""),[firstName,setFirstName]=useState(""),[lastName,setLastName]=useState(""),[admissionNumber,setAdmissionNumber]=useState(""),[admittedOn,setAdmittedOn]=useState(""),[choice,setChoice]=useState<ExistingPersonChoice|null>(null),[verified,setVerified]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[unknown,setUnknown]=useState(false),[recoveryStudentId,setRecoveryStudentId]=useState<string|null>(null),[attempt,setAttempt]=useState<RegistrationPayload|null>(null),[created,setCreated]=useState<CreatedStudent|null>(null);
  const locked=busy||attempt!==null;
  useEffect(()=>{if(error)summary.current?.focus();},[error]);

  function focusError(message:string){setError(message);}
  function resetResolution(){setChoice(null);setVerified(false);setRecoveryStudentId(null);setError("");setUnknown(false);}
  function changeMode(next:IdentityMode){setMode(next);setLookup("");resetResolution();}

  async function resolveIdentity(){
    setError("");setUnknown(false);setRecoveryStudentId(null);setVerified(false);setChoice(null);
    if(!lookup.trim()){focusError("Enter the exact school record reference.");return;}
    setBusy(true);
    try{
      const params=new URLSearchParams({kind:mode,value:lookup}),result=await responseJson<{item:ExistingPersonChoice}>(await fetch(`/api/v1/people/selection?${params}`,{cache:"no-store"}));
      setChoice(result.item);
      if(!result.item.eligibleForRegistration){setRecoveryStudentId(result.item.existingStudentId);focusError("That school record is already registered as a student in this branch.");}
    }catch(cause){focusError(cause instanceof Error?cause.message:"The exact school record could not be found.");}
    finally{setBusy(false);}
  }

  function validate(){
    if(mode==="NEW"&&!firstName.trim())return "Enter the student’s first name.";
    if(mode!=="NEW"&&!choice)return "Find and confirm the exact existing school record.";
    if(mode!=="NEW"&&!choice?.eligibleForRegistration)return "Choose an eligible existing school record.";
    if(mode!=="NEW"&&!verified)return "Confirm that the resolved school record is the intended student.";
    if(!admissionNumber.trim())return "Enter the branch admission number.";
    if(!admittedOn)return "Enter the verified branch admission date.";
    return "";
  }

  async function create(){
    const problem=validate();if(problem){focusError(problem);return;}
    const payload=attempt??{firstName:mode==="NEW"?firstName.trim():choice!.displayName,lastName:mode==="NEW"?lastName.trim():"",admissionNumber:admissionNumber.trim(),admittedOn,existingPersonId:choice?.personId??null,key:crypto.randomUUID()};
    setBusy(true);setError("");setUnknown(false);setRecoveryStudentId(null);
    try{
      const result=await responseJson<CreatedStudent>(await fetch("/api/v1/students",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":payload.key},body:JSON.stringify(payload)}));
      setAttempt(null);setCreated(result);router.refresh();
    }catch(cause){
      const failure=cause as Failure;
      if(failure.status===undefined||failure.status>=500||failure.retryable===true){setAttempt(payload);setUnknown(true);focusError("The registration outcome is unknown. Keep this page open and retry the exact retained request before changing any details.");}
      else{
        setAttempt(null);setUnknown(false);focusError(failure.message);
        if(failure.code==="CONFLICT")try{const result=await responseJson<{item:ExistingPersonChoice}>(await fetch(`/api/v1/people/selection?${new URLSearchParams({kind:"ADMISSION_NUMBER",value:admissionNumber})}`,{cache:"no-store"}));setRecoveryStudentId(result.item.existingStudentId);}catch{}
      }
    }finally{setBusy(false);}
  }

  if(created)return <Card className="receipt student-registration-receipt"><div className="success-mark" aria-hidden="true">✓</div><SectionHeader title="Student registered" description={created.replayed?"The existing confirmed registration was recovered without creating a duplicate.":"The student’s branch record is ready for the next school-office task."}/><dl className="branch-review"><div><dt>Student</dt><dd>{created.displayName}</dd></div><div><dt>Admission number</dt><dd>{created.admissionNumber}</dd></div><div><dt>Admission date</dt><dd>{created.admissionDate.value??admittedOn}</dd></div><div><dt>Identity record</dt><dd>{choice?`${choice.displayName} · ${choice.personId}`:"New school identity"}</dd></div></dl><div className="workflow-actions student-registration-next-actions"><ButtonLink href={returnTo} variant="secondary">Back to students</ButtonLink><ButtonLink href={`/admin/students/${created.studentId}`} variant="secondary">Open student record</ButtonLink><ButtonLink href={`/admin/students/${created.studentId}/enrollment?returnTo=${encodeURIComponent(`/admin/students/${created.studentId}`)}`} variant="secondary">Enroll student</ButtonLink><ButtonLink href={`/admin/students/${created.studentId}?section=access#family-access`}>Set up Parent access</ButtonLink></div></Card>;

  return <Card className="branch-edit-card student-registration-card">
    {error&&<div ref={summary} tabIndex={-1} className="student-registration-error"><Alert tone={unknown?"warning":"danger"} title={unknown?"Registration outcome unknown":"Registration not completed"}>{error}{recoveryStudentId&&<> <Link href={`/admin/students/${recoveryStudentId}`}>Open the existing permitted student record.</Link></>}</Alert></div>}
    <form onSubmit={event=>{event.preventDefault();void create();}} noValidate className="student-registration-page-form">
      <section className="student-registration-section">
        <SectionHeader title="Student details" description="Create a new school identity or use one exact record that your school is authorized to access."/>
        <div className="student-registration-fields">
          <SelectField label="Student record" width="person" value={mode} disabled={locked} onChange={event=>changeMode(event.target.value as IdentityMode)}><option value="NEW">New student</option><option value="PERSON_ID">Existing record — Person ID</option><option value="ADMISSION_NUMBER">Existing record — admission number</option></SelectField>
          {mode==="NEW"?<><TextField label="First name" width="person" required maxLength={100} autoComplete="given-name" value={firstName} disabled={locked} onChange={event=>setFirstName(event.target.value)}/><TextField label="Last name" width="person" maxLength={100} autoComplete="family-name" value={lastName} disabled={locked} onChange={event=>setLastName(event.target.value)}/></>:<div className="student-registration-lookup"><TextField label={mode==="PERSON_ID"?"Person ID":"Existing admission number"} width="code" required maxLength={mode==="PERSON_ID"?36:40} value={lookup} disabled={locked} onChange={event=>{setLookup(event.target.value);resetResolution();}} hint={mode==="PERSON_ID"?"Enter the exact Person ID from this institution.":"Enter the exact current-branch admission number."}/><Button type="button" variant="secondary" disabled={locked||!lookup.trim()} loading={busy} onClick={()=>void resolveIdentity()}>Find record</Button></div>}
        </div>
        {choice?.eligibleForRegistration&&<div className="student-registration-match"><div><span className="eyebrow">Resolved school record</span><strong>{choice.displayName}</strong><code>{choice.personId}</code></div><Checkbox label="I confirm this is the intended student." checked={verified} disabled={locked} onChange={event=>setVerified(event.target.checked)}/></div>}
      </section>
      <section className="student-registration-section">
        <SectionHeader title="School record" description="Use the verified date this student first entered this branch. Enrollment and class placement are completed separately."/>
        <div className="student-registration-fields student-registration-school-fields"><TextField label="Admission number" width="code" required maxLength={40} value={admissionNumber} disabled={locked} onChange={event=>setAdmissionNumber(event.target.value)} hint="Unique within this branch. Leading zeros are preserved."/><TextField label="Branch admission date" width="date" required type="date" value={admittedOn} disabled={locked} onChange={event=>setAdmittedOn(event.target.value)}/></div>
      </section>
      <div className="workflow-actions"><ButtonLink href={returnTo} variant="secondary">Cancel</ButtonLink><Button type="submit" size="consequence" loading={busy}>{attempt?"Retry exact registration":"Register student"}</Button></div>
    </form>
  </Card>;
}
