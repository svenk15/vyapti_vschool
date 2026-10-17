import {assessmentPlanningStatus} from '@/lib/server/assessments-http';
export async function GET(request:Request){return assessmentPlanningStatus(request);}
