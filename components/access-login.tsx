"use client";
import { useRef,useState } from "react";
import { signIn,signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField } from "./ui/forms";
import { Button,ButtonLink } from "./ui/primitives";

export function AccessLogin() {
 const router=useRouter();
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[show,setShow]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const feedback=useRef<HTMLDivElement>(null);
 return <form className="control-stack access-login-form" onSubmit={async e=>{
  e.preventDefault();setBusy(true);setError("");
  try{const result=await signIn("credentials",{email,password,redirect:false,callbackUrl:"/admin"});
   if(result?.ok&&!result.error){router.replace("/choose-workspace");router.refresh();return;}
   setError("Unable to sign in. Check your details or try again later.");
  }catch{setError("Unable to sign in. Check your details or try again later.");}
  setPassword("");setShow(false);setBusy(false);requestAnimationFrame(()=>feedback.current?.focus());
 }}>
  <TextField label="Email address" type="email" autoComplete="username" placeholder="you@school.edu" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/>
  <div className="access-login-password"><TextField label="Password" type={show?"text":"password"} autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/><Button variant="ghost" size="small" aria-label={show?"Hide password":"Show password"} aria-pressed={show} onClick={()=>setShow(value=>!value)}>{show?"Hide":"Show"}</Button></div>
  <div className="access-login-help"><span className="small muted">Your school manages your access.</span><Link className="small" href="/forgot-password">Need help signing in?</Link></div>
  {error&&<div className="alert alert-danger" role="alert" tabIndex={-1} ref={feedback}>{error}</div>}
  <Button type="submit" loading={busy}>{busy?"Signing in…":"Sign in"}</Button>
 </form>;
}
export function AccessSignOut({staged=false}:{staged?:boolean}){const [busy,setBusy]=useState(false),[error,setError]=useState(false);if(staged)return <ButtonLink href="/admin/context?destination=sign-out" variant="secondary">Sign out</ButtonLink>;return <div><Button variant="secondary" loading={busy} onClick={async()=>{setBusy(true);try{await signOut({callbackUrl:"/sign-in"});}catch{setError(true);setBusy(false);}}}>Sign out</Button>{error&&<p role="alert">Unable to sign out. Try again.</p>}</div>;}
