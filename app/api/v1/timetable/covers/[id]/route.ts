import {timetableCoverDetail} from '@/lib/server/academic-http';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){return timetableCoverDetail((await params).id);}
