"use client";
import {useEffect,useRef,useState,useSyncExternalStore} from "react";
import Link from "next/link";
import {TextField} from "./ui/forms";
import {Alert,Button,ButtonLink} from "./ui/primitives";

export function ForgotPasswordForm(){
 const [email,setEmail]=useState(""),[busy,setBusy]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState("");
 return <form className="control-stack" onSubmit={async event=>{event.preventDefault();setBusy(true);setError("");try{const response=await fetch("/api/v1/password-reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});if(response.status===202)setSent(true);else setError("Unable to submit your request. Check the address and try again.");}catch{setError("Unable to submit your request. Try again later.");}finally{setBusy(false);}}}>
  <TextField label="Email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={e=>setEmail(e.target.value)}/>
  {sent&&<Alert tone="success" title="Check your inbox">If this account can use email recovery, instructions will be sent.</Alert>}
  {error&&<Alert tone="danger" title="Request not submitted">{error}</Alert>}
  {!sent&&<Button type="submit" loading={busy}>{busy?"Sending…":"Send reset instructions"}</Button>}
  <p className="small"><Link href="/sign-in">Back to sign in</Link></p>
 </form>;
}

let capturedEmailLinkToken="";
function useEmailLinkToken(){const token=useSyncExternalStore(subscribeHash,readHash,getServerToken);useEffect(()=>{if(token&&window.location.hash)window.history.replaceState(null,"",window.location.pathname);},[token]);return {token,clearToken(){capturedEmailLinkToken="";window.dispatchEvent(new Event("vschool-email-token"));}};}
function subscribeHash(callback:()=>void){window.addEventListener("hashchange",callback);window.addEventListener("vschool-email-token",callback);return()=>{window.removeEventListener("hashchange",callback);window.removeEventListener("vschool-email-token",callback);};}
function getServerToken(){return "";}
function readHash(){if(window.location.hash)capturedEmailLinkToken=window.location.hash.slice(1);return capturedEmailLinkToken;}
export function ResetPasswordForm(){
 const {token,clearToken}=useEmailLinkToken(),[password,setPassword]=useState(""),[confirmation,setConfirmation]=useState(""),[busy,setBusy]=useState(false),[completed,setCompleted]=useState(false),[error,setError]=useState("");
 const feedback=useRef<HTMLDivElement>(null);
 return <>
  {!token&&!completed&&!error&&<Alert tone="warning" title="Reset link required">Open the link from your email, or <Link href="/forgot-password">request a new reset link</Link>.</Alert>}
  {!token&&!completed&&error&&<Alert tone="danger" title="Reset not completed">{error} <Link href="/forgot-password">Request a new reset link</Link>.</Alert>}
  {completed?<div className="control-stack"><Alert tone="success" title="Password changed">Sign in with your new password. Your other school memberships remain in place.</Alert><ButtonLink href="/sign-in">Go to sign in</ButtonLink></div>:
   token&&<form className="control-stack" onSubmit={async event=>{event.preventDefault();setBusy(true);setError("");try{const response=await fetch("/api/v1/password-reset/accept",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,password,confirmation})});if(!response.ok)throw new Error("invalid");clearToken();setCompleted(true);setPassword("");setConfirmation("");}catch{clearToken();setPassword("");setConfirmation("");setError("This reset link is invalid, expired, already used, or the password confirmation did not match. Request a new link.");}finally{setBusy(false);requestAnimationFrame(()=>feedback.current?.focus());}}}>
    <TextField label="New password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/>
    <TextField label="Confirm new password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/>
    {error&&<div className="alert alert-danger" role="alert" tabIndex={-1} ref={feedback}>{error}</div>}
    <Button type="submit" loading={busy}>{busy?"Changing password…":"Change password"}</Button>
   </form>}
 </>;
}

export function StaffInviteAcceptanceForm(){
 const {token,clearToken}=useEmailLinkToken(),[password,setPassword]=useState(""),[confirmation,setConfirmation]=useState(""),[busy,setBusy]=useState(false),[accepted,setAccepted]=useState(false),[error,setError]=useState("");
 return <>
  {!token&&!accepted&&!error&&<Alert tone="warning" title="Invitation link required">Open the link from your invitation email or ask the school administrator to resend it.</Alert>}
  {!token&&!accepted&&error&&<Alert tone="danger" title="Invitation not accepted">{error}</Alert>}
  {accepted?<div className="control-stack"><Alert tone="success" title="Invitation accepted">Sign in to continue. Your invitation only activated this school membership.</Alert><ButtonLink href="/sign-in">Go to sign in</ButtonLink></div>:
   token&&<form className="control-stack" onSubmit={async event=>{event.preventDefault();setBusy(true);setError("");try{const response=await fetch("/api/v1/invitations/accept",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,...(password?{initialPassword:password,confirmation}:{})})});if(!response.ok)throw new Error();clearToken();setAccepted(true);setPassword("");setConfirmation("");}catch{clearToken();setPassword("");setConfirmation("");setError("This invitation is invalid, expired, revoked, or no longer authorized. Ask the administrator to resend it.");}finally{setBusy(false);}}}>
    <Alert title="Invitation details">If you already have a VSchool account, leave the password fields blank. A first-time account needs an initial password.</Alert>
    <TextField label="Initial password (first-time accounts only)" type="password" autoComplete="new-password" minLength={12} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/>
    {password&&<TextField label="Confirm initial password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/>}
    {error&&<Alert tone="danger" title="Invitation not accepted">{error}</Alert>}
    <Button type="submit" loading={busy}>{busy?"Accepting…":"Accept invitation"}</Button>
   </form>}
 </>;
}
