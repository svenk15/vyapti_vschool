import {coordinationDetail} from '@/lib/server/coordination-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return coordinationDetail(request,(await params).id);}
