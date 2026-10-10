import { BrandSurface, Alert } from "@/components/ui/primitives";
import { StudentsWorkspace } from "@/components/students-workspace";
import { getIdentity } from "@/lib/server/auth";
import { studentsGateway } from "@/lib/server/students";
import { accountGateway } from "@/lib/server/access";
import { AccessError } from "@/backend/modules/access/contracts";
export const dynamic="force-dynamic";
export default async function StudentsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const identity=await getIdentity(),params=await searchParams,first=(value:string|string[]|undefined)=>Array.isArray(value)?undefined:value,search=first(params.search),status=first(params.status),by=first(params.by),sort=first(params.sort),order=first(params.order);let initial;
  try{await accountGateway.getHome(identity);initial=await studentsGateway.list(identity,{search,by:by??"name",status,sort,order});}
  catch(error){const message=error instanceof AccessError&&error.code==="UNAUTHENTICATED"?"Sign in to view students.":error instanceof AccessError&&error.code==="FORBIDDEN"?"Current school permissions do not allow student access.":"Student service is not available for this branch.";return <BrandSurface><main id="main-content" className="container page-space"><Alert tone="danger" title="Students unavailable">{message}</Alert></main></BrandSurface>;}
  const initialStatus=status==='ARCHIVED'||status==='ALL'?status:'ACTIVE',initialBy=by==='admissionNumber'?'admissionNumber':'name',initialSort=sort==='admissionNumber'||sort==='status'?sort:'name',initialOrder=order==='desc'?'desc':'asc';
  return <BrandSurface><main id="main-content" className="container page-space students-directory-shell"><StudentsWorkspace key={`${search??''}:${initialBy}:${initialStatus}:${initialSort}:${initialOrder}`} initial={initial} initialSearch={search??''} initialBy={initialBy} initialStatus={initialStatus} initialSort={initialSort} initialOrder={initialOrder}/></main></BrandSurface>;
}
