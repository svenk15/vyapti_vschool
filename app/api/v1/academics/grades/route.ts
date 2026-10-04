import {createAcademicGrade} from '@/lib/server/academic-http';
export async function POST(request:Request){return createAcademicGrade(request);}
