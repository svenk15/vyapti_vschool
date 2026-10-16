import { notFound } from "next/navigation";
import { findDemoSchool } from "@/lib/demo-schools";
import { LoginPreview } from "@/components/login-preview";
import {brandingGateway,requestHost} from '@/lib/server/branding';
import {BrandSurface,Alert} from '@/components/ui/primitives';
export const dynamic='force-dynamic';
export default async function SignIn({params}:{params:Promise<{school:string}>}) {
 const {school}=await params;let published;try{published=await brandingGateway.publicBrand(school,await requestHost());}catch{return <BrandSurface><main className="container page-space"><Alert tone="danger" title="School sign-in unavailable">Please try again later.</Alert></main></BrandSurface>;}
 if(published)return <LoginPreview brand={published.brand} logoUrl={published.logoUrl} mode="live"/>;
 const brand=findDemoSchool(school);if(!brand)notFound();return <LoginPreview brand={brand}/>;
}
