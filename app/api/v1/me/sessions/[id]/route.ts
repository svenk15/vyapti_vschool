import {revokeAccountSession} from '@/lib/server/session-http';
export const dynamic='force-dynamic';
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){return revokeAccountSession(request,(await params).id);}
