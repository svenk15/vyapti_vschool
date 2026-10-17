import {decideRequest} from '@/lib/server/requests-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return decideRequest(request,(await params).id);}
