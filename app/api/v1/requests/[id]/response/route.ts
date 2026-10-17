import {respondRequest} from '@/lib/server/requests-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return respondRequest(request,(await params).id);}
