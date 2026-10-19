"use client";

import {useEffect,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {EnrollmentOptions,EnrollmentResult} from "@/shared/contracts/students";
import {Checkbox,SelectField,TextField} from "@/components/ui/forms";
import {Alert,Button,ButtonLink,Card,SectionHeader} from "@/components/ui/primitives";

type EnrollmentAttempt=Readonly<{studentId:string;yearId:string;sectionId:string;startsOn:string;lastDay:string;rollNumber:string;key:string}>;
type ApiFailure=Error&{code?:string;status?:number;retryable?:boolean};

function priorDay(value:string){
  const [year,month,day]=value.split("-").map(Number),date=new Date(Date.UTC(year,month-1,day-1));
  return `${date.getUTCFullYear().toString().padStart(4,"0")}-${(date.getUTCMonth()+1).toString().padStart(2,"0")}-${date.getUTCDate().toString().padStart(2,"0")}`;
}

function defaultStart(year:EnrollmentOptions["years"][number]|undefined,today:string){
  return year?(today>=year.startsOn&&today<year.endsOn?today:year.startsOn):"";
}

export function StudentEnrollmentForm({studentId,studentName,admissionNumber,cancelHref,options}:{studentId:string;studentName:string;admissionNumber:string;cancelHref:string;options:EnrollmentOptions}){
  const router=useRouter(),years=options.years.filter(item=>!options.enrolledYearIds.includes(item.yearId));
  const [step,setStep]=useState<1|2|3|4>(1),[yearId,setYearId]=useState(years[0]?.yearId??""),[sectionId,setSectionId]=useState(""),[startsOn,setStartsOn]=useState(()=>defaultStart(years[0],options.today)),[lastDay,setLastDay]=useState(()=>years[0]?priorDay(years[0].endsOn):""),[rollNumber,setRollNumber]=useState(""),[reviewed,setReviewed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[errorCode,setErrorCode]=useState(""),[attempt,setAttempt]=useState<EnrollmentAttempt|null>(null),[saved,setSaved]=useState<EnrollmentResult|null>(null);
  const stepPanel=useRef<HTMLDivElement>(null),didMount=useRef(false),year=years.find(item=>item.yearId===yearId)??years[0],sections=year?.sections??[];

  useEffect(()=>{
    if(!didMount.current){didMount.current=true;return;}
    const heading=stepPanel.current?.querySelector<HTMLElement>("h2");
    heading?.setAttribute("tabindex","-1");heading?.focus();
  },[step]);

  function chooseYear(id:string){
    setYearId(id);setReviewed(false);
    const target=years.find(item=>item.yearId===id);
    if(!target)return;
    setStartsOn(options.today>=target.startsOn&&options.today<target.endsOn?options.today:target.startsOn);
    setLastDay(priorDay(target.endsOn));setSectionId("");
  }

  async function submit(){
    if(!year||!sectionId||!startsOn||!lastDay||!reviewed)return;
    const payload=attempt??{studentId,yearId:year.yearId,sectionId,startsOn,lastDay,rollNumber,key:crypto.randomUUID()};
    setBusy(true);setError("");setErrorCode("");
    try{
      const response=await fetch("/api/v1/enrollments",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":payload.key},body:JSON.stringify(payload)}),result=await response.json();
      if(!response.ok){const failure=Object.assign(new Error(typeof result.message==="string"?result.message:"Enrollment could not be completed."),{code:result.code,status:response.status,retryable:result.retryable}) as ApiFailure;throw failure;}
      setAttempt(null);setSaved(result as EnrollmentResult);router.refresh();
    }catch(cause){const failure=cause as ApiFailure,unknown=!(cause instanceof Error)||failure.status===undefined||failure.status>=500||failure.retryable===true;if(unknown){setAttempt(payload);setError("The outcome is unknown. Retry the exact retained enrollment before starting another request.");}else{setAttempt(null);setErrorCode(failure.code??"");setError(failure.message);}}
    finally{setBusy(false);}
  }

  if(saved)return <Card className="receipt student-registration-receipt"><div className="success-mark" aria-hidden="true">✓</div><SectionHeader title="Enrollment saved" description="The enrollment and effective placement were committed together."/><dl className="branch-review"><div><dt>Student</dt><dd>{studentName}</dd></div><div><dt>Academic year</dt><dd>{saved.yearCode} · {saved.yearName}</dd></div><div><dt>Class</dt><dd>{saved.placement.gradeName} · {saved.placement.sectionName}</dd></div><div><dt>Included dates</dt><dd>{saved.validFrom} to {priorDay(saved.validTo)}</dd></div></dl><div className="workflow-actions"><ButtonLink href={cancelHref} variant="secondary">Back to students</ButtonLink><ButtonLink href={`/admin/students/${studentId}?section=enrollment#enrollment-history`}>Review enrollment history</ButtonLink></div></Card>;

  if(!years.length)return <Card className="padded settings-panel"><SectionHeader title="Enroll in an academic year" description="There is no open year with an active section available, or this student is already enrolled in every open year."/><ButtonLink href={`/admin/students/${studentId}?section=enrollment#enrollment-history`} variant="secondary">Review enrollment history</ButtonLink></Card>;

  return <section className="student-enrollment-workflow">
    <ol className="workflow-stepper student-enrollment-stepper" aria-label="Student enrollment progress">
      <li className={step===1?"active":step>1?"complete":""} aria-current={step===1?"step":undefined}><span>{step>1?"✓":"1"}</span>Enrollment</li>
      <li className={step===2?"active":step>2?"complete":""} aria-current={step===2?"step":undefined}><span>{step>2?"✓":"2"}</span>Class placement</li>
      <li className={step===3?"active":step>3?"complete":""} aria-current={step===3?"step":undefined}><span>{step>3?"✓":"3"}</span>Review placement</li>
      <li className={step===4?"active":""} aria-current={step===4?"step":undefined}><span>4</span>Confirm</li>
    </ol>
    <div className="branch-edit-grid student-enrollment-grid">
      <Card className="branch-edit-card student-enrollment-card">
        {error&&<div role="alert" aria-label="Enrollment feedback"><Alert tone="danger" title={attempt?"Enrollment outcome unknown":"Enrollment not saved"}>{error} <ButtonLink href={errorCode==="ROSTER_IN_USE"?"/admin/attendance/sessions?view=monitor":`/admin/students/${studentId}?section=enrollment#enrollment-history`} variant="secondary">{errorCode==="ROSTER_IN_USE"?"Review attendance sessions":"Review enrollment history"}</ButtonLink></Alert></div>}
        <div ref={stepPanel}>
          {step===1&&<>
            <SectionHeader title="Enrollment" description="Choose the student and one open academic year."/>
            <SelectField label="Student" required value={studentId} disabled><option value={studentId}>{studentName} · {admissionNumber}</option></SelectField>
            <SelectField label="Academic year" required value={year?.yearId??""} onChange={event=>chooseYear(event.target.value)}>{years.map(item=><option key={item.yearId} value={item.yearId}>{item.code} · {item.name}</option>)}</SelectField>
            <div className="workflow-actions"><Button variant="secondary" onClick={()=>router.push(cancelHref)}>Cancel</Button><Button disabled={!year} onClick={()=>setStep(2)}>Continue <span aria-hidden="true">→</span></Button></div>
            <Button className="workflow-draft-action" variant="ghost" disabled title="Draft persistence and resume are not implemented.">Save draft and leave</Button>
          </>}
          {step===2&&<>
            <SectionHeader title="Class placement" description="Dates determine which class roster the pupil belongs to."/>
            <SelectField label="Class" required value={sectionId} onChange={event=>{setSectionId(event.target.value);setReviewed(false);}}><option value="">Choose a class</option>{sections.map(item=><option key={item.sectionId} value={item.sectionId}>{item.gradeName} · {item.code} · {item.name}</option>)}</SelectField>
            <div className="student-enrollment-fields">
              <TextField label="Effective from" required type="date" min={year?.startsOn} max={year?priorDay(year.endsOn):undefined} value={startsOn} onChange={event=>{setStartsOn(event.target.value);setReviewed(false);}}/>
              <TextField label="Effective until" required type="date" min={startsOn||year?.startsOn} max={year?priorDay(year.endsOn):undefined} value={lastDay} onChange={event=>{setLastDay(event.target.value);setReviewed(false);}}/>
              <TextField label="Roll number" maxLength={30} value={rollNumber} onChange={event=>{setRollNumber(event.target.value);setReviewed(false);}} hint="Optional · leading zeros are preserved."/>
            </div>
            <div className="workflow-actions"><Button variant="secondary" onClick={()=>setStep(1)}>← Back</Button><Button disabled={!sectionId||!startsOn||!lastDay} onClick={()=>setStep(3)}>Continue <span aria-hidden="true">→</span></Button></div>
            <Button className="workflow-draft-action" variant="ghost" disabled title="Draft persistence and resume are not implemented.">Save draft and leave</Button>
          </>}
          {step===3&&<>
            <SectionHeader title="Review placement" description="Check overlapping placements and any frozen attendance sessions."/>
            <Alert title="Roster impact">This placement controls roster eligibility for the included dates. Existing frozen attendance rosters are never rewritten.</Alert>
            <Checkbox label="I have reviewed roster impact." checked={reviewed} onChange={event=>setReviewed(event.target.checked)}/>
            <div className="workflow-actions"><Button variant="secondary" onClick={()=>setStep(2)}>← Back</Button><Button disabled={!reviewed} onClick={()=>setStep(4)}>Continue <span aria-hidden="true">→</span></Button></div>
            <Button className="workflow-draft-action" variant="ghost" disabled title="Draft persistence and resume are not implemented.">Save draft and leave</Button>
          </>}
          {step===4&&<>
            <SectionHeader title="Review and confirm" description="Check the intended outcome before saving the enrollment and placement."/>
            <dl className="branch-review"><div><dt>Student</dt><dd>{studentName}</dd></div><div><dt>Academic year</dt><dd>{year?.code} · {year?.name}</dd></div><div><dt>Class</dt><dd>{sections.find(item=>item.sectionId===sectionId)?.gradeName} · {sections.find(item=>item.sectionId===sectionId)?.name}</dd></div><div><dt>Included dates</dt><dd>{startsOn} to {lastDay}</dd></div></dl>
            <h3>Expected outcome</h3><p className="muted small">The enrollment and effective placement are saved together.</p>
            <div className="workflow-actions"><Button variant="secondary" disabled={busy||attempt!==null} onClick={()=>setStep(3)}>← Back</Button><Button disabled={!reviewed} loading={busy} onClick={()=>void submit()}>{attempt?"Retry same enrollment":"Confirm enrollment"}</Button></div>
          </>}
        </div>
      </Card>
      <aside className="branch-edit-aside"><Card className="padded"><h2>What this changes</h2><p>The enrollment and effective placement are saved together.</p><div className="section-divider"/><h3>Before you continue</h3><p>One enrollment is allowed per student and year. Placement intervals cannot overlap or rewrite frozen rosters.</p></Card><Card className="padded"><h3>Something changed?</h3><p>A conflicting placement or attendance session is reported without a partial enrollment.</p></Card></aside>
    </div>
  </section>;
}
