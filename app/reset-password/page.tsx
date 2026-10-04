import {ResetPasswordForm} from "@/components/password-reset";
import {BrandSurface,Card,PageHeader} from "@/components/ui/primitives";
export const dynamic="force-dynamic";
export default function ResetPasswordPage(){return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow="Account recovery" title="Choose a new password" description="A successful reset ends other sessions and keeps your existing school access."/><Card className="padded access-login"><ResetPasswordForm/></Card></main></BrandSurface>;}
