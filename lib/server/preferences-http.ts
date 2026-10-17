import 'server-only';
import {randomUUID} from 'node:crypto';
import {AccessError} from '@/backend/modules/access/contracts';
import {preferenceGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';

const headers={'Cache-Control':'private, no-store'};
function errorResponse(error:unknown){const code=error instanceof AccessError?error.code:'UNAVAILABLE',status=code==='UNAUTHENTICATED'?401:code==='FORBIDDEN'?403:code==='VALIDATION'?422:code==='STALE_VERSION'||code==='IDEMPOTENCY_CONFLICT'?409:503,messages:Record<string,string>={UNAUTHENTICATED:'Sign in to continue.',FORBIDDEN:'This action is not allowed.',VALIDATION:'Choose a supported density and motion preference.',STALE_VERSION:'Preferences changed. Reload and review the latest values.',IDEMPOTENCY_CONFLICT:'This request key belongs to a different preference change.',UNAVAILABLE:'Preferences are temporarily unavailable. Retry the same request.'};return Response.json({code,message:messages[code]??messages.UNAVAILABLE,requestId:randomUUID(),retryable:status===503},{status,headers});}
export async function getPreferences(){try{return Response.json(await preferenceGateway.get(await getIdentity()),{headers});}catch(error){return errorResponse(error);}}
export async function putPreferences(request:Request){try{if(!process.env.NEXTAUTH_URL||request.headers.get('origin')!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError('FORBIDDEN');const text=await request.text();if(new TextEncoder().encode(text).byteLength>4096)return Response.json({code:'PAYLOAD_TOO_LARGE',message:'Request is too large.',requestId:randomUUID(),retryable:false},{status:413,headers});let body;try{body=JSON.parse(text);}catch{throw new AccessError('VALIDATION');}return Response.json(await preferenceGateway.update(await getIdentity(),body,request.headers.get('idempotency-key')??''),{headers});}catch(error){return errorResponse(error);}}
