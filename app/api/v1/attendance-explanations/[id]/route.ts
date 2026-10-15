import {reviewerDecision,reviewerGet} from '@/lib/server/attendance-explanations-http';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){return reviewerGet((await params).id);}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return reviewerDecision(request,(await params).id);}
