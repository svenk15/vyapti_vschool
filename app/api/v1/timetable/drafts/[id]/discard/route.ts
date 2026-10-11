import {discardTimetableDraft} from '@/lib/server/academic-http';
export const dynamic='force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return discardTimetableDraft(request,(await params).id);}
