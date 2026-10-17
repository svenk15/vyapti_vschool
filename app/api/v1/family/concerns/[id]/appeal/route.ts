import {familyAppealRequest} from '@/lib/server/requests-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return familyAppealRequest(request,(await params).id);}
