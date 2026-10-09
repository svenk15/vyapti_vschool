import {attendanceReport} from '@/lib/server/reporting-http';
export async function GET(request:Request){return attendanceReport(request,true);}
