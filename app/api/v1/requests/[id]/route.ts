import {requestDetail} from '@/lib/server/requests-http';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){return requestDetail((await params).id);}
