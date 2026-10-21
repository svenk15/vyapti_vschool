"use client";

import {useState} from "react";
import {Checkbox,TextArea,TextField} from "@/components/ui/forms";
import {Dialog} from "@/components/ui/interactive";
import {Alert,Badge,Button,EmptyState} from "@/components/ui/primitives";
import type {GuardianAccessRecord,GuardianAuthorizationResult} from "@/shared/contracts/guardians";

const statusLabel:Record<GuardianAccessRecord["status"],string>={
  INVITE_SENT:"Invitation sent",
  DELIVERY_FAILED:"Delivery failed",
  OPERATOR_REQUIRED:"Operator activation required",
  ACCESS_ENABLED:"Access enabled",
  ACCESS_REMOVED:"Access removed",
};
const purposeLabel:Readonly<Record<string,string>>={
  "child.summary.read":"Student summary",
  "attendance.read_child":"Attendance history",
  "timetable.read_child":"Published timetable",
  "communication.notice.read":"School notices",
  "attendance.explanation.submit":"Absence explanations",
  "attendance.correction.request_child":"Request attendance corrections",
  "calendar.event.read_child":"School calendar",
  "learning.assignment.read_child":"Published learning",
};
const statusTone=(status:GuardianAccessRecord["status"])=>status==="ACCESS_ENABLED"?"success":status==="DELIVERY_FAILED"?"danger":status==="ACCESS_REMOVED"?"neutral":"warning";

type Message={tone:"success"|"danger"|"warning";title:string;body:string};
type Failure=Error&{retryable?:boolean;status?:number};
type InviteAttempt=Readonly<{kind:"invite";displayName:string;email:string;noticeRead:boolean;confirmed:true;key:string}>;
type ManageAttempt=Readonly<
  |{kind:"resend";accessId:string;key:string}
  |{kind:"purpose";accessId:string;expectedVersion:number;purpose:"explanation"|"calendar"|"learning";enabled:boolean;key:string}
  |{kind:"remove";accessId:string;expectedVersion:number;reason:string;key:string}
>;
type RefreshPending=Readonly<{finish:"invite"|"manage"|"remove";success:Message;accessId?:string}>;

async function payload<T>(response:Response):Promise<T>{
  const value=await response.json().catch(()=>({}));
  if(!response.ok)throw Object.assign(
    new Error(typeof value.message==="string"?value.message:"Unable to complete this request."),
    {retryable:value.retryable,status:response.status},
  ) as Failure;
  return value as T;
}

export function GuardianAccessManagement({
  studentId,
  studentName,
  studentContext,
  initialItems,
  embedded=false,
}:{
  studentId:string;
  studentName:string;
  studentContext?:string;
  initialItems:readonly GuardianAccessRecord[];
  embedded?:boolean;
}){
  const [items,setItems]=useState([...initialItems]);
  const [drawer,setDrawer]=useState<"add"|"manage"|null>(null);
  const [selected,setSelected]=useState<GuardianAccessRecord|null>(null);
  const [displayName,setDisplayName]=useState("");
  const [email,setEmail]=useState("");
  const [noticeRead,setNoticeRead]=useState(false);
  const [busy,setBusy]=useState(false);
  const [profileMessage,setProfileMessage]=useState<Message|null>(null);
  const [drawerMessage,setDrawerMessage]=useState<Message|null>(null);
  const [removeMessage,setRemoveMessage]=useState<Message|null>(null);
  const [fieldErrors,setFieldErrors]=useState<{displayName?:string;email?:string}>({});
  const [inviteAttempt,setInviteAttempt]=useState<InviteAttempt|null>(null);
  const [manageAttempt,setManageAttempt]=useState<ManageAttempt|null>(null);
  const [refreshPending,setRefreshPending]=useState<RefreshPending|null>(null);
  const [confirmClose,setConfirmClose]=useState(false);
  const [removeOpen,setRemoveOpen]=useState(false);
  const [reason,setReason]=useState("");

  const optional=[
    {id:"explanation" as const,purpose:"attendance.explanation.submit",label:"Absence explanations"},
    {id:"calendar" as const,purpose:"calendar.event.read_child",label:"School calendar"},
    {id:"learning" as const,purpose:"learning.assignment.read_child",label:"Published learning"},
  ] as const;
  const activeItems=items.filter(item=>item.status!=="ACCESS_REMOVED");
  const unresolved=inviteAttempt!==null||manageAttempt!==null;
  const locked=unresolved||refreshPending!==null;
  const dirty=Boolean(displayName||email||noticeRead);

  function resetAdd(){
    setDisplayName("");
    setEmail("");
    setNoticeRead(false);
    setFieldErrors({});
    setDrawerMessage(null);
  }

  function unresolvedMessage(){
    return {
      tone:"warning" as const,
      title:"Submitted request still unresolved",
      body:"Retry the unchanged request before closing. Leaving cannot cancel a request that may already have committed.",
    };
  }

  function committedRefreshMessage(pending:RefreshPending,denied=false):Message{
    return {
      tone:"warning",
      title:`${pending.success.title}; current access unavailable`,
      body:denied
        ?`${pending.success.body} Current authority no longer permits this access list.`
        :`${pending.success.body} The latest list could not be loaded. Use the read-only refresh; do not repeat the saved command.`,
    };
  }

  function closeCommittedResult(){
    if(!refreshPending)return;
    setProfileMessage(committedRefreshMessage(refreshPending));
    if(refreshPending.finish==="invite")resetAdd();
    setRemoveOpen(false);
    setDrawer(null);
    setDrawerMessage(null);
    setRemoveMessage(null);
  }

  function requestClose(){
    if(unresolved){
      if(removeOpen)setRemoveMessage(unresolvedMessage());
      else setDrawerMessage(unresolvedMessage());
      return;
    }
    if(refreshPending){
      closeCommittedResult();
      return;
    }
    if(drawer==="add"&&dirty){
      setConfirmClose(true);
      return;
    }
    setDrawer(null);
    setDrawerMessage(null);
  }

  async function readCurrent(){
    const data=await payload<{items:GuardianAccessRecord[]}>(await fetch(`/api/v1/students/${studentId}/guardians`,{cache:"no-store"}));
    setItems(data.items);
    if(selected)setSelected(data.items.find(item=>item.accessId===selected.accessId)??null);
  }

  function finishRefresh(pending:RefreshPending){
    setRefreshPending(null);
    if(pending.finish==="invite"){
      resetAdd();
      setDrawer(null);
      setProfileMessage(pending.success);
    }else if(pending.finish==="remove"){
      setRemoveOpen(false);
      setDrawer(null);
      setReason("");
      setRemoveMessage(null);
      setProfileMessage(pending.success);
    }else{
      if(drawer===null)setProfileMessage(pending.success);
      else setDrawerMessage(pending.success);
    }
  }

  function showRefreshMessage(pending:RefreshPending,message:Message){
    if(pending.finish==="remove"&&removeOpen)setRemoveMessage(message);
    else if(drawer!==null)setDrawerMessage(message);
    else setProfileMessage(message);
  }

  async function reconcileCommitted(pending:RefreshPending){
    setRefreshPending(pending);
    const refreshFailure=committedRefreshMessage(pending);
    if(pending.finish==="remove")setRemoveMessage(refreshFailure);
    else setDrawerMessage(refreshFailure);
    try{
      await readCurrent();
      finishRefresh(pending);
    }catch(cause){
      const failure=cause as Failure;
      const denied=failure.status===401||failure.status===403;
      showRefreshMessage(pending,committedRefreshMessage(pending,denied));
    }
  }

  async function retryRefresh(){
    if(!refreshPending)return;
    setBusy(true);
    try{
      await readCurrent();
      finishRefresh(refreshPending);
    }catch(cause){
      const failure=cause as Failure;
      const message:Message={
        tone:"warning",
        title:"Saved; current access still unavailable",
        body:failure.status===401||failure.status===403
          ?"The earlier change remains committed, but current authority no longer permits this access list."
          :"The earlier change remains committed. Try this read-only refresh again; do not repeat the mutation.",
      };
      showRefreshMessage(refreshPending,message);
    }finally{
      setBusy(false);
    }
  }

  async function authorize(){
    const errors={
      displayName:displayName.trim().length<2?"Enter the guardian’s full name.":undefined,
      email:!/^\S+@\S+\.\S+$/.test(email.trim())?"Enter a valid email address.":undefined,
    };
    setFieldErrors(errors);
    if(errors.displayName||errors.email){
      setDrawerMessage({tone:"danger",title:"Check the guardian details",body:"Correct the highlighted fields before sending an invitation."});
      return;
    }

    const exact=inviteAttempt??{
      kind:"invite" as const,
      displayName:displayName.trim(),
      email:email.trim(),
      noticeRead,
      confirmed:true as const,
      key:crypto.randomUUID(),
    };
    setInviteAttempt(exact);
    setBusy(true);
    setDrawerMessage(null);
    try{
      const result=await payload<GuardianAuthorizationResult>(await fetch(`/api/v1/students/${studentId}/guardians`,{
        method:"POST",
        headers:{"content-type":"application/json","idempotency-key":exact.key},
        body:JSON.stringify(exact),
      }));
      setInviteAttempt(null);
      const success:Message={
        tone:result.status==="DELIVERY_FAILED"?"warning":"success",
        title:result.status==="DELIVERY_FAILED"?"Access saved; invitation not delivered":"Parent access invitation created",
        body:result.status==="OPERATOR_REQUIRED"
          ?"This institution uses operator-assisted activation. No email was sent."
          :"The invitation is limited to this student and the reviewed purposes.",
      };
      await reconcileCommitted({finish:"invite",success});
    }catch(cause){
      const failure=cause as Failure;
      const unknown=failure.retryable===true||failure.status===undefined||failure.status>=500;
      if(!unknown)setInviteAttempt(null);
      setDrawerMessage({
        tone:unknown?"warning":"danger",
        title:unknown?"Invitation result unknown":"Invitation not created",
        body:unknown
          ?"Retry the unchanged invitation from this drawer. Closing cannot cancel the submitted request."
          :failure.message,
      });
    }finally{
      setBusy(false);
    }
  }

  async function manage(fresh:ManageAttempt){
    const exact=manageAttempt??fresh;
    if(manageAttempt&&(
      manageAttempt.kind!==fresh.kind||
      manageAttempt.accessId!==fresh.accessId||
      (manageAttempt.kind==="purpose"&&fresh.kind==="purpose"&&manageAttempt.purpose!==fresh.purpose)
    ))return;

    setManageAttempt(exact);
    setBusy(true);
    if(exact.kind==="remove")setRemoveMessage(null);
    else setDrawerMessage(null);

    try{
      let result:GuardianAuthorizationResult|undefined;
      if(exact.kind==="resend"){
        result=await payload<GuardianAuthorizationResult>(await fetch(`/api/v1/family-access/${exact.accessId}/resend`,{
          method:"POST",
          headers:{"content-type":"application/json","idempotency-key":exact.key},
          body:JSON.stringify({key:exact.key}),
        }));
      }else if(exact.kind==="purpose"){
        await payload(await fetch(`/api/v1/family-access/${exact.accessId}`,{
          method:"PATCH",
          headers:{"content-type":"application/json","idempotency-key":exact.key},
          body:JSON.stringify({purpose:exact.purpose,expectedVersion:exact.expectedVersion,enabled:exact.enabled,key:exact.key}),
        }));
      }else{
        await payload(await fetch(`/api/v1/family-access/${exact.accessId}`,{
          method:"DELETE",
          headers:{"content-type":"application/json","idempotency-key":exact.key},
          body:JSON.stringify({expectedVersion:exact.expectedVersion,reason:exact.reason,key:exact.key}),
        }));
      }

      setManageAttempt(null);
      const success:Message=exact.kind==="resend"
        ?{
          tone:result?.status==="DELIVERY_FAILED"?"warning":"success",
          title:result?.status==="DELIVERY_FAILED"?"Access retained; invitation not delivered":"Invitation sent again",
          body:"The earlier pending invitation can no longer be used.",
        }
        :exact.kind==="purpose"
          ?{tone:"success",title:"Optional access updated",body:"The change applies only to this student and purpose."}
          :{tone:"success",title:"Access removed",body:`${selected?.displayName??"This guardian"} can no longer open ${studentName}’s information. Other child links remain unchanged.`};
      await reconcileCommitted({
        finish:exact.kind==="remove"?"remove":"manage",
        success,
        accessId:exact.accessId,
      });
    }catch(cause){
      const failure=cause as Failure;
      const unknown=failure.retryable===true||failure.status===undefined||failure.status>=500;
      if(!unknown)setManageAttempt(null);
      const message:Message={
        tone:unknown?"warning":"danger",
        title:unknown?"Access result unknown":"Access not changed",
        body:unknown
          ?"Retry this exact operation. Conflicting changes are blocked until the result is known."
          :failure.message,
      };
      if(exact.kind==="remove")setRemoveMessage(message);
      else setDrawerMessage(message);
    }finally{
      setBusy(false);
    }
  }

  return <section id="family-access" className={`guardian-profile-section${embedded?" guardian-profile-section-embedded":""}`} aria-labelledby="family-access-title">
    <div className="student-profile-section-heading">
      <h2 id="family-access-title">Parents & guardians</h2>
      <Button size="small" variant="secondary" disabled={locked} onClick={()=>{resetAdd();setProfileMessage(null);setDrawer("add");}}>
        <span aria-hidden="true">＋</span> Add guardian
      </Button>
    </div>

    {profileMessage&&<Alert tone={profileMessage.tone} title={profileMessage.title} onDismiss={!refreshPending?()=>setProfileMessage(null):undefined}>
      <p>{profileMessage.body}</p>
      {refreshPending&&drawer===null&&<Button size="small" variant="secondary" disabled={busy} onClick={()=>void retryRefresh()}>Refresh current access</Button>}
    </Alert>}

    {activeItems.length===0
      ?<EmptyState title="No Parent access yet" description="Invite a verified parent or guardian when the school is ready to grant child-specific access." icon="people"/>
      :<div className="guardian-profile-list">{activeItems.map(item=><article key={item.accessId} className="guardian-profile-row">
        <span className="student-profile-avatar" aria-hidden="true">{item.displayName.split(/\s+/).map(p=>p[0]).join("").slice(0,2).toUpperCase()}</span>
        <div><strong>{item.displayName}</strong><p>{item.email}</p></div>
        <div className="guardian-profile-row-actions">
          <Badge tone={statusTone(item.status)}>{statusLabel[item.status]}</Badge>
          <Button size="small" variant="ghost" disabled={locked} onClick={()=>{setSelected(item);setProfileMessage(null);setDrawerMessage(null);setDrawer("manage");}}>Manage <span aria-hidden="true">→</span></Button>
        </div>
      </article>)}</div>
    }

    <Dialog open={drawer!==null} onClose={requestClose} drawer title={drawer==="add"?"Add guardian":"Manage guardian access"} description={studentContext??studentName} showDescription className="guardian-access-drawer">
      {drawerMessage&&<Alert tone={drawerMessage.tone} title={drawerMessage.title} onDismiss={!locked?()=>setDrawerMessage(null):undefined}>
        <p>{drawerMessage.body}</p>
        {refreshPending&&refreshPending.finish!=="remove"&&<Button size="small" variant="secondary" disabled={busy} onClick={()=>void retryRefresh()}>Refresh current access</Button>}
      </Alert>}

      {drawer==="add"&&<div className="guardian-drawer-form">
        <TextField label="Full name" required autoFocus autoComplete="name" value={displayName} error={fieldErrors.displayName} disabled={locked} onChange={event=>{setDisplayName(event.target.value);setFieldErrors(current=>({...current,displayName:undefined}));}} maxLength={160}/>
        <TextField label="Email address" required type="email" autoComplete="email" value={email} error={fieldErrors.email} disabled={locked} onChange={event=>{setEmail(event.target.value);setFieldErrors(current=>({...current,email:undefined}));}} maxLength={254}/>
        <div className="guardian-purpose-summary"><strong>Parent portal access</strong>{["Student summary","Attendance history","Published timetable"].map(label=><span key={label}><span>✓</span>{label}</span>)}</div>
        <Checkbox label="Also allow school notices for this child" checked={noticeRead} disabled={locked} onChange={event=>setNoticeRead(event.target.checked)}/>
        <div className="drawer-actions">
          <Button variant="secondary" disabled={busy} onClick={requestClose}>Cancel</Button>
          <Button loading={busy} disabled={refreshPending!==null} onClick={()=>void authorize()}>{inviteAttempt?"Retry unchanged invitation":"Add and send invitation"}</Button>
        </div>
      </div>}

      {drawer==="manage"&&selected&&<div className="guardian-drawer-form">
        <dl className="guardian-drawer-facts">
          <div><dt>Name</dt><dd>{selected.displayName}</dd></div>
          <div><dt>Email</dt><dd>{selected.email}</dd></div>
          <div><dt>Status</dt><dd><Badge tone={statusTone(selected.status)}>{statusLabel[selected.status]}</Badge></dd></div>
        </dl>
        <div className="guardian-purpose-summary">
          <strong>Current access</strong>
          {selected.purposes.filter(p=>!optional.some(o=>o.purpose===(p as string))).map(p=><span key={p}><span>✓</span>{purposeLabel[p]??"Additional approved access"}</span>)}
        </div>
        <div className="guardian-optional-list">{optional.map(item=>{
          const enabled=selected.purposes.includes(item.purpose);
          const retrying=manageAttempt?.kind==="purpose"&&manageAttempt.accessId===selected.accessId&&manageAttempt.purpose===item.id;
          return <div className="guardian-optional-row" key={item.id}>
            <span><strong>{item.label}</strong><small>{enabled?"Allowed":"Not allowed"}</small></span>
            <Button size="small" variant="secondary" disabled={busy||(locked&&!retrying)} onClick={()=>void manage({kind:"purpose",accessId:selected.accessId,expectedVersion:selected.version,purpose:item.id,enabled:!enabled,key:crypto.randomUUID()})}>{retrying?"Retry unchanged change":enabled?"Remove":"Allow"}</Button>
          </div>;
        })}</div>
        <div className="guardian-manage-footer">
          {["INVITE_SENT","DELIVERY_FAILED"].includes(selected.status)&&<Button variant="secondary" disabled={busy||(locked&&!(manageAttempt?.kind==="resend"&&manageAttempt.accessId===selected.accessId))} onClick={()=>void manage({kind:"resend",accessId:selected.accessId,key:crypto.randomUUID()})}>{manageAttempt?.kind==="resend"?"Retry unchanged resend":"Resend invitation"}</Button>}
          <Button variant="ghost" disabled={busy||locked} onClick={()=>{setRemoveMessage(null);setRemoveOpen(true);}}>Remove access</Button>
        </div>
      </div>}
    </Dialog>

    <Dialog open={confirmClose} onClose={()=>setConfirmClose(false)} title="Discard unsaved Parent details?" description="No invitation has been submitted from these fields.">
      <div className="form-actions">
        <Button variant="secondary" onClick={()=>setConfirmClose(false)}>Keep editing</Button>
        <Button onClick={()=>{resetAdd();setConfirmClose(false);setDrawer(null);}}>Discard details</Button>
      </div>
    </Dialog>

    <Dialog open={removeOpen} onClose={()=>{if(unresolved)setRemoveMessage(unresolvedMessage());else if(refreshPending)closeCommittedResult();else setRemoveOpen(false);}} title="Remove Parent access?" description="This revokes current access for this student and preserves the access history.">
      {removeMessage&&<Alert tone={removeMessage.tone} title={removeMessage.title}>
        <p>{removeMessage.body}</p>
        {refreshPending?.finish==="remove"&&<Button size="small" variant="secondary" disabled={busy} onClick={()=>void retryRefresh()}>Refresh current access</Button>}
      </Alert>}
      <TextArea label="Reason" required value={reason} disabled={locked} onChange={event=>setReason(event.target.value)} maxLength={500}/>
      <div className="form-actions">
        <Button variant="secondary" disabled={busy||unresolved} onClick={()=>{if(refreshPending)closeCommittedResult();else setRemoveOpen(false);}}>Cancel</Button>
        <Button loading={busy} disabled={reason.trim().length<3||!selected||refreshPending!==null} onClick={()=>selected&&void manage({kind:"remove",accessId:selected.accessId,expectedVersion:selected.version,reason:reason.trim(),key:crypto.randomUUID()})}>{manageAttempt?.kind==="remove"?"Retry unchanged removal":"Remove access"}</Button>
      </div>
    </Dialog>
  </section>;
}
