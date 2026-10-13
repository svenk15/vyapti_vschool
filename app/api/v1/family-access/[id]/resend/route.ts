import {resendGuardianInvitation} from '@/lib/server/guardian-http';
export const dynamic='force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return resendGuardianInvitation(request,(await params).id);}
