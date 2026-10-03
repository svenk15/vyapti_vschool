import { loadAdminHome } from "@/lib/server/admin-page";
import { Alert,BrandSurface,ButtonLink,Card,PageHeader } from "@/components/ui/primitives";
export const dynamic="force-dynamic";
export default async function SetupPage(){const home=await loadAdminHome();return <BrandSurface><main id="main-content" className="container page-space">{home?<><PageHeader title="School setup" description={home.schoolName}/><Card className="padded"><p>Your school administrator access is ready. Settings and staff management are scheduled for the next task.</p><ButtonLink href="/admin" variant="secondary">Back to school home</ButtonLink></Card></>:<Alert tone="danger" title="School service unavailable">Please try again later.</Alert>}</main></BrandSurface>;}
