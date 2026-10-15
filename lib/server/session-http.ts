import 'server-only';
import {randomUUID} from 'node:crypto';
import {AccessError} from '../../backend/modules/access/contracts';
import {getSessionPrincipal} from './auth';
import {sessionGateway} from './access';

const headers={'Cache-Control':'private, no-store'};
function errorResponse(error:unknown){const code=error instanceof AccessError?error.code:'UNAVAILABLE',status=code==='UNAUTHENTICATED'?401:code==='NOT_FOUND'?404:code==='FORBIDDEN'?403:code==='VALIDATION'?422:503;return Response.json({error:code,message:code==='NOT_FOUND'?'This session is unavailable.':code==='UNAUTHENTICATED'?'Sign in to continue.':code==='FORBIDDEN'?'This action is not allowed.':'Sessions are temporarily unavailable. Try again.',requestId:randomUUID()},{status,headers});}
export async function listAccountSessions(){try{const principal=await getSessionPrincipal();if(!principal)throw new AccessError('UNAUTHENTICATED');return Response.json(await sessionGateway.list(principal.identity,principal.sessionId),{headers});}catch(error){return errorResponse(error);}}
export async function revokeAccountSession(request:Request,sessionId:string){try{if(!process.env.NEXTAUTH_URL||request.headers.get('origin')!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError('FORBIDDEN');const principal=await getSessionPrincipal();if(!principal)throw new AccessError('UNAUTHENTICATED');return Response.json(await sessionGateway.revoke(principal.identity,principal.sessionId,sessionId),{headers});}catch(error){return errorResponse(error);}}
