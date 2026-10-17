import {assessmentMarkWorkspace,saveAssessmentMark} from '@/lib/server/assessments-http';
export const dynamic='force-dynamic';
export async function GET(){return assessmentMarkWorkspace();}
export async function POST(request:Request){return saveAssessmentMark(request);}
