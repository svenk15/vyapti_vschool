import { BranchSwitcher } from "@/components/institution-context";
import { loadAdminHome } from "@/lib/server/admin-page";
import { adminGateway } from "@/lib/server/access";
import { getIdentity } from "@/lib/server/auth";
import { StaffManagement } from "@/components/access-management";
import { Alert,BrandSurface,ButtonLink,PageHeader } from "@/components/ui/primitives";
export const dynamic="force-dynamic";
export default async function UsersPage(){const home=await loadAdminHome();if(!home)return <Alert tone="danger" title="Staff service unavailable"/>;const staff=await adminGateway.listMembers(await getIdentity(),home.scope.schoolId).catch(()=>null);if(!staff)return <Alert tone="danger" title="Service unavailable">Refresh or sign in again.</Alert>;return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow={home.institutionName} title="Staff access" description={home.schoolName} actions={<ButtonLink href="/admin" variant="secondary">School home</ButtonLink>}/><BranchSwitcher home={home}/><StaffManagement initial={staff} schoolId={home.scope.schoolId}/></main></BrandSurface>;}
