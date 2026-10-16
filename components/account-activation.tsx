"use client";
import { useRef,useState } from "react";
import { TextField } from "./ui/forms";
import { Alert,Button,ButtonLink } from "./ui/primitives";
export function AccountActivation(){
 const [token,setToken]=useState(""),[password,setPassword]=useState(""),[confirmation,setConfirmation]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[success,setSuccess]=useState(false),feedback=useRef<HTMLDivElement>(null);
 return <form className="control-stack" onSubmit={async e=>{
  e.preventDefault();if(busy)return;setBusy(true);setMessage("");setSuccess(false);
  try{
   if(password!==confirmation){setMessage("Passwords must match. Re-enter the token and passwords.");return;}
   const response=await fetch("/api/v1/activate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,password,confirmation}),signal:AbortSignal.timeout(15000)});
   if(response.ok){setSuccess(true);setMessage("Your account is activated. Sign in with your new password.");}
   else{const data=await response.json();setMessage(data.message??"Unable to activate. Contact your operator.");}
  }catch{setMessage("Activation outcome is unknown. Try signing in with your new password or request a fresh operator token.");}
  finally{setToken("");setPassword("");setConfirmation("");setBusy(false);requestAnimationFrame(()=>feedback.current?.focus());}
 }}>
  <TextField label="Activation token" type="password" autoComplete="off" required minLength={43} maxLength={43} disabled={busy||success} value={token} onChange={e=>setToken(e.target.value)} hint="Paste the private one-time token supplied by your verified operator."/>
  <TextField label="New password" type="password" autoComplete="new-password" required minLength={12} disabled={busy||success} value={password} onChange={e=>setPassword(e.target.value)} hint="At least 12 characters; at most 72 UTF-8 bytes."/>
  <TextField label="Confirm new password" type="password" autoComplete="new-password" required disabled={busy||success} value={confirmation} onChange={e=>setConfirmation(e.target.value)}/>
  {message&&<div ref={feedback} tabIndex={-1}><Alert tone={success?"success":"danger"} title={success?"Account activated":"Unable to activate"}>{message}</Alert></div>}
  {!success&&<Button type="submit" loading={busy}>Activate account</Button>}
  <ButtonLink href="/sign-in" variant="secondary">Sign in</ButtonLink>
 </form>;
}
