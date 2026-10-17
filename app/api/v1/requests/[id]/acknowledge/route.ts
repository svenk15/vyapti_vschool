import {acknowledgeRequest} from '@/lib/server/requests-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return acknowledgeRequest(request,(await params).id);}
