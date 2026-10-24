'use client';
import {useRef,useState} from 'react';
export type CommandState='idle'|'submitting'|'unknown'|'saved'|'stale'|'rejected'|'denied';
export type AttendanceCommand=Readonly<{url:string;payload:Readonly<Record<string,unknown>>}>;
export function frozenAttendanceCommand(url:string,payload:Record<string,unknown>):AttendanceCommand{
 const clone=JSON.parse(JSON.stringify(payload)) as Record<string,unknown>;
 const freeze=(value:unknown):void=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}};freeze(clone);
 return Object.freeze({url,payload:clone});
}
export function commandOutcome(status:number,body:Record<string,unknown>|null):CommandState{
 if([401,403,404].includes(status))return 'denied';
 if(status>=500||status>=200&&status<300&&!body)return 'unknown';
 if(status>=200&&status<300)return 'saved';
 if(body?.code==='STALE_VERSION'||body?.code==='CONFLICT'||body?.code==='SOURCE_CHANGED')return 'stale';
 if(body?.code==='IDEMPOTENCY_CONFLICT')return 'unknown';
 return 'rejected';
}
export function validAttendanceReceipt(kind:'review'|'correction'|'cancel',url:string,data:Record<string,unknown>|null){
 if(!data||typeof data.version!=='number'||!Number.isInteger(data.version)||data.version<1)return false;
 const parts=url.split('/'),target=parts.at(-1)==='clarifications'?parts.at(-2):kind==='review'?parts.at(-1):parts.at(-2);
 if(kind==='correction')return data.sessionId===target&&typeof data.revision==='number'&&Array.isArray(data.changes);
 if(kind==='cancel')return data.sessionId===target&&typeof data.revision==='number'&&data.status==='CANCELLED';
 return typeof data.status==='string'&&(parts.at(-1)==='clarifications'?data.explanationId===target&&typeof data.id==='string':data.id===target);
}
export function useAttendanceCommand(receiptKind:'review'|'correction'|'cancel'='review'){
 const [state,setState]=useState<CommandState>('idle'),[message,setMessage]=useState(''),[receipt,setReceipt]=useState<Record<string,unknown>|null>(null),pending=useRef<AttendanceCommand|null>(null),busy=useRef(false),completed=useRef(false);
 const reset=()=>{if(busy.current||state==='unknown')return;pending.current=null;completed.current=false;setState('idle');setMessage('');setReceipt(null);};
 async function execute(command:AttendanceCommand){
  if(busy.current||completed.current||state==='saved'||state==='denied')return;
  const retained=pending.current??command;pending.current=retained;busy.current=true;setState('submitting');setMessage('');
  try{
   const response=await fetch(retained.url,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':String(retained.payload.key)},body:JSON.stringify(retained.payload)});
   const data=await response.json().catch(()=>null) as Record<string,unknown>|null;
   const valid=validAttendanceReceipt(receiptKind,retained.url,data);
   const outcome=commandOutcome(response.status,response.ok&&!valid?null:data);setState(outcome);
   if(outcome==='saved'){completed.current=true;setReceipt(data);pending.current=null;setMessage('Decision saved.');}
   else if(outcome==='unknown')setMessage('The result is not confirmed. Retry the same request; its details and key are retained.');
   else {pending.current=null;setMessage(outcome==='denied'?'This request is no longer available with your current access.':typeof data?.message==='string'?data.message:'Review the latest request before continuing.');}
  }catch{setState('unknown');setMessage('The result is not confirmed. Retry the same request; its details and key are retained.');}
  finally{busy.current=false;}
 }
 return {state,message,receipt,execute,reset,locked:state==='submitting'||state==='unknown',retained:pending};
}
