import {coordinationInformationResponse} from '@/lib/server/coordination-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string;informationRequestId:string}>}){const {id,informationRequestId}=await params;return coordinationInformationResponse(request,id,informationRequestId);}
