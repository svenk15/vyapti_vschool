import {openAttendanceSession} from '@/lib/server/attendance-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return openAttendanceSession(request,(await params).id);}
