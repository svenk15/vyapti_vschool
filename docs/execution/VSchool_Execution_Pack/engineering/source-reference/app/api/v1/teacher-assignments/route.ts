import {assignAcademicTeacher} from '@/lib/server/academic-http';
export async function POST(request:Request){return assignAcademicTeacher(request);}
