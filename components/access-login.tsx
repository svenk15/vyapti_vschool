"use client";
import { useRef,useState } from "react";
import { signIn,signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TextField,Checkbox } from "./ui/forms";
import { Button } from "./ui/primitives";

export function AccessLogin() {
 const router=useRouter();
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[show,setShow]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const feedback=useRef<HTMLDivElement>(null);
 return <form className="control-stack" onSubmit={async e=>{
  e.preventDefault();setBusy(true);setError("");
  try{const result=await signIn("credentials",{email,password,redirect:false,callbackUrl:"/admin"});
   if(result?.ok&&!result.error){router.replace("/admin");router.refresh();return;}
   setError("Unable to sign in. Check your details or try again later.");
  }catch{setError("Unable to sign in. Check your details or try again later.");}
  setPassword("");setShow(false);setBusy(false);requestAnimationFrame(()=>feedback.current?.focus());
 }}>
  <TextField label="Email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/>
  <TextField label="Password" type={show?"text":"password"} autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/>
  <Checkbox label="Show password" checked={show} onChange={e=>setShow(e.target.checked)}/>
  {error&&<div className="alert alert-danger" role="alert" tabIndex={-1} ref={feedback}>{error}</div>}
  <Button type="submit" loading={busy}>{busy?"Signing in…":"Sign in"}</Button>
 </form>;
}
export function AccessSignOut(){const [busy,setBusy]=useState(false),[error,setError]=useState(false);return <div><Button variant="secondary" loading={busy} onClick={async()=>{setBusy(true);try{await signOut({callbackUrl:"/sign-in"});}catch{setError(true);setBusy(false);}}}>Sign out</Button>{error&&<p role="alert">Unable to sign out. Try again.</p>}</div>;}
