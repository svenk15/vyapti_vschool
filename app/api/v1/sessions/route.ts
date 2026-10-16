import {scheduleSession} from '@/lib/server/attendance-http';
export async function POST(request:Request){return scheduleSession(request);}
