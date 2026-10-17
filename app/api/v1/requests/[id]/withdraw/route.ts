import {withdrawRequest} from '@/lib/server/requests-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return withdrawRequest(request,(await params).id);}
