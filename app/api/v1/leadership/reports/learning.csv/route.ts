import {leadershipAssignmentCompletionExport} from '@/lib/server/reporting-http';
export async function GET(request:Request){return leadershipAssignmentCompletionExport(request);}
