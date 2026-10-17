import {familyWithdrawRequest} from '@/lib/server/requests-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return familyWithdrawRequest(request,(await params).id);}
