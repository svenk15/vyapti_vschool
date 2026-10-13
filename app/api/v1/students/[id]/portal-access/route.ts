import {authorizeStudentPortal,listStudentPortalAccess} from '@/lib/server/student-portal-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return listStudentPortalAccess(request,(await params).id);}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return authorizeStudentPortal(request,(await params).id);}
