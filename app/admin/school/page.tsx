import {loadAdminHome} from "@/lib/server/admin-page";
import {adminGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {SchoolManagement} from "@/components/access-management";
import {Alert,BrandSurface,PageHeader} from "@/components/ui/primitives";
export const dynamic="force-dynamic";
export default async function SchoolPage(){const home=await loadAdminHome();if(!home)return <Alert tone="danger" title="School service unavailable"/>;const settings=await adminGateway.getSettings(await getIdentity(),home.scope.schoolId).catch(()=>null);if(!settings)return <Alert tone="danger" title="Service unavailable">Refresh or sign in again.</Alert>;return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow={home.institutionName} title="School settings" description={home.schoolName}/><SchoolManagement initial={settings}/></main></BrandSurface>;}
