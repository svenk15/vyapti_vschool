import {createAcademicSubject} from '@/lib/server/academic-http';
export async function POST(request:Request){return createAcademicSubject(request);}
