import "server-only";
import { redirect,notFound } from "next/navigation";
import { getIdentity } from "./auth";
import { adminGateway } from "./access";
import { AccessError } from "../../backend/modules/access/contracts";
export async function loadAdminHome(){
 try{return await adminGateway.getHome(await getIdentity());}
 catch(error){if(error instanceof AccessError){if(error.code==="UNAUTHENTICATED")redirect("/sign-in");if(error.code==="NOT_FOUND")notFound();}return null;}
}
