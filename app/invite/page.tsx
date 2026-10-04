import {StaffInviteAcceptanceForm} from "@/components/password-reset";
import {BrandSurface,Card,PageHeader} from "@/components/ui/primitives";
export const dynamic="force-dynamic";
export default function StaffInvitePage(){return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow="Staff invitation" title="Accept school access" description="Confirm this invitation to activate the membership at your school."/><Card className="padded access-login"><StaffInviteAcceptanceForm/></Card></main></BrandSurface>;}
