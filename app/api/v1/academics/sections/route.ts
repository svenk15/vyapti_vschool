import {createAcademicSection} from '@/lib/server/academic-http';
export async function POST(request:Request){return createAcademicSection(request);}
