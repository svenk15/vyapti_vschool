import {attendanceCommandStatus} from '@/lib/server/attendance-http';
export async function GET(request:Request,{params}:{params:Promise<{command:string;key:string}>}){const {command,key}=await params;return attendanceCommandStatus(request,command,key);}
