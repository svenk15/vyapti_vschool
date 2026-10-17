import {routeRequest} from '@/lib/server/attendance-correction-requests-http';
export const dynamic='force-dynamic';export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return routeRequest(request,(await params).id);}
