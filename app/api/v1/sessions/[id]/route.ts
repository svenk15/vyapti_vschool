import {attendanceSession} from '@/lib/server/attendance-http';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return attendanceSession(request,(await params).id);}
