"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {TextArea} from "@/components/ui/forms";
import {Alert,Button,Card,SectionHeader} from "@/components/ui/primitives";

async function responseJson(response:Response){const value=await response.json();if(!response.ok)throw new Error(typeof value.message==="string"?value.message:"Student history could not be changed.");return value as {version:number};}
export function StudentHistoryActions({studentId,studentVersion}:{studentId:string;studentVersion:number}){
 const router=useRouter();
 const [archiveReason,setArchiveReason]=useState(""),[confirmArchive,setConfirmArchive]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 async function archive(){setBusy(true);setError("");try{const key=crypto.randomUUID();await responseJson(await fetch(`/api/v1/students/${studentId}/archive`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify({expectedVersion:studentVersion,reason:archiveReason,key})}));router.push(`/admin/students/${studentId}?saved=archive`);}catch(cause){setError(cause instanceof Error?cause.message:"Student could not be archived.");setBusy(false);}}
 return <Card className="padded settings-panel"><SectionHeader title="Student status" description="Archiving keeps the record and history. It remains unavailable while a current or future enrollment applies."/>{error&&<div role="alert" aria-label="Student history feedback"><Alert tone="danger" title="Change not saved">{error}</Alert></div>}
 <div className="student-archive-action">{confirmArchive?<div className="settings-form"><TextArea label="Archive reason" required minLength={5} maxLength={500} value={archiveReason} onChange={event=>setArchiveReason(event.target.value)}/><div className="form-actions"><Button variant="danger" disabled={busy||archiveReason.trim().length<5} loading={busy} onClick={()=>void archive()}>Confirm archive</Button><Button variant="secondary" disabled={busy} onClick={()=>setConfirmArchive(false)}>Keep active</Button></div></div>:<Button variant="secondary" disabled={busy} onClick={()=>setConfirmArchive(true)}>Archive student</Button>}</div>
 </Card>;
}
