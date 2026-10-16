import {markNoticeRead} from '@/lib/server/communication-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return markNoticeRead(request,(await params).id);}
