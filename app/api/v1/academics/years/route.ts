import {createAcademicYear} from '@/lib/server/academic-http';
export async function POST(request:Request){return createAcademicYear(request);}
