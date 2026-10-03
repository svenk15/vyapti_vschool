import { getIdentity } from "@/lib/server/auth";
import { adminGateway } from "@/lib/server/access";
import { AccessError } from "@/backend/modules/access/contracts";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 const headers={"Cache-Control":"private, no-store"};
 try{return Response.json(await adminGateway.getHome(await getIdentity(),new URL(request.url).searchParams.get("schoolId")??undefined),{headers});}
 catch(error){const code=error instanceof AccessError?error.code:"UNAVAILABLE";const status=code==="UNAUTHENTICATED"?401:code==="NOT_FOUND"?404:503;return Response.json({error:status===503?"SERVICE_UNAVAILABLE":code},{status,headers});}
}
