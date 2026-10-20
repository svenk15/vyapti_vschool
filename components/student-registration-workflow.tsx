"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {ExistingPersonChoice,StudentProfile,StudentRegistrationCommand,StudentRegistrationNextActions,StudentRegistrationStatus} from "@/shared/contracts/students";
import {Checkbox,SelectField,TextField} from "@/components/ui/forms";
import {Alert,Button,ButtonLink,Card,SectionHeader} from "@/components/ui/primitives";

type IdentityMode="NEW"|"PERSON_ID"|"ADMISSION_NUMBER";
type CreatedStudent=StudentProfile&Readonly<{replayed:boolean}>;
type FieldKey="identity"|"firstName"|"lastName"|"admissionNumber"|"admittedOn";
type FieldErrors=Partial<Record<FieldKey,string>>;
type Failure=Error&{code?:string;status?:number;retryable?:boolean;fieldErrors?:FieldErrors};

async function responseJson<T>(response:Response):Promise<T>{
  const result=await response.json();
  if(!response.ok)throw Object.assign(new Error(typeof result.message==="string"?result.message:"Student registration could not be completed."),{code:result.code,status:response.status,retryable:result.retryable,fieldErrors:result.fieldErrors}) as Failure;
  return result as T;
}

function validCivilDate(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const [year,month,day]=value.split("-").map(Number),date=new Date(Date.UTC(year,month-1,day));return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day;}

export function StudentRegistrationWorkflow({returnTo,schoolToday,schoolTimezone,pendingOperationKey}:{returnTo:string;schoolToday:string;schoolTimezone:string;pendingOperationKey?:string}){
  const router=useRouter(),summary=useRef<HTMLDivElement>(null);
  const [mode,setMode]=useState<IdentityMode>("NEW"),[lookup,setLookup]=useState(""),[firstName,setFirstName]=useState(""),[lastName,setLastName]=useState(""),[admissionNumber,setAdmissionNumber]=useState(""),[admittedOn,setAdmittedOn]=useState(""),[choice,setChoice]=useState<ExistingPersonChoice|null>(null),[verified,setVerified]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[fieldErrors,setFieldErrors]=useState<FieldErrors>({}),[unknown,setUnknown]=useState(false),[recoveryStudentId,setRecoveryStudentId]=useState<string|null>(null),[attempt,setAttempt]=useState<StudentRegistrationCommand|null>(null),[pendingKey,setPendingKey]=useState(pendingOperationKey??null),[checking,setChecking]=useState(false),[recoveryChecked,setRecoveryChecked]=useState(false),[created,setCreated]=useState<CreatedStudent|null>(null),[actions,setActions]=useState<StudentRegistrationNextActions|null>(null);
  const locked=busy||attempt!==null,guarded=!created&&(attempt!==null||pendingKey!==null),hasErrors=Boolean(error||Object.keys(fieldErrors).length);

  useEffect(()=>{if(hasErrors)summary.current?.focus();},[hasErrors]);
  useEffect(()=>{if(!created)return;let active=true;void fetch(`/api/v1/students/${created.studentId}/registration-actions`,{cache:"no-store"}).then(response=>responseJson<StudentRegistrationNextActions>(response)).then(value=>{if(active)setActions(value);}).catch(()=>{if(active)setActions({canOpenRecord:false,canEnroll:false,canSetUpParentAccess:false});});return()=>{active=false;};},[created]);
  useEffect(()=>{if(pendingOperationKey)void checkStatus(pendingOperationKey);/* initial locator only */},[]);// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{
    if(!guarded)return;
    const warning="This registration may still complete. Leave only if you are ready to check its result later.";
    let leaving=false;
    const beforeUnload=(event:BeforeUnloadEvent)=>{if(leaving)return;event.preventDefault();event.returnValue="";};
    const click=(event:MouseEvent)=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const target=event.target;if(!(target instanceof Element))return;const anchor=target.closest("a");if(!(anchor instanceof HTMLAnchorElement)||anchor.origin!==location.origin)return;if(!window.confirm(warning))event.preventDefault();else leaving=true;};
    const submit=(event:SubmitEvent)=>{const form=event.target;if(!(form instanceof HTMLFormElement)||form.classList.contains("student-registration-page-form"))return;if(!window.confirm(warning))event.preventDefault();else leaving=true;};
    const guardedUrl=location.href;history.pushState({...history.state,vschoolRegistrationGuard:true},"",guardedUrl);
    const pop=()=>{if(window.confirm(warning)){leaving=true;removeEventListener("popstate",pop);history.back();}else history.forward();};
    addEventListener("beforeunload",beforeUnload);addEventListener("popstate",pop);document.addEventListener("click",click);document.addEventListener("submit",submit);
    return()=>{removeEventListener("beforeunload",beforeUnload);removeEventListener("popstate",pop);document.removeEventListener("click",click);document.removeEventListener("submit",submit);};
  },[guarded]);

  function locator(key:string|null){setPendingKey(key);const url=new URL(location.href);if(key)url.searchParams.set("pendingRegistration",key);else url.searchParams.delete("pendingRegistration");history.replaceState(history.state,"",`${url.pathname}${url.search}${url.hash}`);}
  function clearField(field:FieldKey){if(fieldErrors[field])setFieldErrors(current=>{const next={...current};delete next[field];return next;});if(error)setError("");}
  function resetResolution(){setChoice(null);setVerified(false);setRecoveryStudentId(null);clearField("identity");setUnknown(false);}
  function changeMode(next:IdentityMode){setMode(next);setLookup("");resetResolution();}

  async function resolveIdentity(){
    setError("");setUnknown(false);setRecoveryStudentId(null);setVerified(false);setChoice(null);
    if(!lookup.trim()){setFieldErrors({identity:"Enter the exact school record reference."});return;}
    setFieldErrors(current=>{const next={...current};delete next.identity;return next;});setBusy(true);
    try{const params=new URLSearchParams({kind:mode,value:lookup}),result=await responseJson<{item:ExistingPersonChoice}>(await fetch(`/api/v1/people/selection?${params}`,{cache:"no-store"}));setChoice(result.item);if(!result.item.eligibleForRegistration){setRecoveryStudentId(result.item.existingStudentId);setFieldErrors({identity:"That school record is already registered as a student in this branch."});}}
    catch(cause){setFieldErrors({identity:cause instanceof Error?cause.message:"The exact school record could not be found."});}
    finally{setBusy(false);}
  }

  function validate():FieldErrors{
    const problems:FieldErrors={};
    if(mode==="NEW"&&!firstName.trim())problems.firstName="Enter the student’s first name.";
    if(mode!=="NEW"&&!choice)problems.identity="Find the exact existing school record.";
    else if(mode!=="NEW"&&!choice?.eligibleForRegistration)problems.identity="Choose an eligible existing school record.";
    else if(mode!=="NEW"&&!verified)problems.identity="Confirm that the resolved school record is the intended student.";
    if(!admissionNumber.trim())problems.admissionNumber="Enter the branch admission number.";
    if(!validCivilDate(admittedOn))problems.admittedOn="Enter a valid branch admission date.";
    else if(admittedOn>schoolToday)problems.admittedOn=`Use ${schoolToday} or an earlier date in ${schoolTimezone}.`;
    return problems;
  }

  async function create(){
    const problems=validate();if(Object.keys(problems).length){setFieldErrors(problems);setError("");return;}
    const payload=attempt??{identity:mode==="NEW"?{kind:"NEW" as const,firstName:firstName.trim(),lastName:lastName.trim()}:{kind:"EXISTING" as const,personId:choice!.personId},admissionNumber:admissionNumber.trim(),admittedOn,key:crypto.randomUUID()};
    setAttempt(payload);locator(payload.key);setBusy(true);setError("");setFieldErrors({});setUnknown(false);setRecoveryStudentId(null);
    try{const result=await responseJson<CreatedStudent>(await fetch("/api/v1/students",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":payload.key},body:JSON.stringify(payload)}));setAttempt(null);locator(null);setCreated(result);router.refresh();}
    catch(cause){const failure=cause as Failure;if(failure.status===undefined||failure.status>=500||failure.retryable===true){setUnknown(true);setError("The registration result is not confirmed. Retry the unchanged request here, or check this operation after returning to the page.");}else{setAttempt(null);locator(null);setUnknown(false);if(failure.fieldErrors&&Object.keys(failure.fieldErrors).length)setFieldErrors(failure.fieldErrors);else setError(failure.message);if(failure.code==="CONFLICT")try{const result=await responseJson<{item:ExistingPersonChoice}>(await fetch(`/api/v1/people/selection?${new URLSearchParams({kind:"ADMISSION_NUMBER",value:admissionNumber})}`,{cache:"no-store"}));setRecoveryStudentId(result.item.existingStudentId);}catch{}}}
    finally{setBusy(false);}
  }

  async function checkStatus(key=pendingKey){if(!key)return;setChecking(true);setError("");setFieldErrors({});try{const result=await responseJson<StudentRegistrationStatus>(await fetch(`/api/v1/students/registration-status?${new URLSearchParams({key})}`,{cache:"no-store"}));setRecoveryChecked(true);if(result.status==="FOUND"){setAttempt(null);locator(null);setCreated(result.student);}else{setUnknown(true);setError("No committed registration is available yet. This does not prove that the original request failed.");}}catch(cause){const failure=cause as Failure;setError(failure.status===401?"Sign in again to check this registration. The school record, if committed, has not been removed.":failure.status===403?"Your current access no longer permits this registration result to be viewed.":failure.message);}finally{setChecking(false);}}

  if(created){const primary=actions?.canEnroll?"enroll":actions?.canSetUpParentAccess?"parent":"open";return <Card className="receipt student-registration-receipt"><div className="success-mark" aria-hidden="true">✓</div><SectionHeader title="Student registered" description={created.replayed?"The confirmed registration was recovered without creating a duplicate.":"The branch student record is saved. Enrollment and access are separate school-office tasks."}/><dl className="branch-review"><div><dt>Student</dt><dd>{created.displayName}</dd></div><div><dt>Admission number</dt><dd>{created.admissionNumber}</dd></div><div><dt>Admission date</dt><dd>{created.admissionDate.value}</dd></div><div><dt>Identity record</dt><dd>{created.displayName} · {created.personId}</dd></div></dl><div className="workflow-actions student-registration-next-actions"><ButtonLink href={returnTo} variant="secondary">Back to students</ButtonLink>{!actions&&<span role="status" className="small muted">Checking available next actions…</span>}{actions?.canOpenRecord&&<ButtonLink href={`/admin/students/${created.studentId}`} variant={primary==="open"?"primary":"secondary"}>Open student record</ButtonLink>}{actions?.canEnroll&&<ButtonLink href={`/admin/students/${created.studentId}/enrollment?returnTo=${encodeURIComponent(`/admin/students/${created.studentId}`)}`} variant={primary==="enroll"?"primary":"secondary"}>Enroll student</ButtonLink>}{actions?.canSetUpParentAccess&&<ButtonLink href={`/admin/students/${created.studentId}?section=access#family-access`} variant={primary==="parent"?"primary":"secondary"}>Set up Parent access</ButtonLink>}</div></Card>;}

  if(pendingKey&&!attempt)return <Card className="branch-edit-card student-registration-card student-registration-recovery"><SectionHeader title="Check registration result" description="Only the operation reference is retained. Student details are not stored in this browser."/>{error&&<div ref={summary} tabIndex={-1}><Alert tone={error.includes("does not prove")?"warning":"danger"} title={error.includes("does not prove")?"Result still unknown":"Result unavailable"}>{error}</Alert></div>}<p className="muted">A status check reauthorizes your current account and branch. It never repeats the registration automatically.</p><div className="workflow-actions"><ButtonLink href={returnTo} variant="secondary">Back to students</ButtonLink><Button variant="secondary" loading={checking} onClick={()=>void checkStatus()}>Check status{recoveryChecked?" again":""}</Button><Button variant="ghost" disabled={checking} onClick={()=>{if(window.confirm("The earlier result will remain unknown. Starting again cannot cancel it.")){locator(null);setUnknown(false);setError("");setRecoveryChecked(false);}}}>Start a separate registration</Button></div></Card>;

  const summaries=Object.entries(fieldErrors).filter((entry):entry is [FieldKey,string]=>Boolean(entry[1]));
  return <Card className="branch-edit-card student-registration-card">
    {hasErrors&&<div ref={summary} tabIndex={-1} className="student-registration-error"><Alert tone={unknown?"warning":"danger"} title={unknown?"Registration result unknown":"Registration not completed"}>{error||"Correct the highlighted fields."}{summaries.length>0&&<ul className="student-registration-error-links">{summaries.map(([field,message])=><li key={field}><a href={`#registration-${field}`}>{message}</a></li>)}</ul>}{recoveryStudentId&&<> <Link href={`/admin/students/${recoveryStudentId}`}>Open the existing permitted student record.</Link></>}</Alert></div>}
    <form onSubmit={event=>{event.preventDefault();void create();}} noValidate className="student-registration-page-form">
      <section className="student-registration-section">
        <SectionHeader title="Student details"/>
        <div className="student-registration-fields">
          <SelectField id="registration-record-mode" label="Student record" width="person" value={mode} disabled={locked} onChange={event=>changeMode(event.target.value as IdentityMode)}><option value="NEW">New student</option><option value="PERSON_ID">Existing record — Person ID</option><option value="ADMISSION_NUMBER">Existing record — admission number</option></SelectField>
          {mode==="NEW"?<><TextField id="registration-firstName" label="First name" width="person" required maxLength={100} autoComplete="given-name" value={firstName} disabled={locked} error={fieldErrors.firstName} onChange={event=>{setFirstName(event.target.value);clearField("firstName");}}/><TextField id="registration-lastName" label="Last name" width="person" maxLength={100} autoComplete="family-name" value={lastName} disabled={locked} error={fieldErrors.lastName} onChange={event=>{setLastName(event.target.value);clearField("lastName");}}/></>:<div className="student-registration-lookup"><TextField id="registration-identity" label={mode==="PERSON_ID"?"Person ID":"Existing admission number"} width="code" required maxLength={mode==="PERSON_ID"?36:40} value={lookup} disabled={locked} error={fieldErrors.identity} onChange={event=>{setLookup(event.target.value);resetResolution();}} hint={mode==="PERSON_ID"?"Enter the exact Person ID from this institution.":"Enter the exact admission number in this branch."}/><Button type="button" variant="secondary" disabled={locked||!lookup.trim()} loading={busy} onClick={()=>void resolveIdentity()}>Find record</Button></div>}
        </div>
        {choice?.eligibleForRegistration&&<div className="student-registration-match"><div><span className="eyebrow">School record found</span><strong>{choice.displayName}</strong><code>{choice.personId}</code></div><Checkbox label="I confirm this is the intended student." checked={verified} disabled={locked} aria-invalid={Boolean(fieldErrors.identity)||undefined} onChange={event=>{setVerified(event.target.checked);clearField("identity");}}/></div>}
      </section>
      <section className="student-registration-section">
        <SectionHeader title="School record"/>
        <div className="student-registration-fields student-registration-school-fields"><TextField id="registration-admissionNumber" label="Admission number" width="code" required maxLength={40} value={admissionNumber} disabled={locked} error={fieldErrors.admissionNumber} onChange={event=>{setAdmissionNumber(event.target.value);clearField("admissionNumber");}} hint="Unique in this branch. Leading zeros are kept."/><TextField id="registration-admittedOn" label="Branch admission date" width="date" required type="date" max={schoolToday} value={admittedOn} disabled={locked} error={fieldErrors.admittedOn} onChange={event=>{setAdmittedOn(event.target.value);clearField("admittedOn");}} hint={`The verified date the student first entered this branch · ${schoolTimezone}.`}/></div>
      </section>
      <div className="workflow-actions"><ButtonLink href={returnTo} variant="secondary">Cancel</ButtonLink><Button type="submit" size="consequence" loading={busy}>{attempt?"Retry exact registration":"Register student"}</Button></div>
    </form>
  </Card>;
}
