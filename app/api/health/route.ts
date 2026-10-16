import { getSetupStatus } from "@/lib/server/platform";
export const dynamic = "force-dynamic";
export async function GET() { const result=await getSetupStatus(); return Response.json({service:"vschool",ready:result.ready,state:result.state},{status:result.ready?200:503,headers:{"Cache-Control":"no-store"}}); }
