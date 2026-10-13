"use client";
import {useEffect,useRef,useState,useSyncExternalStore} from "react";
import Link from "next/link";
import {Checkbox,SelectField,TextField} from "./ui/forms";
import {Alert,Button,ButtonLink,Stepper} from "./ui/primitives";

export function ForgotPasswordForm(){
 const [email,setEmail]=useState(""),[help,setHelp]=useState<""|"ACTIVATE"|"RESET">(""),[ack,setAck]=useState(false),[stage,setStage]=useState<0|1|2>(0),[busy,setBusy]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState(""),feedback=useRef<HTMLDivElement>(null),heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{if(sent||error)feedback.current?.focus();},[sent,error]);
 function move(next:0|1|2){setStage(next);setError("");requestAnimationFrame(()=>heading.current?.focus());}
 async function confirm(){setBusy(true);setError("");try{if(help==="RESET"){const response=await fetch("/api/v1/password-reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});if(response.status!==202)throw new Error("request");}setSent(true);}catch{setError("Unable to submit your request. Try again later.");}finally{setBusy(false);}}
 if(sent)return <div ref={feedback} tabIndex={-1} className="control-stack"><Alert tone="success" title="Request received">If this account can use the selected recovery path, instructions will be available through its verified channel.</Alert><ButtonLink href="/sign-in">Back to sign in</ButtonLink></div>;
 return <div className="workspace-choice-flow"><Stepper steps={["Request access help","Next steps","Confirm"]} current={stage}/>
  {stage===0&&<section className="workspace-choice-stage"><div className="section-header"><div><h3 ref={heading} tabIndex={-1}>Account help</h3><p className="muted">Use the verified recovery path allowed by the institution and account-wide policy.</p></div></div><div className="sa02-request-grid"><TextField label="Account email" type="email" autoComplete="email" placeholder="you@school.edu" maxLength={254} required value={email} onChange={e=>setEmail(e.target.value)}/><SelectField label="I need to" required value={help} onChange={e=>setHelp(e.target.value as typeof help)}><option value="">Choose an account action</option><option value="ACTIVATE">Activate invited account</option><option value="RESET">Reset password</option></SelectField></div><div className="workspace-choice-actions"><ButtonLink href="/sign-in" variant="secondary">Cancel</ButtonLink><Button disabled={!email.trim()||!help} onClick={()=>move(1)}>Continue <span aria-hidden="true">→</span></Button></div></section>}
  {stage===1&&<section className="workspace-choice-stage"><div className="section-header"><div><h3 ref={heading} tabIndex={-1}>Next steps</h3><p className="muted">The public response does not reveal whether an account exists or which institution restricts recovery.</p></div></div><Checkbox label="I will use the school’s verified recovery instructions." checked={ack} onChange={e=>setAck(e.target.checked)}/><div className="workspace-choice-actions"><Button variant="secondary" onClick={()=>move(0)}>← Back</Button><Button disabled={!ack} onClick={()=>move(2)}>Continue <span aria-hidden="true">→</span></Button></div></section>}
  {stage===2&&<section className="workspace-choice-stage"><div className="section-header"><div><h3 ref={heading} tabIndex={-1}>Review and confirm</h3><p className="muted">Check the intended outcome before requesting account help.</p></div></div><dl className="workspace-choice-review"><div><dt>Account email</dt><dd>{email}</dd></div><div><dt>I need to</dt><dd>{help==="RESET"?"Reset password":"Activate invited account"}</dd></div><div><dt>I will use the school’s verified recovery instructions.</dt><dd>Confirmed</dd></div></dl><div className="workspace-choice-outcome"><h4>Expected outcome</h4><p>A generic acknowledgement and permitted recovery instructions are shown.</p></div>{error&&<div ref={feedback} tabIndex={-1}><Alert tone="danger" title="Request not submitted">{error}</Alert></div>}<div className="workspace-choice-actions"><Button variant="secondary" disabled={busy} onClick={()=>move(1)}>← Back</Button><Button loading={busy} onClick={()=>void confirm()}>{busy?"Submitting…":"Confirm"} <span aria-hidden="true">✓</span></Button></div></section>}
 </div>;
}

let capturedEmailLinkToken="";
function useEmailLinkToken(){const token=useSyncExternalStore(subscribeHash,readHash,getServerToken);useEffect(()=>{if(token&&window.location.hash)window.history.replaceState(null,"",window.location.pathname);},[token]);return {token,clearToken(){capturedEmailLinkToken="";window.dispatchEvent(new Event("vschool-email-token"));}};}
function subscribeHash(callback:()=>void){window.addEventListener("hashchange",callback);window.addEventListener("vschool-email-token",callback);return()=>{window.removeEventListener("hashchange",callback);window.removeEventListener("vschool-email-token",callback);};}
function getServerToken(){return "";}
function readHash(){if(window.location.hash)capturedEmailLinkToken=window.location.hash.slice(1);return capturedEmailLinkToken;}
export function ResetPasswordForm(){
 const {token,clearToken}=useEmailLinkToken(),[password,setPassword]=useState(""),[confirmation,setConfirmation]=useState(""),[busy,setBusy]=useState(false),[completed,setCompleted]=useState(false),[error,setError]=useState("");
 const feedback=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(completed||error)feedback.current?.focus();},[completed,error]);
 return <>
  {!token&&!completed&&!error&&<Alert tone="warning" title="Reset link required">Open the link from your email, or <Link href="/forgot-password">request a new reset link</Link>.</Alert>}
  {!token&&!completed&&error&&<div ref={feedback} tabIndex={-1}><Alert tone="danger" title="Reset not completed">{error} <Link href="/forgot-password">Request a new reset link</Link>.</Alert></div>}
  {completed?<div ref={feedback} tabIndex={-1} className="control-stack"><Alert tone="success" title="Password changed">Sign in with your new password. Your other school memberships remain in place.</Alert><ButtonLink href="/sign-in">Go to sign in</ButtonLink></div>:
   token&&<form className="control-stack" onSubmit={async event=>{event.preventDefault();setBusy(true);setError("");try{const response=await fetch("/api/v1/password-reset/accept",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,password,confirmation})});if(!response.ok)throw new Error("invalid");clearToken();setCompleted(true);setPassword("");setConfirmation("");}catch{clearToken();setPassword("");setConfirmation("");setError("This reset link is invalid, expired, already used, or the password confirmation did not match. Request a new link.");}finally{setBusy(false);requestAnimationFrame(()=>feedback.current?.focus());}}}>
    <TextField label="New password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/>
    <TextField label="Confirm new password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/>
    {error&&<div className="alert alert-danger" role="alert" tabIndex={-1} ref={feedback}>{error}</div>}
    <Button type="submit" loading={busy}>{busy?"Changing password…":"Change password"}</Button>
   </form>}
 </>;
}

export function StaffInviteAcceptanceForm(){
 const {token,clearToken}=useEmailLinkToken(),[password,setPassword]=useState(""),[confirmation,setConfirmation]=useState(""),[busy,setBusy]=useState(false),[accepted,setAccepted]=useState(false),[error,setError]=useState(""),feedback=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(accepted||error)feedback.current?.focus();},[accepted,error]);
 return <>
  {!token&&!accepted&&!error&&<Alert tone="warning" title="Invitation link required">Open the link from your invitation email or ask the school administrator to resend it.</Alert>}
  {!token&&!accepted&&error&&<div ref={feedback} tabIndex={-1}><Alert tone="danger" title="Invitation not accepted">{error}</Alert></div>}
  {accepted?<div ref={feedback} tabIndex={-1} className="control-stack"><Alert tone="success" title="Invitation accepted">Sign in to continue. Your invitation only activated this school membership.</Alert><ButtonLink href="/sign-in">Go to sign in</ButtonLink></div>:
   token&&<form className="control-stack" onSubmit={async event=>{event.preventDefault();setBusy(true);setError("");try{const response=await fetch("/api/v1/invitations/accept",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,...(password?{initialPassword:password,confirmation}:{})})});if(!response.ok)throw new Error();clearToken();setAccepted(true);setPassword("");setConfirmation("");}catch{clearToken();setPassword("");setConfirmation("");setError("This invitation is invalid, expired, revoked, or no longer authorized. Ask the administrator to resend it.");}finally{setBusy(false);}}}>
    <Alert title="Invitation details">If you already have a VSchool account, leave the password fields blank. A first-time account needs an initial password.</Alert>
    <TextField label="Initial password (first-time accounts only)" type="password" autoComplete="new-password" minLength={12} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/>
    {password&&<TextField label="Confirm initial password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/>}
    {error&&<Alert tone="danger" title="Invitation not accepted">{error}</Alert>}
    <Button type="submit" loading={busy}>{busy?"Accepting…":"Accept invitation"}</Button>
   </form>}
 </>;
}
