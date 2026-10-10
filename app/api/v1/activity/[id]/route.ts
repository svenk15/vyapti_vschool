import {getActivity} from '@/lib/server/activity-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return getActivity(request,(await params).id);}
