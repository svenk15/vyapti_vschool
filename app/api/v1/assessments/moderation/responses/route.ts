import {respondAssessmentModeration} from '@/lib/server/assessments-http';
export async function POST(request:Request){return respondAssessmentModeration(request);}
