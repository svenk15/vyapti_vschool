import "server-only";
import { randomUUID } from "node:crypto";
import { adminGateway,access } from "./access";
import { getIdentity } from "./auth";
import { AccessError } from "../../backend/modules/access/contracts";
import type { ManagementCommand } from "../../shared/contracts/access-management";
const headers={"Cache-Control":"private, no-store"};
export function managementError(error:unknown,requestId=randomUUID()){
 const code=error instanceof AccessError?error.code:"UNAVAILABLE",status=code==="UNAUTHENTICATED"?401:code==="FORBIDDEN"?403:code==="NOT_FOUND"?404:code==="VALIDATION"?422:code==="INVALID_CURSOR"?400:code==="UNAVAILABLE"?503:409;
 const messages:Record<string,string>={LAST_ADMIN:"Keep at least one active school administrator.",STALE_VERSION:"This record changed. Refresh and review before saving.",TIMEZONE_IN_USE:"Timezone cannot change after a school session exists.",IDEMPOTENCY_CONFLICT:"This request key belongs to a different change.",CONFLICT:"This record already exists or its limit was reached.",VALIDATION:"Check the fields and try again.",NOT_FOUND:"This resource is unavailable.",UNAUTHENTICATED:"Sign in to continue.",UNAVAILABLE:"The service is temporarily unavailable. Retry the same request.",INVALID_CURSOR:"Refresh the staff list.",FORBIDDEN:"This action is not allowed."};
 return Response.json({code,message:messages[code]??"Unable to complete this request.",requestId,retryable:status===503},{status,headers});
}
export async function mutation(request:Request,kind:ManagementCommand["kind"],targetId?:string){
 try{
  if(!process.env.NEXTAUTH_URL||request.headers.get("origin")!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError("FORBIDDEN");
  const reader=request.body?.getReader();let length=0;const chunks:Uint8Array[]=[];
  if(reader)for(;;){const {value,done}=await reader.read();if(done)break;length+=value.byteLength;if(length>16384){void reader.cancel();return Response.json({code:"PAYLOAD_TOO_LARGE",message:"Request is too large.",requestId:randomUUID(),retryable:false},{status:413,headers});}chunks.push(value);}
  const bytes=new Uint8Array(length);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  let body;try{body=JSON.parse(new TextDecoder().decode(bytes));}catch{throw new AccessError("VALIDATION");}
  const result=await adminGateway.command(await getIdentity(),kind,body,request.headers.get("idempotency-key")??"",new URL(request.url).searchParams.get("schoolId")??undefined,targetId);
  return Response.json(result,{status:kind.startsWith("Create")&&!result.replayed?201:200,headers});
 }catch(error){return managementError(error);}
}
export async function staffList(request:Request){try{const url=new URL(request.url);return Response.json(await adminGateway.listMembers(await getIdentity(),url.searchParams.get("schoolId")??undefined,url.searchParams.get("cursor")??undefined),{headers});}catch(error){return managementError(error);}}
export async function self(request:Request){try{return Response.json(await access.getAccountHome(await getIdentity(),new URL(request.url).searchParams.get("schoolId")??undefined),{headers});}catch(error){return managementError(error);}}
