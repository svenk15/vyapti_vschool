import {publishAcademicCalendar} from '@/lib/server/academic-http';
export async function POST(request:Request,context:{params:Promise<{id:string}>}){return publishAcademicCalendar(request,(await context.params).id);}
