import { BrandSurface, Alert } from "@/components/ui/primitives";
import { StudentsWorkspace } from "@/components/students-workspace";
import { getIdentity } from "@/lib/server/auth";
import { studentsGateway } from "@/lib/server/students";
import { accountGateway } from "@/lib/server/access";
import { AccessError } from "@/backend/modules/access/contracts";
export const dynamic="force-dynamic";
export default async function StudentsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const identity=await getIdentity(),params=await searchParams,first=(value:string|string[]|undefined)=>Array.isArray(value)?undefined:value,search=first(params.search),status=first(params.status);let home,initial;
  try{home=await accountGateway.getHome(identity);initial=await studentsGateway.list(identity,{search,status});}
  catch(error){const message=error instanceof AccessError&&error.code==="UNAUTHENTICATED"?"Sign in to view students.":error instanceof AccessError&&error.code==="FORBIDDEN"?"Current school permissions do not allow student access.":"Student service is not available for this branch.";return <BrandSurface><main id="main-content" className="container page-space"><Alert tone="danger" title="Students unavailable">{message}</Alert></main></BrandSurface>;}
  const initialStatus=status==='ARCHIVED'||status==='ALL'?status:'ACTIVE';
  return <BrandSurface><main id="main-content" className="container page-space"><StudentsWorkspace key={`${search??''}:${initialStatus}`} initial={initial} home={home} initialSearch={search??''} initialStatus={initialStatus}/></main></BrandSurface>;
}
