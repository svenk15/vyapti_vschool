import {acknowledgeNotice} from '@/lib/server/communication-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return acknowledgeNotice(request,(await params).id);}
