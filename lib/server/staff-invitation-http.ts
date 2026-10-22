import 'server-only';
import {randomUUID} from 'node:crypto';
import {AccessError} from '@/backend/modules/access/contracts';
import {access,adminGateway,selectedSchoolId} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {managementError} from '@/lib/server/management-http';
import {peopleGateway} from '@/lib/server/people';

const headers={'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'};
async function body(request:Request){const reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){void reader.cancel();throw new AccessError('VALIDATION');}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new AccessError('VALIDATION');}}

export async function getEmployeeInvitation(employeeId:string){const requestId=randomUUID();try{const identity=await getIdentity();if(!identity)throw new AccessError('UNAUTHENTICATED');const profile=await peopleGateway.staffProfile(identity,employeeId);if(profile.access.status!=='AVAILABLE')throw new AccessError('FORBIDDEN');return Response.json(profile.access.value,{headers});}catch(error){const response=managementError(error,requestId);return new Response(response.body,{status:response.status,headers});}}

export async function resendEmployeeInvitation(request:Request,employeeId:string){const requestId=randomUUID();try{
 if(!process.env.NEXTAUTH_URL||request.headers.get('origin')!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError('FORBIDDEN');
 const identity=await getIdentity();if(!identity)throw new AccessError('UNAUTHENTICATED');const input=await body(request),key=request.headers.get('idempotency-key');if(typeof input?.key!=='string'||input.key!==key)throw new AccessError('VALIDATION');
 const schoolId=await selectedSchoolId(identity),settings=await adminGateway.getSettings(identity,schoolId),result=await access.resendEmployeeInvitation({employeeId,invitationId:input.invitationId,reason:input.reason,key:input.key,organizationId:settings.organizationId,schoolId:settings.resourceId,inviterAccountId:identity.accountId,inviterTokenVersion:identity.tokenVersion,requestId});
 return Response.json(result,{status:result.replayed?200:201,headers});
 }catch(error){const response=managementError(error,requestId);return new Response(response.body,{status:response.status,headers});}}
