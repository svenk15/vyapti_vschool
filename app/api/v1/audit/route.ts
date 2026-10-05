import {attendanceAudit} from '@/lib/server/reporting-http';
export async function GET(request:Request){return attendanceAudit(request);}
