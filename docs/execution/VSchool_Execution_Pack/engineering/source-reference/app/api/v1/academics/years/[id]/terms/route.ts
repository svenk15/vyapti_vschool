import {replaceAcademicTerms} from '@/lib/server/academic-http';
export async function PUT(request:Request,context:{params:Promise<{id:string}>}){return replaceAcademicTerms(request,(await context.params).id);}
