import {parentWithdraw} from '@/lib/server/attendance-explanations-http';
export const dynamic='force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return parentWithdraw(request,(await params).id);}
