import {redirect} from "next/navigation";
import {AccessError} from "@/backend/modules/access/contracts";
import {StudentRegistrationWorkflow} from "@/components/student-registration-workflow";
import {Alert,BrandSurface,PageHeader,PageStack} from "@/components/ui/primitives";
import {accountGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {studentsGateway} from "@/lib/server/students";

export const dynamic="force-dynamic";
function safeReturn(value:string|undefined){if(!value)return "/admin/students";try{const url=new URL(value,"http://vschool.local");return url.pathname==="/admin/students"?`${url.pathname}${url.search}`:"/admin/students";}catch{return "/admin/students";}}
export default async function RegisterStudentPage({searchParams}:{searchParams:Promise<{returnTo?:string|string[]}>}){
  const query=await searchParams,returnTo=safeReturn(Array.isArray(query.returnTo)?undefined:query.returnTo),identity=await getIdentity();let home:Awaited<ReturnType<typeof accountGateway.getHome>>|null=null,error:unknown;
  try{[home]=await Promise.all([accountGateway.getHome(identity),studentsGateway.list(identity,{limit:1})]);}catch(cause){error=cause;if(cause instanceof AccessError&&cause.code==="UNAUTHENTICATED")redirect("/sign-in");}
  if(!home)return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageHeader title="Register a student manually"/><Alert tone="danger" title={error instanceof AccessError&&error.code==="FORBIDDEN"?"Registration access denied":"Registration unavailable"}>Current branch, module and student-management permission are checked on the server.</Alert></main></BrandSurface>;
  return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageStack className="branch-edit-page"><PageHeader title="Register student" description={`Add a student to ${home.schoolName}.`}/><StudentRegistrationWorkflow returnTo={returnTo}/></PageStack></main></BrandSurface>;
}
