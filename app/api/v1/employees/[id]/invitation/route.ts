import {getEmployeeInvitation,resendEmployeeInvitation} from '@/lib/server/staff-invitation-http';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;return getEmployeeInvitation(id);}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;return resendEmployeeInvitation(request,id);}
