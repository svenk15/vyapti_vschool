import {getStudentRegistrationActions} from "@/lib/server/student-http";
export const dynamic="force-dynamic";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return getStudentRegistrationActions(request,(await params).id);}
