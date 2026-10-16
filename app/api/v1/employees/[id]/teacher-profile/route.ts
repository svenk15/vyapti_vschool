import {employeeCommand} from '@/lib/server/people-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;return employeeCommand(request,id,'enableTeacher');}
