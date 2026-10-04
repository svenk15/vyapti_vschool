import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Alert, BrandSurface, ButtonLink, Card, PageHeader } from "@/components/ui/primitives";
import { AccessError } from "@/backend/modules/access/contracts";
import { getIdentity } from "@/lib/server/auth";
import { studentsGateway } from "@/lib/server/students";
export const dynamic="force-dynamic";
export default async function StudentDetailPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params,identity=await getIdentity();let student;
  try{student=await studentsGateway.get(identity,id);}
  catch(error){if(error instanceof AccessError&&error.code==="NOT_FOUND")notFound();if(error instanceof AccessError&&error.code==="UNAUTHENTICATED")redirect("/sign-in");return <BrandSurface><main id="main-content" className="container page-space"><Alert tone="danger" title="Student unavailable">This student record could not be loaded.</Alert></main></BrandSurface>;}
  return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow="Student record" title={student.displayName} description={`${student.admissionNumber} · ${student.status}`} actions={<ButtonLink href="/admin/students" variant="secondary">Back to students</ButtonLink>}/><Card className="padded"><dl><dt>Admission number</dt><dd>{student.admissionNumber}</dd><dt>Student status</dt><dd>{student.status}</dd><dt>Enrollment</dt><dd>{student.enrollment?"Enrolled":"Not enrolled"}</dd></dl><p className="muted small">Enrollment history will appear when enrollment is available for this branch.</p><Link href="/admin/students">Return to student list</Link></Card></main></BrandSurface>;
}
