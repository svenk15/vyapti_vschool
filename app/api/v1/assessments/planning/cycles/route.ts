import {createAssessmentCycle} from '@/lib/server/assessments-http';
export async function POST(request:Request){return createAssessmentCycle(request);}
