import {endAcademicTeacherAssignment} from '@/lib/server/academic-http';
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){return endAcademicTeacherAssignment(request,(await params).id);}
