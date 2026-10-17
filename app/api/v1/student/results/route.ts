import {studentAssessmentReports} from '@/lib/server/assessments-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return studentAssessmentReports(new URL(request.url).searchParams.get('studentId')??'');}
