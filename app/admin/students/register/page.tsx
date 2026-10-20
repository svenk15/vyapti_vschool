import {redirect} from "next/navigation";
import {AccessError} from "@/backend/modules/access/contracts";
import {StudentRegistrationWorkflow} from "@/components/student-registration-workflow";
import Link from "next/link";
import {Alert,BrandSurface,PageHeader,PageStack} from "@/components/ui/primitives";
import {accountGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {studentsGateway} from "@/lib/server/students";

export const dynamic="force-dynamic";
function safeReturn(value:string|undefined){if(!value)return "/admin/students";try{const url=new URL(value,"http://vschool.local");return url.pathname==="/admin/students"?`${url.pathname}${url.search}`:"/admin/students";}catch{return "/admin/students";}}
function schoolToday(timezone:string){const parts=new Intl.DateTimeFormat("en-US",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()),values=Object.fromEntries(parts.map(part=>[part.type,part.value]));return `${values.year}-${values.month}-${values.day}`;}
function pendingKey(value:string|string[]|undefined){const candidate=Array.isArray(value)?undefined:value;return candidate&&/^[A-Za-z0-9_-]{16,100}$/.test(candidate)?candidate:undefined;}
function BackIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6"/></svg>;}
export default async function RegisterStudentPage({searchParams}:{searchParams:Promise<{returnTo?:string|string[];pendingRegistration?:string|string[]}>}){
  const query=await searchParams,returnTo=safeReturn(Array.isArray(query.returnTo)?undefined:query.returnTo),identity=await getIdentity();let home:Awaited<ReturnType<typeof accountGateway.getHome>>|null=null,error:unknown;
  try{[home]=await Promise.all([accountGateway.getHome(identity),studentsGateway.list(identity,{limit:1})]);}catch(cause){error=cause;if(cause instanceof AccessError&&cause.code==="UNAUTHENTICATED")redirect("/sign-in");}
  if(!home)return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageHeader title="Register a student manually"/><Alert tone="danger" title={error instanceof AccessError&&error.code==="FORBIDDEN"?"Registration access denied":"Registration unavailable"}>Current branch, module and student-management permission are checked on the server.</Alert></main></BrandSurface>;
  return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell student-registration-shell"><PageStack className="branch-edit-page student-registration-page"><Link className="student-registration-back" href={returnTo}><BackIcon/> Students</Link><PageHeader title="Register student"/><StudentRegistrationWorkflow returnTo={returnTo} schoolToday={schoolToday(home.timezone)} schoolTimezone={home.timezone} pendingOperationKey={pendingKey(query.pendingRegistration)}/></PageStack></main></BrandSurface>;
}
