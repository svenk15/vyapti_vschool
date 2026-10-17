import {assessmentMarkStatus} from '@/lib/server/assessments-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return assessmentMarkStatus(request);}
