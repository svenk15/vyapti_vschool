import { mutation } from "@/lib/server/management-http";
export const dynamic="force-dynamic";
export function POST(request:Request){return mutation(request,"CreateCampus");}
