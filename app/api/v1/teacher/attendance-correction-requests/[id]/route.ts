import {requesterRequest} from '@/lib/server/attendance-correction-requests-http';
export const dynamic='force-dynamic';export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return requesterRequest(request,'TEACHER',(await params).id)}export const POST=GET;
