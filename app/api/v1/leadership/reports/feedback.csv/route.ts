import {leadershipFeedbackTurnaroundExport} from '@/lib/server/reporting-http';
export async function GET(request:Request){return leadershipFeedbackTurnaroundExport(request);}
