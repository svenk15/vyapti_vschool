import { mutation,staffList } from "@/lib/server/management-http";
export const dynamic="force-dynamic";
export const GET=staffList;
export function POST(request:Request){return mutation(request,"CreateMembership");}
