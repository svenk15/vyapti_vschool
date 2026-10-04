import {ForgotPasswordForm} from "@/components/password-reset";
import {BrandSurface,Card,PageHeader} from "@/components/ui/primitives";
export const dynamic="force-dynamic";
export default function ForgotPasswordPage(){return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow="Account recovery" title="Reset your password" description="Enter the verified email address on your VSchool account."/><Card className="padded access-login"><ForgotPasswordForm/></Card></main></BrandSurface>;}
