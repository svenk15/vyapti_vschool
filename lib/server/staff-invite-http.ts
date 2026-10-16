import "server-only";
import {randomUUID} from "node:crypto";
import {access} from "./access";
import {adminGateway,selectedSchoolId} from "./access";
import {getIdentity} from "./auth";
import {AccessError} from "../../backend/modules/access/contracts";
import {managementError} from "./management-http";
const headers={"Cache-Control":"private, no-store","Referrer-Policy":"no-referrer"};
export async function createStaffInvitation(request:Request){
 const requestId=randomUUID();try{
  if(!process.env.NEXTAUTH_URL||request.headers.get("origin")!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError("FORBIDDEN");
  const identity=await getIdentity();if(!identity)throw new AccessError("UNAUTHENTICATED");
  const url=new URL(request.url),candidate=url.searchParams.get("schoolId")??await selectedSchoolId(identity),settings=await adminGateway.getSettings(identity,candidate),reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;
  if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){void reader.cancel();return Response.json({code:"PAYLOAD_TOO_LARGE",message:"Request is too large.",requestId,retryable:false},{status:413,headers});}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  let input;try{input=JSON.parse(new TextDecoder().decode(bytes));}catch{throw new AccessError("VALIDATION");}
  const result=await access.inviteStaff({email:input?.email,roles:input?.roles,organizationId:settings.organizationId,schoolId:settings.resourceId,inviterAccountId:identity.accountId,inviterTokenVersion:identity.tokenVersion,requestId});
  return Response.json(result,{status:201,headers});
 }catch(error){const response=managementError(error,requestId);return new Response(response.body,{status:response.status,headers});}
}

export async function grantEmployeeAccess(request:Request){
 const requestId=randomUUID();try{
  if(!process.env.NEXTAUTH_URL||request.headers.get("origin")!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError("FORBIDDEN");
  const identity=await getIdentity();if(!identity)throw new AccessError("UNAUTHENTICATED");
  const url=new URL(request.url),candidate=url.searchParams.get("schoolId")??await selectedSchoolId(identity),settings=await adminGateway.getSettings(identity,candidate),reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;
  if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){void reader.cancel();return Response.json({code:"PAYLOAD_TOO_LARGE",message:"Request is too large.",requestId,retryable:false},{status:413,headers});}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  let input;try{input=JSON.parse(new TextDecoder().decode(bytes));}catch{throw new AccessError("VALIDATION");}
  const key=request.headers.get("idempotency-key");if(typeof input?.key!=="string"||input.key!==key)throw new AccessError("VALIDATION");
  const result=await access.grantEmployeeAccess({employeeId:input.employeeId,email:input.email,verificationReference:input.verificationReference,confirmed:input.confirmed,roles:input.roles,key:input.key,organizationId:settings.organizationId,schoolId:settings.resourceId,inviterAccountId:identity.accountId,inviterTokenVersion:identity.tokenVersion,requestId});
  return Response.json(result,{status:result.replayed?200:201,headers});
 }catch(error){const response=managementError(error,requestId);return new Response(response.body,{status:response.status,headers});}
}
