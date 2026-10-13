import {revokeStudentPortalAccess} from '@/lib/server/student-portal-http';
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){return revokeStudentPortalAccess(request,(await params).id);}
