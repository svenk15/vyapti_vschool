import { mutation } from "@/lib/server/management-http";
export const dynamic="force-dynamic";
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){return mutation(request,"UpdateMembership",(await context.params).id);}
