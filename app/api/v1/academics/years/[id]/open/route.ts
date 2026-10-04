import {transitionAcademicYear} from '@/lib/server/academic-http';
export async function POST(request:Request,context:{params:Promise<{id:string}>}){return transitionAcademicYear(request,(await context.params).id,'OPEN');}
