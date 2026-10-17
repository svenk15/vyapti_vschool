import {publishReviewedNotice} from '@/lib/server/communication-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return publishReviewedNotice(request,(await params).id);}
