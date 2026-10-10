import { BranchSwitcher } from "@/components/institution-context";
import { redirect,notFound } from "next/navigation";
import { accountGateway,contextGateway } from "@/lib/server/access";
import { getIdentity } from "@/lib/server/auth";
import { AccessError } from "@/backend/modules/access/contracts";
import { AccessSignOut } from "@/components/access-login";
import { BrandSurface,PageHeader,PageStack,Card,Alert,ButtonLink } from "@/components/ui/primitives";
import { moduleGateway } from "@/lib/server/tenancy";
import {brandingGateway} from '@/lib/server/branding';
import {TeacherPortalFrame} from '@/components/teacher-portal-frame';
export const dynamic="force-dynamic";
export default async function AccountPage(){
 const identity=await getIdentity();let home;try{home=await accountGateway.getHome(identity);}catch(error){if(error instanceof AccessError){if(error.code==="UNAUTHENTICATED")redirect("/sign-in");if(error.code==="NOT_FOUND"){const contexts=await contextGateway.getContexts(identity).catch(()=>null);if(contexts?.institutions.some(i=>i.canManage))redirect("/institutions");notFound();}}return <main id="main-content" className="container page-space"><Alert tone="danger" title="School service unavailable">Try again later.</Alert></main>;}
 if(home.capabilities.includes("school.manage"))redirect("/admin");
 const canTeach=home.capabilities.includes("attendance.mark")&&await moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,"attendance","attendance.mark");
 const account=<main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow={home.institutionName} title="Your school account" description={`${home.schoolName} · ${home.timezone}`} actions={canTeach?undefined:<AccessSignOut/>}/>{!canTeach&&<BranchSwitcher home={home}/>}<Card className="padded settings-form"><h2>Active school membership</h2><p className="muted">Your account is connected to this authorized branch.</p>{canTeach?<><p>Open your assigned sessions from the teaching workspace. Current assignment and attendance permissions are checked again when each session opens.</p><ButtonLink href="/teacher/today">My teaching day</ButtonLink></>:<p>Class assignments will appear when your school enables and assigns them.</p>}</Card></PageStack></main>;
 if(canTeach){const palette=await brandingGateway.effectivePalette(identity).catch(()=>null);return <BrandSurface palette={palette??undefined}><TeacherPortalFrame home={home}>{account}</TeacherPortalFrame></BrandSurface>;}
 return <BrandSurface>{account}</BrandSurface>;
}
