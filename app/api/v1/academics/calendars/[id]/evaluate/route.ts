import {evaluateAcademicCalendar} from '@/lib/server/academic-http';
export async function GET(request:Request,context:{params:Promise<{id:string}>}){return evaluateAcademicCalendar(request,(await context.params).id);}
