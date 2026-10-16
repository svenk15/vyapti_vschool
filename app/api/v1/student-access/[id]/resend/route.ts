import {resendStudentPortalInvitation} from '@/lib/server/student-portal-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return resendStudentPortalInvitation(request,(await params).id);}
