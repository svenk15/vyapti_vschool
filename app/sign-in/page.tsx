import { AccessLogin } from "@/components/access-login";
import { BrandSurface,Card,PageHeader } from "@/components/ui/primitives";
export default function SignInPage(){return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow="VSchool" title="School administrator sign in" description="Use the account provided by your school operator."/><Card className="padded access-login"><AccessLogin/></Card></main></BrandSurface>;}
