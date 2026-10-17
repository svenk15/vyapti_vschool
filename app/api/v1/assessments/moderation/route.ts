import {assessmentModerationWorkspace,submitAssessmentModeration} from '@/lib/server/assessments-http';
export const dynamic='force-dynamic';
export async function GET(){return assessmentModerationWorkspace();}
export async function POST(request:Request){return submitAssessmentModeration(request);}
