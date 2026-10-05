import {correctAttendanceSession} from '@/lib/server/attendance-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return correctAttendanceSession(request,(await params).id);}
