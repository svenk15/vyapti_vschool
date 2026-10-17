import {familyRequestDetail} from '@/lib/server/requests-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return familyRequestDetail(request,(await params).id);}
