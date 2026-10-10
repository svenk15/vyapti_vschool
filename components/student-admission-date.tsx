"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {TextArea,TextField} from "@/components/ui/forms";
import {Alert,Badge,Button,Card,SectionHeader} from "@/components/ui/primitives";

async function json(response:Response){const value=await response.json() as Record<string,unknown>;if(!response.ok)throw new Error(typeof value.message==="string"?value.message:"Admission date could not be saved.");return value;}
export function StudentAdmissionDate({studentId,version:initialVersion,value,verified,verifiedAt,reason:initialReason}:{studentId:string;version:number;value:string|null;verified:boolean;verifiedAt:string|null;reason:string|null}){
 const router=useRouter(),[admittedOn,setAdmittedOn]=useState(value??""),[reason,setReason]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState("");
 async function save(){setBusy(true);setError("");setSuccess("");try{const key=crypto.randomUUID();await json(await fetch(`/api/v1/students/${studentId}/admission-date`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify({expectedVersion:initialVersion,admittedOn,reason,key})}));setSuccess("The verified branch admission date was saved. Enrollment and attendance history were unchanged.");setReason("");router.refresh();}catch(cause){setError(cause instanceof Error?cause.message:"Admission date could not be saved.");}finally{setBusy(false);}}
 return <Card className="padded settings-panel"><SectionHeader title="Branch admission date" description="This is the date the student first entered this branch. It is independent of academic-year enrollment and section transfers." actions={<Badge tone={verified?"success":"warning"}>{verified?"Verified":"Legacy date unverified"}</Badge>}/>
  <div className="settings-form student-command-form">{error&&<Alert tone="danger" title="Date not saved">{error}</Alert>}{success&&<Alert tone="success" title="Admission date saved">{success}</Alert>}
   <TextField label="Admission date" type="date" required value={admittedOn} onChange={event=>setAdmittedOn(event.target.value)} hint={verifiedAt?`Last verified ${new Date(verifiedAt).toLocaleString()}. ${initialReason??""}`:"Legacy records stay unverified until an authorized administrator supplies source-backed evidence."}/>
   <TextArea label="Verification or correction reason" required minLength={5} maxLength={500} value={reason} onChange={event=>setReason(event.target.value)} hint="Describe the source used to verify this branch-entry date."/>
   <div className="form-actions"><Button loading={busy} disabled={!admittedOn||reason.trim().length<5||(verified&&admittedOn===value)} onClick={()=>void save()}>{verified?"Save corrected date":"Verify admission date"}</Button></div>
  </div>
 </Card>;
}
