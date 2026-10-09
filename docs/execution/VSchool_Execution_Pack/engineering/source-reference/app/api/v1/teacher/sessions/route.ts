import {teacherSessions} from '@/lib/server/attendance-http';
export async function GET(request:Request){return teacherSessions(request);}
