import {redirect} from "next/navigation";
import {AccessError} from "@/backend/modules/access/contracts";
import {StaffCreateWorkflow} from "@/components/staff-create-workflow";
import {Alert,BrandSurface,PageHeader,PageStack} from "@/components/ui/primitives";
import {accountGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {peopleGateway} from "@/lib/server/people";
export const dynamic="force-dynamic";
export default async function CreateStaffPage(){const identity=await getIdentity();let data:Awaited<ReturnType<typeof load>>|null=null,error:unknown;async function load(){const [home,workspace]=await Promise.all([accountGateway.getHome(identity),peopleGateway.workspace(identity,{limit:1})]);return {home,workspace};}try{data=await load();}catch(cause){error=cause;if(cause instanceof AccessError&&cause.code==="UNAUTHENTICATED")redirect("/sign-in");}if(!data)return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageHeader title="Create a staff profile"/><Alert tone="danger" title={error instanceof AccessError&&error.code==="FORBIDDEN"?"Staff profile access denied":"Staff profiles unavailable"}>Current branch and staff-management permission are checked on the server.</Alert></main></BrandSurface>;return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageStack className="branch-edit-page"><PageHeader title="Create a staff profile" description={`${data.home.institutionName} · ${data.home.schoolName}`}/><StaffCreateWorkflow schoolDate={data.workspace.schoolDate}/></PageStack></main></BrandSurface>;}
