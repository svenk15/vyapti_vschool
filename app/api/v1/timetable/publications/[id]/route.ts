import {timetablePublication} from '@/lib/server/academic-http';

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){return timetablePublication((await params).id);}
