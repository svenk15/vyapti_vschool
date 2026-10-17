import {familyRespondRequest} from '@/lib/server/requests-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return familyRespondRequest(request,(await params).id);}
