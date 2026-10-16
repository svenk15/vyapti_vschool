import {notFound,redirect} from "next/navigation";
import {AccessError} from "@/backend/modules/access/contracts";
import {StudentEnrollmentForm} from "@/components/student-enrollment-form";
import {Alert,BrandSurface,PageHeader,PageStack} from "@/components/ui/primitives";
import {accountGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {studentsGateway} from "@/lib/server/students";

export const dynamic="force-dynamic";

function safeReturn(value:string|undefined){
  if(!value)return "/admin/students";
  try{
    const url=new URL(value,"http://vschool.local");
    if(url.pathname!=="/admin/students")return "/admin/students";
    const output=new URLSearchParams();
    for(const key of ["search","by","status","sort","order","cursor"]){const item=url.searchParams.get(key);if(item)output.set(key,item.slice(0,200));}
    return `/admin/students${output.size?`?${output}`:""}`;
  }catch{return "/admin/students";}
}

export default async function StudentEnrollmentPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{returnTo?:string|string[]}>}){
  const {id}=await params,query=await searchParams,returnTo=safeReturn(Array.isArray(query.returnTo)?undefined:query.returnTo),identity=await getIdentity();
  async function load(){const [home,student,options]=await Promise.all([accountGateway.getHome(identity),studentsGateway.get(identity,id),studentsGateway.enrollmentOptions(identity,id)]);return {home,student,options};}
  let data:Awaited<ReturnType<typeof load>>|null=null,failure:unknown;
  try{data=await load();}catch(error){failure=error;
    if(error instanceof AccessError&&error.code==="NOT_FOUND")notFound();
    if(error instanceof AccessError&&error.code==="UNAUTHENTICATED")redirect("/sign-in");
  }
  if(!data){const denied=failure instanceof AccessError&&failure.code==="FORBIDDEN";return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageStack><PageHeader title="Enroll and place a student"/><Alert tone="danger" title={denied?"Enrollment access denied":"Enrollment unavailable"}>{denied?"Current student management permission and branch scope are required.":"Academic-year and class choices could not be loaded. Refresh to retry."}</Alert></PageStack></main></BrandSurface>;}
  const {home,student,options}=data;
  if(student.status!=="ACTIVE")return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageStack><PageHeader title="Enroll and place a student" description={`${home.institutionName} · ${home.schoolName}`}/><Alert tone="warning" title="Enrollment unavailable">Archived students cannot receive a new enrollment.</Alert></PageStack></main></BrandSurface>;
  return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageStack className="branch-edit-page"><PageHeader title="Enroll and place a student" description={`${home.institutionName} · ${home.schoolName}`}/><StudentEnrollmentForm studentId={student.studentId} studentName={student.displayName} admissionNumber={student.admissionNumber} cancelHref={returnTo} options={options}/></PageStack></main></BrandSurface>;
}
