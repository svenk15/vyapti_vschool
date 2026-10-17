import {parentRespondClarification} from '@/lib/server/attendance-explanations-http';
export const dynamic='force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{id:string;clarificationId:string}>}){const value=await params;return parentRespondClarification(request,value.id,value.clarificationId);}
