"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Checkbox,TextArea,TextField} from "@/components/ui/forms";
import {Dialog} from "@/components/ui/interactive";
import {Alert,Badge,Button} from "@/components/ui/primitives";
import type {
  StudentAdmissionDateResult,
  StudentDetail,
  StudentNameCorrectionResult,
} from "@/shared/contracts/students";

type ApiFailure=Error&{code?:string;status?:number;retryable?:boolean};
type Attempt=Readonly<
  |{kind:"name";key:string;expectedPersonVersion:number;firstName:string;lastName:string;reason:string}
  |{kind:"date";key:string;expectedVersion:number;admittedOn:string;reason:string}
>;
type Message={tone:"success"|"danger"|"warning";title:string;body:string};
type NameBaseline={firstName:string;lastName:string;version:number};
type DateBaseline={value:string;version:number;verified:boolean};
type StaleReview=Readonly<{current:string;attempted:string}>;

async function result<T>(response:Response):Promise<T>{
  const value=await response.json().catch(()=>({}));
  if(!response.ok)throw Object.assign(
    new Error(typeof value.message==="string"?value.message:"The correction could not be saved."),
    {code:value.code,status:response.status,retryable:value.retryable},
  ) as ApiFailure;
  return value as T;
}

export function StudentCorrectionsDrawer({
  studentId,
  displayName,
  admissionNumber,
  firstName:initialFirst,
  lastName:initialLast,
  personVersion,
  studentVersion,
  admissionDate,
  admissionVerified,
  closeHref,
}:{
  studentId:string;
  displayName:string;
  admissionNumber:string;
  firstName:string;
  lastName:string;
  personVersion:number;
  studentVersion:number;
  admissionDate:string|null;
  admissionVerified:boolean;
  closeHref:string;
}){
  const router=useRouter();
  const [nameBaseline,setNameBaseline]=useState<NameBaseline>({firstName:initialFirst,lastName:initialLast,version:personVersion});
  const [dateBaseline,setDateBaseline]=useState<DateBaseline>({value:admissionDate??"",version:studentVersion,verified:admissionVerified});
  const [firstName,setFirstName]=useState(initialFirst);
  const [lastName,setLastName]=useState(initialLast);
  const [nameReason,setNameReason]=useState("");
  const [date,setDate]=useState(admissionDate??"");
  const [dateReason,setDateReason]=useState("");
  const [attempt,setAttempt]=useState<Attempt|null>(null);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState<Message|null>(null);
  const [staleNameReview,setStaleNameReview]=useState<StaleReview|null>(null);
  const [staleDateReview,setStaleDateReview]=useState<StaleReview|null>(null);
  const [staleReadPending,setStaleReadPending]=useState<"name"|"date"|null>(null);
  const [reviewedName,setReviewedName]=useState(false);
  const [reviewedDate,setReviewedDate]=useState(false);
  const [confirmClose,setConfirmClose]=useState(false);

  const nameDirty=firstName!==nameBaseline.firstName||lastName!==nameBaseline.lastName||nameReason.length>0;
  const dateDirty=date!==dateBaseline.value||dateReason.length>0;
  const unresolved=attempt!==null||staleReadPending!==null;
  const dirty=nameDirty||dateDirty||unresolved;

  function close(){
    const opener=document.getElementById("student-edit-action");
    opener?.focus();
    router.push(closeHref);
    router.refresh();
  }

  function requestClose(){
    if(unresolved){
      setMessage({
        tone:"warning",
        title:attempt?"Correction outcome unresolved":"Current record unavailable",
        body:attempt
          ?"Retry the unchanged correction before closing. Leaving cannot cancel a submitted request."
          :"Load the current record before saving or closing this recovery state.",
      });
      return;
    }
    if(dirty)setConfirmClose(true);
    else close();
  }

  async function loadCurrent(kind:"name"|"date",attempted?:StaleReview){
    try{
      const current=await result<StudentDetail>(await fetch(`/api/v1/students/${studentId}`,{cache:"no-store"}));
      if(kind==="name"){
        const comparison=attempted??{attempted:`${firstName.trim()} ${lastName.trim()}`.trim(),current:current.displayName};
        setNameBaseline({firstName:current.firstName,lastName:current.lastName,version:current.personVersion});
        setStaleNameReview({...comparison,current:current.displayName});
        setReviewedName(false);
      }else{
        const comparison=attempted??{attempted:date,current:current.admissionDate.value??"not recorded"};
        setDateBaseline({value:current.admissionDate.value??"",version:current.version,verified:current.admissionDate.verified});
        setStaleDateReview({...comparison,current:current.admissionDate.value??"not recorded"});
        setReviewedDate(false);
      }
      setStaleReadPending(null);
      setMessage({
        tone:"warning",
        title:"Record changed",
        body:"Current and attempted values are shown below. Review them before starting a new correction.",
      });
      return true;
    }catch{
      setStaleReadPending(kind);
      setMessage({
        tone:"danger",
        title:"Record changed; current values unavailable",
        body:"Your attempted values and reason are retained. Load the current record before trying again.",
      });
      return false;
    }
  }

  async function save(kind:"name"|"date"){
    const exact=attempt??(kind==="name"
      ?{kind,key:crypto.randomUUID(),expectedPersonVersion:nameBaseline.version,firstName:firstName.trim(),lastName:lastName.trim(),reason:nameReason.trim()}
      :{kind,key:crypto.randomUUID(),expectedVersion:dateBaseline.version,admittedOn:date,reason:dateReason.trim()});
    if(exact.kind!==kind)return;
    setAttempt(exact);
    setBusy(true);
    setMessage(null);
    try{
      const endpoint=kind==="name"?"name-correction":"admission-date";
      const response=await fetch(`/api/v1/students/${studentId}/${endpoint}`,{
        method:"POST",
        headers:{"content-type":"application/json","idempotency-key":exact.key},
        body:JSON.stringify(exact.kind==="name"
          ?{expectedPersonVersion:exact.expectedPersonVersion,firstName:exact.firstName,lastName:exact.lastName,reason:exact.reason,key:exact.key}
          :{expectedVersion:exact.expectedVersion,admittedOn:exact.admittedOn,reason:exact.reason,key:exact.key}),
      });
      if(exact.kind==="name"){
        const saved=await result<StudentNameCorrectionResult>(response);
        setNameBaseline({firstName:exact.firstName,lastName:exact.lastName,version:saved.personVersion});
        setFirstName(exact.firstName);
        setLastName(exact.lastName);
        setNameReason("");
        setReviewedName(false);
        setStaleNameReview(null);
      }else{
        const saved=await result<StudentAdmissionDateResult>(response);
        setDateBaseline({value:saved.admittedOn,version:saved.version,verified:true});
        setDate(saved.admittedOn);
        setDateReason("");
        setReviewedDate(false);
        setStaleDateReview(null);
      }
      setAttempt(null);
      setMessage({
        tone:"success",
        title:kind==="name"?"Name correction saved":"Admission date saved",
        body:kind==="name"
          ?"The current name was updated and the previous value remains in restricted history."
          :"The branch admission date was updated without changing enrollment or attendance history.",
      });
    }catch(cause){
      const failure=cause as ApiFailure;
      const unknown=failure.status===undefined||failure.status>=500||failure.retryable===true;
      if(failure.code==="STALE_VERSION"){
        const attempted:StaleReview=exact.kind==="name"
          ?{attempted:`${exact.firstName} ${exact.lastName}`.trim(),current:""}
          :{attempted:exact.admittedOn,current:""};
        setAttempt(null);
        await loadCurrent(kind,attempted);
      }else{
        if(!unknown)setAttempt(null);
        setMessage({
          tone:unknown?"warning":"danger",
          title:unknown?"Correction outcome unknown":"Correction not saved",
          body:unknown
            ?"Retry the unchanged correction from this drawer. A different correction cannot start until the result is known."
            :failure.message,
        });
      }
    }finally{
      setBusy(false);
    }
  }

  const locked=attempt!==null;
  const nameNeedsReview=staleNameReview!==null;
  const dateNeedsReview=staleDateReview!==null;

  return <>
    <Dialog open onClose={requestClose} drawer title="Edit student" description={`${displayName} · Admission no. ${admissionNumber}`} className="student-correction-drawer">
      <div className="student-correction-drawer-body">
        <dl className="student-correction-context">
          <div><dt>Student</dt><dd>{displayName}</dd></div>
          <div><dt>Admission number</dt><dd>{admissionNumber}</dd></div>
        </dl>

        {message&&<Alert tone={message.tone} title={message.title} onDismiss={message.tone==="success"?()=>setMessage(null):undefined}>
          <p>{message.body}</p>
          {staleReadPending&&<Button size="small" variant="secondary" disabled={busy} onClick={()=>void loadCurrent(staleReadPending)}>Load current record</Button>}
        </Alert>}

        <section aria-labelledby="student-name-correction-title">
          <div className="student-correction-heading">
            <div>
              <h3 id="student-name-correction-title">Correct name</h3>
              <p>Update the student’s recorded name and state why it changed.</p>
            </div>
          </div>
          {nameNeedsReview&&<Alert tone="warning" title="Review the current name">
            <dl className="student-correction-comparison">
              <div><dt>Current</dt><dd>{staleNameReview!.current}</dd></div>
              <div><dt>Attempted</dt><dd>{staleNameReview!.attempted}</dd></div>
            </dl>
          </Alert>}
          <div className="student-correction-fields">
            <TextField label="First name" required value={firstName} disabled={busy||locked} onChange={event=>{setFirstName(event.target.value);setReviewedName(false);}} maxLength={100}/>
            <TextField label="Last name" required value={lastName} disabled={busy||locked} onChange={event=>{setLastName(event.target.value);setReviewedName(false);}} maxLength={100}/>
          </div>
          <TextArea label="Reason for correction" required minLength={5} maxLength={500} value={nameReason} disabled={busy||locked} onChange={event=>{setNameReason(event.target.value);setReviewedName(false);}}/>
          {nameNeedsReview&&<Checkbox label="I reviewed the current and attempted name." checked={reviewedName} disabled={busy||locked} onChange={event=>setReviewedName(event.target.checked)}/>}
          <div className="student-correction-actions">
            <Button
              loading={busy&&attempt?.kind==="name"}
              disabled={busy||staleReadPending!==null||Boolean(attempt&&attempt.kind!=="name")||(!attempt&&(!(firstName.trim()&&lastName.trim())||nameReason.trim().length<5||(!nameDirty)||Boolean(nameNeedsReview&&!reviewedName)))}
              onClick={()=>void save("name")}
            >
              {attempt?.kind==="name"?"Retry unchanged name correction":"Save name correction"}
            </Button>
          </div>
        </section>

        <section aria-labelledby="student-date-correction-title">
          <div className="student-correction-heading">
            <div>
              <h3 id="student-date-correction-title">Branch admission date</h3>
              <p>This date is separate from academic-year enrollment and section moves.</p>
            </div>
            <Badge tone={dateBaseline.verified?"success":"warning"}>{dateBaseline.verified?"Verified":"Not verified"}</Badge>
          </div>
          {dateNeedsReview&&<Alert tone="warning" title="Review the current admission date">
            <dl className="student-correction-comparison">
              <div><dt>Current</dt><dd>{staleDateReview!.current}</dd></div>
              <div><dt>Attempted</dt><dd>{staleDateReview!.attempted}</dd></div>
            </dl>
          </Alert>}
          <TextField label="Admission date" type="date" required value={date} disabled={busy||locked} onChange={event=>{setDate(event.target.value);setReviewedDate(false);}}/>
          <TextArea label="Verification or correction reason" required minLength={5} maxLength={500} value={dateReason} disabled={busy||locked} onChange={event=>{setDateReason(event.target.value);setReviewedDate(false);}}/>
          {dateNeedsReview&&<Checkbox label="I reviewed the current and attempted admission date." checked={reviewedDate} disabled={busy||locked} onChange={event=>setReviewedDate(event.target.checked)}/>}
          <div className="student-correction-actions">
            <Button
              loading={busy&&attempt?.kind==="date"}
              disabled={busy||staleReadPending!==null||Boolean(attempt&&attempt.kind!=="date")||(!attempt&&(!date||dateReason.trim().length<5||(!dateDirty)||Boolean(dateNeedsReview&&!reviewedDate)))}
              onClick={()=>void save("date")}
            >
              {attempt?.kind==="date"?"Retry unchanged date correction":dateBaseline.verified?"Save corrected date":"Verify admission date"}
            </Button>
          </div>
        </section>
      </div>
    </Dialog>

    <Dialog open={confirmClose} onClose={()=>setConfirmClose(false)} title="Discard unsaved corrections?" description="No correction has been submitted from these unsaved fields.">
      <p className="muted">Only unsent edits will be discarded.</p>
      <div className="form-actions">
        <Button variant="secondary" onClick={()=>setConfirmClose(false)}>Keep editing</Button>
        <Button onClick={close}>Discard and close</Button>
      </div>
    </Dialog>
  </>;
}
