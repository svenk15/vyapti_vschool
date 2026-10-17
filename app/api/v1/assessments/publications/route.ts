import {assessmentPublicationWorkspace,assignAssessmentReportPublisher} from '@/lib/server/assessments-http';
export const dynamic='force-dynamic';
export async function GET(){return assessmentPublicationWorkspace();}
export async function POST(request:Request){return assignAssessmentReportPublisher(request);}
