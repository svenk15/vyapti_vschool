import {coordinationAssignees} from '@/lib/server/coordination-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return coordinationAssignees(request,(await params).id);}
