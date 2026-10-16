import {authorizeGuardian,listGuardianAccess} from '@/lib/server/guardian-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return listGuardianAccess(request,(await params).id);}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return authorizeGuardian(request,(await params).id);}
