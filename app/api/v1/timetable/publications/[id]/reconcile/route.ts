import {reconcileTimetablePublication} from '@/lib/server/academic-http';

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return reconcileTimetablePublication(request,(await params).id);}
