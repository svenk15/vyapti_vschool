import { notFound } from "next/navigation";
import { findDemoSchool } from "@/lib/demo-schools";
import { LoginPreview } from "@/components/login-preview";
export default async function SignIn({params}:{params:Promise<{school:string}>}) {
 const {school}=await params;const brand=findDemoSchool(school);if(!brand)notFound();return <LoginPreview brand={brand}/>;
}
