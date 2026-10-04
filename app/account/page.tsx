import { BranchSwitcher } from "@/components/institution-context";
import { redirect,notFound } from "next/navigation";
import { accountGateway,contextGateway } from "@/lib/server/access";
import { getIdentity } from "@/lib/server/auth";
import { AccessError } from "@/backend/modules/access/contracts";
import { AccessSignOut } from "@/components/access-login";
import { BrandSurface,PageHeader,Card,Alert } from "@/components/ui/primitives";
export const dynamic="force-dynamic";
export default async function AccountPage(){
 let home;try{home=await accountGateway.getHome(await getIdentity());}catch(error){if(error instanceof AccessError){if(error.code==="UNAUTHENTICATED")redirect("/sign-in");if(error.code==="NOT_FOUND"){const contexts=await contextGateway.getContexts(await getIdentity()).catch(()=>null);if(contexts?.institutions.some(i=>i.canManage))redirect("/institutions");notFound();}}return <main id="main-content" className="container page-space"><Alert tone="danger" title="School service unavailable">Try again later.</Alert></main>;}
 if(home.capabilities.includes("school.manage"))redirect("/admin");
 return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow={home.institutionName} title="Your school account" description={home.schoolName} actions={<AccessSignOut/>}/><BranchSwitcher home={home}/><Card className="padded"><p>Your active school membership is ready.</p><p>Class assignments will appear when available.</p></Card></main></BrandSurface>;
}
