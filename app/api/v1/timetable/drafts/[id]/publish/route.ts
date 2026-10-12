import {publishTimetableDraft} from '@/lib/server/academic-http';

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return publishTimetableDraft(request,(await params).id);}
