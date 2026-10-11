import {redirect} from "next/navigation";
import {AccessError} from "@/backend/modules/access/contracts";
import {StudentEnrollmentPicker} from "@/components/student-enrollment-picker";
import {Alert,BrandSurface,PageHeader,PageStack} from "@/components/ui/primitives";
import {accountGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {studentsGateway} from "@/lib/server/students";

export const dynamic="force-dynamic";
function safeReturn(value:string|undefined){if(!value)return "/admin/students";try{const url=new URL(value,"http://vschool.local");return url.pathname==="/admin/students"?`${url.pathname}${url.search}`:"/admin/students";}catch{return "/admin/students";}}
export default async function ChooseStudentEnrollmentPage({searchParams}:{searchParams:Promise<{returnTo?:string|string[]}>}){
  const query=await searchParams,returnTo=safeReturn(Array.isArray(query.returnTo)?undefined:query.returnTo),identity=await getIdentity();let data:Awaited<ReturnType<typeof load>>|null=null,error:unknown;
  async function load(){const [home,students]=await Promise.all([accountGateway.getHome(identity),studentsGateway.list(identity,{status:"ACTIVE",sort:"name",order:"asc",limit:100})]);return {home,students};}
  try{data=await load();}catch(cause){error=cause;if(cause instanceof AccessError&&cause.code==="UNAUTHENTICATED")redirect("/sign-in");}
  if(!data)return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageHeader title="Enroll and place a student"/><Alert tone="danger" title={error instanceof AccessError&&error.code==="FORBIDDEN"?"Enrollment access denied":"Enrollment unavailable"}>Current branch, module and student-management permission are checked on the server.</Alert></main></BrandSurface>;
  return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageStack className="branch-edit-page"><PageHeader title="Enroll and place a student" description={`${data.home.institutionName} · ${data.home.schoolName}`}/><StudentEnrollmentPicker students={data.students.items} hasMore={data.students.nextCursor!==null} returnTo={returnTo}/></PageStack></main></BrandSurface>;
}
