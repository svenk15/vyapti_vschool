import { AccountActivation } from "@/components/account-activation";
import { BrandSurface,Card,PageHeader } from "@/components/ui/primitives";
export default function ActivationPage(){return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow="VSchool" title="Activate your account" description="Use your private operator token to set a password."/><Card className="padded"><AccountActivation/></Card></main></BrandSurface>;}
