import 'server-only';
import {randomUUID} from 'node:crypto';
import {AccessError} from '../../backend/modules/access/contracts';
import {getIdentity} from './auth';
import {activityGateway} from './activity';
const headers={'Cache-Control':'private, no-store'};
function response(error:unknown){const code=error instanceof AccessError?error.code:'UNAVAILABLE',status=code==='UNAUTHENTICATED'?401:code==='FORBIDDEN'?403:code==='NOT_FOUND'?404:code==='VALIDATION'||code==='INVALID_CURSOR'?422:503,messages:Record<string,string>={UNAUTHENTICATED:'Sign in to review activity.',FORBIDDEN:'Your current branch role does not allow activity review.',NOT_FOUND:'This activity entry is unavailable in the current branch.',VALIDATION:'Choose a valid category and a date range of no more than 93 days.',INVALID_CURSOR:'The activity page link expired. Apply the filters again.',UNAVAILABLE:'Activity is temporarily unavailable. Retry without changing the filters.'};return Response.json({code,message:messages[code],requestId:randomUUID(),retryable:status===503},{status,headers});}
export async function listActivity(request:Request){try{const url=new URL(request.url);return Response.json(await activityGateway.list(await getIdentity(),{category:url.searchParams.get('category')??undefined,from:url.searchParams.get('from')??undefined,to:url.searchParams.get('to')??undefined,cursor:url.searchParams.get('cursor')??undefined,limit:url.searchParams.get('limit')??undefined}),{headers});}catch(error){return response(error);}}
export async function getActivity(_request:Request,eventId:string){try{return Response.json(await activityGateway.detail(await getIdentity(),eventId),{headers});}catch(error){return response(error);}}
