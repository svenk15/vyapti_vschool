import {removeGuardianAccess} from '@/lib/server/guardian-http';
export const dynamic='force-dynamic';
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){return removeGuardianAccess(request,(await params).id);}
