import "server-only";
import {randomUUID} from "node:crypto";
import {access} from "./access";
const headers={"Cache-Control":"no-store","Referrer-Policy":"no-referrer"};
let windowStart=0,requestCount=0;
function sameOrigin(request:Request){return !!process.env.NEXTAUTH_URL&&request.headers.get("origin")===new URL(process.env.NEXTAUTH_URL).origin;}
async function body(request:Request){
 const reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;
 if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){void reader.cancel();throw new Error("PAYLOAD_TOO_LARGE");}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
function bucket(){const now=Date.now();if(now-windowStart>=60000){windowStart=now;requestCount=0;}return ++requestCount<=30;}
export async function requestPasswordReset(request:Request){
 const started=Date.now();
 if(!sameOrigin(request))return Response.json({accepted:false,message:"This action is not allowed."},{status:403,headers});
 if(!bucket())return Response.json({accepted:true,message:"If the account can use email recovery, instructions will be sent."},{status:202,headers});
 try{
  const input=await body(request);await access.requestPasswordReset(input?.email,randomUUID());
  const remaining=200-(Date.now()-started);if(remaining>0)await new Promise(resolve=>setTimeout(resolve,remaining));
  return Response.json({accepted:true,message:"If the account can use email recovery, instructions will be sent."},{status:202,headers});
 }catch(error){
  if(error instanceof Error&&error.message==="PAYLOAD_TOO_LARGE")return Response.json({accepted:false,message:"Request is too large."},{status:413,headers});
  if(error instanceof SyntaxError)return Response.json({accepted:false,message:"Check the email address and try again."},{status:400,headers});
  return Response.json({accepted:false,message:"The service is temporarily unavailable. Try again later."},{status:503,headers});
 }
}
export async function acceptPasswordReset(request:Request){
 if(!sameOrigin(request))return Response.json({message:"This action is not allowed."},{status:403,headers});
 if(!bucket())return Response.json({message:"This reset link is invalid, expired, or already used. Request a new link."},{status:400,headers});
 try{const input=await body(request);await access.acceptPasswordReset(input?.token,input?.password,input?.confirmation,randomUUID());return Response.json({reset:true,message:"Password changed. Sign in with your new password."},{headers});}
 catch(error){if(error instanceof Error&&error.message==="PAYLOAD_TOO_LARGE")return Response.json({message:"Request is too large."},{status:413,headers});if(error instanceof SyntaxError)return Response.json({message:"Check the password and try again."},{status:400,headers});if(error instanceof Error&&error.message==="INVALID_RESET")return Response.json({message:"This reset link is invalid, expired, or already used. Request a new link."},{status:400,headers});return Response.json({message:"The service is temporarily unavailable. Try again later."},{status:503,headers});}
}
