import {revokeStudentPortalAccess,setStudentPurpose} from '@/lib/server/student-portal-http';
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){return revokeStudentPortalAccess(request,(await params).id);}
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){return setStudentPurpose(request,(await params).id);}
