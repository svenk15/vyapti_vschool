import {reviewerClarification} from '@/lib/server/attendance-explanations-http';
export const dynamic='force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return reviewerClarification(request,(await params).id);}
