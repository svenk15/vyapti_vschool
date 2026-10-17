import {decisionRecusal} from '@/lib/server/decisions-http';
export async function POST(request:Request,{params}:{params:Promise<{owner:string;id:string}>}){const {owner,id}=await params;return decisionRecusal(request,owner,id);}
