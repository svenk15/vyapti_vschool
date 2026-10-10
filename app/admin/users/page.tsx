import {loadAdminHome} from "@/lib/server/admin-page";
import {adminGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {StaffManagement} from "@/components/access-management";
import {Alert,BrandSurface} from "@/components/ui/primitives";
import {peopleGateway} from "@/lib/server/people";
export const dynamic="force-dynamic";
export default async function UsersPage(){const home=await loadAdminHome();if(!home)return <Alert tone="danger" title="Staff service unavailable"/>;const identity=await getIdentity(),[staff,people]=await Promise.all([adminGateway.listMembers(identity,home.scope.schoolId).catch(()=>null),peopleGateway.workspace(identity,{limit:100}).catch(()=>null)]);if(!staff)return <Alert tone="danger" title="Service unavailable">Refresh or sign in again.</Alert>;return <BrandSurface><main id="main-content" className="container page-space"><StaffManagement initial={staff} employees={people?.employees??[]} employeeDirectoryAvailable={!!people} schoolId={home.scope.schoolId} institutionName={home.institutionName} schoolName={home.schoolName}/></main></BrandSurface>;}
