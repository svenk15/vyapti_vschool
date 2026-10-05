import { BrandSurface, Alert } from "@/components/ui/primitives";
import { StudentsWorkspace } from "@/components/students-workspace";
import { getIdentity } from "@/lib/server/auth";
import { studentsGateway } from "@/lib/server/students";
import { accountGateway } from "@/lib/server/access";
import { AccessError } from "@/backend/modules/access/contracts";
export const dynamic="force-dynamic";
export default async function StudentsPage(){
  const identity=await getIdentity();let home,initial;
  try{home=await accountGateway.getHome(identity);initial=await studentsGateway.list(identity);}
  catch(error){const message=error instanceof AccessError&&error.code==="UNAUTHENTICATED"?"Sign in to view students.":error instanceof AccessError&&error.code==="FORBIDDEN"?"Current school permissions do not allow student access.":"Student service is not available for this branch.";return <BrandSurface><main id="main-content" className="container page-space"><Alert tone="danger" title="Students unavailable">{message}</Alert></main></BrandSurface>;}
  return <BrandSurface><main id="main-content" className="container page-space"><StudentsWorkspace initial={initial} home={home}/></main></BrandSurface>;
}
