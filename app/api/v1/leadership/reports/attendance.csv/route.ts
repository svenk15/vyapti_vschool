import {leadershipAttendanceExport} from '@/lib/server/reporting-http';
export async function GET(request:Request){return leadershipAttendanceExport(request);}
