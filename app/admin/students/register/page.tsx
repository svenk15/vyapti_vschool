import {redirect} from "next/navigation";
import {AccessError} from "@/backend/modules/access/contracts";
import {StudentRegistrationWorkflow} from "@/components/student-registration-workflow";
import {Alert,BrandSurface,PageHeader,PageStack} from "@/components/ui/primitives";
import {accountGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {studentsGateway} from "@/lib/server/students";

export const dynamic="force-dynamic";
function safeReturn(value:string|undefined){if(!value)return "/admin/students";try{const url=new URL(value,"http://vschool.local");return url.pathname==="/admin/students"?`${url.pathname}${url.search}`:"/admin/students";}catch{return "/admin/students";}}
function schoolToday(timezone:string){const parts=new Intl.DateTimeFormat("en-US",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()),values=Object.fromEntries(parts.map(part=>[part.type,part.value]));return `${values.year}-${values.month}-${values.day}`;}
function pendingKey(value:string|string[]|undefined){const candidate=Array.isArray(value)?undefined:value;return candidate&&/^[A-Za-z0-9_-]{16,100}$/.test(candidate)?candidate:undefined;}
export default async function RegisterStudentPage({searchParams}:{searchParams:Promise<{returnTo?:string|string[];pendingRegistration?:string|string[]}>}){
  const query=await searchParams,returnTo=safeReturn(Array.isArray(query.returnTo)?undefined:query.returnTo),identity=await getIdentity();let home:Awaited<ReturnType<typeof accountGateway.getHome>>|null=null,error:unknown;
  try{[home]=await Promise.all([accountGateway.getHome(identity),studentsGateway.list(identity,{limit:1})]);}catch(cause){error=cause;if(cause instanceof AccessError&&cause.code==="UNAUTHENTICATED")redirect("/sign-in");}
  if(!home)return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageHeader title="Register a student manually"/><Alert tone="danger" title={error instanceof AccessError&&error.code==="FORBIDDEN"?"Registration access denied":"Registration unavailable"}>Current branch, module and student-management permission are checked on the server.</Alert></main></BrandSurface>;
  return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageStack className="branch-edit-page"><PageHeader title="Register student" description={`Add a student to ${home.schoolName}.`}/><StudentRegistrationWorkflow returnTo={returnTo} schoolToday={schoolToday(home.timezone)} schoolTimezone={home.timezone} pendingOperationKey={pendingKey(query.pendingRegistration)}/></PageStack></main></BrandSurface>;
}
