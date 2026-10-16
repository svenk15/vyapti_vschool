import {redirect} from "next/navigation";
import {AccessError} from "@/backend/modules/access/contracts";
import {StudentTransferWorkflow} from "@/components/student-transfer-workflow";
import {Alert,BrandSurface,PageHeader,PageStack} from "@/components/ui/primitives";
import {accountGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {studentsGateway} from "@/lib/server/students";

export const dynamic="force-dynamic";

function scalar(value:string|string[]|undefined){return Array.isArray(value)?undefined:value;}
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

export default async function StudentTransferPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const query=await searchParams,studentId=scalar(query.studentId),returnTo=safeReturn(scalar(query.returnTo)),identity=await getIdentity();
  let data:Awaited<ReturnType<typeof load>>|null=null,error:unknown;
  async function load(){
    const [home,initial]=await Promise.all([accountGateway.getHome(identity),studentsGateway.list(identity,{status:"ACTIVE",sort:"name",order:"asc",limit:50})]);
    const selected=studentId?await Promise.all([studentsGateway.get(identity,studentId),studentsGateway.enrollmentOptions(identity,studentId)]).then(([student,options])=>({student,options})):null;
    return {home,initial,selected};
  }
  try{
    data=await load();
  }catch(cause){
    error=cause;
    if(error instanceof AccessError&&error.code==="UNAUTHENTICATED")redirect("/sign-in");
  }
  if(!data){const denied=error instanceof AccessError&&error.code==="FORBIDDEN";return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageHeader title="Move a student to another section"/><Alert tone="danger" title={denied?"Transfer access denied":"Transfer unavailable"}>Current institution, branch, module and student-management access are checked on the server. The selected Student may also be unavailable in this branch.</Alert></main></BrandSurface>;}
  return <BrandSurface><main id="main-content" className="container page-space branch-edit-shell"><PageStack className="branch-edit-page student-transfer-page"><PageHeader title="Move a student to another section" description={`${data.home.institutionName} · ${data.home.schoolName}`}/><StudentTransferWorkflow initial={data.initial} selected={data.selected} returnTo={returnTo}/></PageStack></main></BrandSurface>;
}
