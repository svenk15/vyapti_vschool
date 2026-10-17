import {decideTimetableCover} from '@/lib/server/academic-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return decideTimetableCover(request,(await params).id);}
