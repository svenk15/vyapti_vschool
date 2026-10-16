import {submitAttendanceSession} from '@/lib/server/attendance-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return submitAttendanceSession(request,(await params).id);}
