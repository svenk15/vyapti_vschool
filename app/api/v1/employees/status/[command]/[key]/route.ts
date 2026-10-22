import {employeeCommandStatus} from '@/lib/server/people-http';

export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{command:string;key:string}>}){const {command,key}=await params;return employeeCommandStatus(command,key);}
