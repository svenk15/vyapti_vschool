import {coordinationAction} from '@/lib/server/coordination-http';
const actions=['assign','start','submit','verify','return','withdraw','reopen'] as const;
export async function POST(request:Request,{params}:{params:Promise<{id:string;action:string}>}){const {id,action}=await params;if(!actions.includes(action as typeof actions[number]))return Response.json({code:'NOT_FOUND'},{status:404});return coordinationAction(request,id,action as typeof actions[number]);}
