import {assistantStatus} from '@/lib/server/assistant-http';export async function GET(request:Request,{params}:{params:Promise<{key:string}>}){return assistantStatus(request,(await params).key);}
