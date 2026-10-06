import { BranchSwitcher } from "@/components/institution-context";
import { redirect,notFound } from "next/navigation";
import { accountGateway,contextGateway } from "@/lib/server/access";
import { getIdentity } from "@/lib/server/auth";
import { AccessError } from "@/backend/modules/access/contracts";
import { AccessSignOut } from "@/components/access-login";
import { BrandSurface,PageHeader,Card,Alert,ButtonLink } from "@/components/ui/primitives";
import { moduleGateway } from "@/lib/server/tenancy";
export const dynamic="force-dynamic";
export default async function AccountPage(){
 const identity=await getIdentity();let home;try{home=await accountGateway.getHome(identity);}catch(error){if(error instanceof AccessError){if(error.code==="UNAUTHENTICATED")redirect("/sign-in");if(error.code==="NOT_FOUND"){const contexts=await contextGateway.getContexts(identity).catch(()=>null);if(contexts?.institutions.some(i=>i.canManage))redirect("/institutions");notFound();}}return <main id="main-content" className="container page-space"><Alert tone="danger" title="School service unavailable">Try again later.</Alert></main>;}
 if(home.capabilities.includes("school.manage"))redirect("/admin");
 const canTeach=home.capabilities.includes("attendance.mark")&&await moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,"attendance","attendance.mark");
 return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow={home.institutionName} title="Your school account" description={home.schoolName} actions={<AccessSignOut/>}/><BranchSwitcher home={home}/><Card className="padded"><p>Your active school membership is ready.</p>{canTeach?<><p>Open your assigned classes and attendance sessions.</p><ButtonLink href="/teacher/today" variant="secondary">My teaching day</ButtonLink></>:<p>Class assignments will appear when available.</p>}</Card></main></BrandSurface>;
}
