import {staffCommandStatus} from '@/lib/server/management-http';

export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{command:string;key:string}>}){const {command,key}=await params;return staffCommandStatus(request,command,key);}
