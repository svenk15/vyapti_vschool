import {removeGuardianAccess,setGuardianPurpose} from '@/lib/server/guardian-http';
export const dynamic='force-dynamic';
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){return removeGuardianAccess(request,(await params).id);}
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){return setGuardianPurpose(request,(await params).id);}
