import {acknowledgeStudentNotice} from '@/lib/server/communication-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return acknowledgeStudentNotice(request,(await params).id);}
