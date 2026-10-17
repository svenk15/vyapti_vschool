import {withdrawAssessmentReport} from '@/lib/server/assessments-http';
export const dynamic='force-dynamic';
export async function POST(request:Request){return withdrawAssessmentReport(request);}
