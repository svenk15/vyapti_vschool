import {teacherReadiness} from '@/lib/server/academic-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return teacherReadiness(request);}
