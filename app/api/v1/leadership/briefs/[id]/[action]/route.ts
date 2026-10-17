import {leadershipBriefAction} from '@/lib/server/reporting-http';
export const dynamic='force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{id:string;action:string}>}){const {id,action}=await params;return leadershipBriefAction(request,id,action);}
