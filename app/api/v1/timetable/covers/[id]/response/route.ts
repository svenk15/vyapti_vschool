import {respondTimetableCover} from '@/lib/server/academic-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return respondTimetableCover(request,(await params).id);}
