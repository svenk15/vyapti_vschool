import "server-only";
import { randomUUID } from "node:crypto";
import { access } from "./access";
import { AccessError } from "../../backend/modules/access/contracts";
const privateHeaders={"Cache-Control":"no-store","Referrer-Policy":"no-referrer"};
let start=0,attempts=0;
function response(code:string,message:string,status:number){return Response.json({code,message,requestId:randomUUID(),retryable:status===503},{status,headers:{...privateHeaders,...(status===429?{"Retry-After":"60"}:{})}});}
export async function activateRequest(request:Request){
 try{
  if(!process.env.NEXTAUTH_URL||request.headers.get("origin")!==new URL(process.env.NEXTAUTH_URL).origin)return response("FORBIDDEN","This action is not allowed.",403);
  // No untrusted forwarded header is an identity. With no trusted socket/proxy
  // adapter this stricter shared host bucket caps every source IP alike.
  const now=Date.now();if(now-start>=60000){start=now;attempts=0;}if(++attempts>20)return response("TRY_LATER","Please try again later.",429);
  const reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;
  if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){void reader.cancel();return response("PAYLOAD_TOO_LARGE","Request is too large.",413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  let body;try{body=JSON.parse(new TextDecoder().decode(bytes));}catch{return response("INVALID_ACTIVATION","Unable to activate. Check your details or request a new operator token.",400);}
  const result=await access.activate(body?.token,body?.password,body?.confirmation);
  return Response.json(result,{headers:privateHeaders});
 }catch(error){if(error instanceof AccessError&&error.code==="INVALID_ACTIVATION")return response(error.code,"Unable to activate. Check your details or request a new operator token.",400);return response("UNAVAILABLE","Service unavailable. Try signing in or contact your operator before trying another token.",503);}
}
