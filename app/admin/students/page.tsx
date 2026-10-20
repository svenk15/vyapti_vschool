import { BrandSurface, Alert } from "@/components/ui/primitives";
import { StudentsWorkspace } from "@/components/students-workspace";
import { getIdentity } from "@/lib/server/auth";
import { studentsGateway } from "@/lib/server/students";
import { accountGateway } from "@/lib/server/access";
import { AccessError } from "@/backend/modules/access/contracts";
import {getAdminNavigationDestinations} from "@/lib/server/admin-navigation";
import { redirect } from "next/navigation";
export const dynamic="force-dynamic";
export default async function StudentsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const identity=await getIdentity(),params=await searchParams,first=(value:string|string[]|undefined)=>Array.isArray(value)?undefined:value,search=first(params.search),status=first(params.status),by=first(params.by),sort=first(params.sort),order=first(params.order),registrationOpen=first(params.action)==='register';let initial,navigation,canRegister=false;
  try{const home=await accountGateway.getHome(identity);[initial,navigation]=await Promise.all([studentsGateway.list(identity,{search,by:by??"name",status,sort,order}),getAdminNavigationDestinations(identity,home)]);canRegister=home.capabilities.includes('student.manage');}
  catch(error){const message=error instanceof AccessError&&error.code==="UNAUTHENTICATED"?"Sign in to view students.":error instanceof AccessError&&error.code==="FORBIDDEN"?"Current school permissions do not allow student access.":"Student service is not available for this branch.";return <BrandSurface><main id="main-content" className="container page-space"><Alert tone="danger" title="Students unavailable">{message}</Alert></main></BrandSurface>;}
  if(registrationOpen)redirect("/admin/students/register?returnTo=%2Fadmin%2Fstudents");
  const initialStatus=status==='ARCHIVED'||status==='ALL'?status:'ACTIVE',initialBy=by==='admissionNumber'?'admissionNumber':'name',initialSort=sort==='admissionNumber'||sort==='status'?sort:'name',initialOrder=order==='desc'?'desc':'asc';
  const destinations=(navigation??[]).filter(item=>item.area==='students').map(item=>({label:item.label,href:item.href}));
  return <BrandSurface><main id="main-content" className="container page-space students-directory-shell"><StudentsWorkspace key={`${search??''}:${initialBy}:${initialStatus}:${initialSort}:${initialOrder}:${registrationOpen}`} initial={initial} initialSearch={search??''} initialBy={initialBy} initialStatus={initialStatus} initialSort={initialSort} initialOrder={initialOrder} initialRegistrationOpen={registrationOpen} destinations={destinations} canRegister={canRegister}/></main></BrandSurface>;
}
