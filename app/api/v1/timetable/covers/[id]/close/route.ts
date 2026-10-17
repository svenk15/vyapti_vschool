import {closeTimetableCover} from '@/lib/server/academic-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return closeTimetableCover(request,(await params).id);}
