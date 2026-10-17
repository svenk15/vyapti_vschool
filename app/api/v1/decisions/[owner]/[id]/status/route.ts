import {decisionStatus} from '@/lib/server/decisions-http';

export const dynamic='force-dynamic';

export async function POST(request:Request,{params}:{params:Promise<{owner:string;id:string}>}){
 const {owner,id}=await params;
 return decisionStatus(request,owner,id);
}
