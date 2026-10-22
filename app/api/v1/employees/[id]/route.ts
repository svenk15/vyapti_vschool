import {getEmployeeProfile} from '@/lib/server/people-http';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){return getEmployeeProfile((await params).id);}
