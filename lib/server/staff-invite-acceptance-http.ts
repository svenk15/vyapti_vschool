import "server-only";
import {randomUUID} from "node:crypto";
import {access} from "./access";
import {AccessError} from "../../backend/modules/access/contracts";
const headers={"Cache-Control":"no-store","Referrer-Policy":"no-referrer"};
let limitStart=0,requests=0;
function rateLimited(){const now=Date.now();if(now-limitStart>=60000){limitStart=now;requests=0;}return ++requests>30;}
async function readBody(request:Request){const reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){void reader.cancel();throw new Error("PAYLOAD_TOO_LARGE");}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder().decode(bytes));}
export async function acceptStaffInvitation(request:Request){
 if(!process.env.NEXTAUTH_URL||request.headers.get("origin")!==new URL(process.env.NEXTAUTH_URL).origin)return Response.json({message:"This action is not allowed."},{status:403,headers});
 if(rateLimited())return Response.json({message:"Please wait before trying this invitation again."},{status:429,headers:{...headers,"Retry-After":"60"}});
 try{const input=await readBody(request);await access.acceptStaffInvite({token:input?.token,initialPassword:input?.initialPassword,confirmation:input?.confirmation,requestId:randomUUID()});return Response.json({accepted:true,message:"Invitation accepted. Sign in to continue."},{headers});}
 catch(error){if(error instanceof Error&&error.message==="PAYLOAD_TOO_LARGE")return Response.json({message:"Request is too large."},{status:413,headers});if(error instanceof Error&&error.message==="INVALID_INVITATION")return Response.json({message:"This invitation is invalid, expired, revoked, already used, or no longer authorized. Contact your school administrator for a new invitation."},{status:400,headers});if(error instanceof AccessError&&error.code==="UNAVAILABLE")return Response.json({message:"The service is temporarily unavailable. Try again later."},{status:503,headers});return Response.json({message:"The service is temporarily unavailable. Try again later."},{status:503,headers});}
}
