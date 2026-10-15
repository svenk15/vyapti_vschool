import {markStudentNoticeRead} from '@/lib/server/communication-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return markStudentNoticeRead(request,(await params).id);}
