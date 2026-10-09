import {attendanceExport} from '@/lib/server/reporting-http';
export async function GET(request:Request){return attendanceExport(request);}
