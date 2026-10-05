import {cancelAttendanceSession} from '@/lib/server/attendance-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return cancelAttendanceSession(request,(await params).id);}
