import 'server-only';
import {randomUUID} from 'node:crypto';
import {AccessError} from '../../backend/modules/access/contracts';
import {GuardianError} from '../../backend/modules/guardians/contracts';
import {getIdentity} from './auth';
import {guardiansGateway} from './guardians';

const headers={'Cache-Control':'private, no-store'};
function responseError(error:unknown){
 const code=error instanceof GuardianError||error instanceof AccessError?error.code:'UNAVAILABLE';
 const status=code==='UNAUTHENTICATED'?401:code==='FORBIDDEN'?403:code==='NOT_FOUND'?404:code==='VALIDATION'||code==='INVITATION_INVALID'?422:code==='UNAVAILABLE'||code==='RELEASE_UNAVAILABLE'?503:409;
 const messages:Record<string,string>={UNAUTHENTICATED:'Sign in to continue.',FORBIDDEN:'Your current permission does not allow family access changes.',NOT_FOUND:'This student or family access record is unavailable.',VALIDATION:'Check the guardian details and confirmation.',INVITATION_INVALID:'This invitation is invalid, expired, revoked or belongs to another account.',CONFLICT:'This guardian already has active access, or the account cannot be invited.',STALE_VERSION:'Family access changed. Refresh and try again.',IDEMPOTENCY_CONFLICT:'This request key was already used for different details.',RELEASE_UNAVAILABLE:'Family access is unavailable in this release.',MODULE_NOT_LICENSED:'Family access is not active for this institution.',MODULE_DISABLED:'Family access is not active for this branch.',UNAVAILABLE:'Family access is temporarily unavailable. Retry the same request.'};
 return Response.json({code,message:messages[code]??'Unable to complete this request.',requestId:randomUUID(),retryable:status===503},{status,headers});
}
async function json(request:Request,requireKey=true){
 if(!process.env.NEXTAUTH_URL||request.headers.get('origin')!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError('FORBIDDEN');
 const reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;
 if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>8192){void reader.cancel();throw new AccessError('VALIDATION');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{const value=JSON.parse(new TextDecoder().decode(bytes));if(!value||typeof value!=='object'||Array.isArray(value))throw new Error();if(requireKey){const key=(value as Record<string,unknown>).key;if(typeof key!=='string'||request.headers.get('idempotency-key')!==key)throw new AccessError('VALIDATION');}return value as Record<string,unknown>;}catch(error){if(error instanceof AccessError)throw error;throw new AccessError('VALIDATION');}
}
export async function listGuardianAccess(request:Request,studentId:string){try{return Response.json({items:await guardiansGateway.listForStudent(await getIdentity(),studentId)},{headers});}catch(error){return responseError(error);}}
export async function authorizeGuardian(request:Request,studentId:string){try{const body=await json(request),result=await guardiansGateway.authorize(await getIdentity(),studentId,{displayName:body.displayName,email:body.email,confirmed:body.confirmed,key:body.key,requestId:randomUUID()});return Response.json(result,{status:result.replayed?200:201,headers});}catch(error){return responseError(error);}}
export async function resendGuardianInvitation(request:Request,accessId:string){try{const body=await json(request),result=await guardiansGateway.resend(await getIdentity(),accessId,{key:body.key,requestId:randomUUID()});return Response.json(result,{headers});}catch(error){return responseError(error);}}
export async function removeGuardianAccess(request:Request,accessId:string){try{const body=await json(request),result=await guardiansGateway.remove(await getIdentity(),accessId,{expectedVersion:body.expectedVersion,reason:body.reason,key:body.key,requestId:randomUUID()});return Response.json(result,{headers});}catch(error){return responseError(error);}}
export async function setGuardianPurpose(request:Request,accessId:string){try{const body=await json(request),input={expectedVersion:body.expectedVersion,enabled:body.enabled,key:body.key,requestId:randomUUID()},identity=await getIdentity(),result=body.purpose==='calendar'?await guardiansGateway.setCalendarPurpose(identity,accessId,input):body.purpose==='learning'?await guardiansGateway.setLearningPurpose(identity,accessId,input):body.purpose==='explanation'?await guardiansGateway.setExplanationPurpose(identity,accessId,input):(()=>{throw new AccessError('VALIDATION');})();return Response.json(result,{headers});}catch(error){return responseError(error);}}
export async function acceptFamilyInvitation(request:Request){try{const body=await json(request,false),result=await guardiansGateway.accept(await getIdentity(),{token:body.token,initialPassword:body.initialPassword,confirmation:body.confirmation,requestId:randomUUID()});return Response.json(result,{headers});}catch(error){return responseError(error);}}
export async function getFamilyWorkspace(){try{return Response.json(await guardiansGateway.workspace(await getIdentity()),{headers});}catch(error){return responseError(error);}}
export async function getFamilyAttendance(request:Request){try{const url=new URL(request.url);return Response.json(await guardiansGateway.attendance(await getIdentity(),url.searchParams.get('child'),url.searchParams.get('from'),url.searchParams.get('until')),{headers});}catch(error){return responseError(error);}}
export async function getFamilyTimetable(request:Request){try{const url=new URL(request.url);return Response.json(await guardiansGateway.timetable(await getIdentity(),url.searchParams.get('child'),url.searchParams.get('week')),{headers});}catch(error){return responseError(error);}}
