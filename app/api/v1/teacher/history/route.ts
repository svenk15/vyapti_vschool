import {teacherAttendanceHistory} from '@/lib/server/attendance-http';
export async function GET(request:Request){return teacherAttendanceHistory(request);}
