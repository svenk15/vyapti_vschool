import {previewTimetableDraft} from '@/lib/server/academic-http';

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return previewTimetableDraft(request,(await params).id);}
