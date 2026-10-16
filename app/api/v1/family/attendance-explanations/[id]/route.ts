import {parentGet} from '@/lib/server/attendance-explanations-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return parentGet(request,(await params).id);}
