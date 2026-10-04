import { BranchSwitcher } from "@/components/institution-context";
import { loadAdminHome } from "@/lib/server/admin-page";
import { AccessSignOut } from "@/components/access-login";
import { Alert,BrandSurface,ButtonLink,Card,PageHeader } from "@/components/ui/primitives";
export const dynamic="force-dynamic";
export default async function AdminPage(){const home=await loadAdminHome();return <BrandSurface><main id="main-content" className="container page-space">{home?<><PageHeader eyebrow={home.institutionName} title={home.schoolName} description="School administration" actions={<AccessSignOut/>}/><BranchSwitcher home={home}/><Card className="padded"><h2>School details</h2><dl><dt>School code</dt><dd>{home.schoolCode}</dd><dt>Timezone</dt><dd>{home.timezone}</dd></dl><ButtonLink href="/admin/setup">School setup</ButtonLink><ButtonLink href="/admin/school" variant="secondary">School settings</ButtonLink><ButtonLink href="/admin/users" variant="secondary">Staff access</ButtonLink></Card></>:<Alert tone="danger" title="School service unavailable">Please try again later.</Alert>}</main></BrandSurface>;}
