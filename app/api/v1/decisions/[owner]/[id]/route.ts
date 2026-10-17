import {decisionAction,decisionDetail} from '@/lib/server/decisions-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{owner:string;id:string}>}){const {owner,id}=await params;return decisionDetail(request,owner,id);}
export async function POST(request:Request,{params}:{params:Promise<{owner:string;id:string}>}){const {owner,id}=await params;return decisionAction(request,owner,id);}
