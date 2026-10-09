import {attendanceHistory} from '@/lib/server/attendance-http';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return attendanceHistory(request,(await params).id);}
