import Link from 'next/link';
import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {FamilyConcernCreateWorkflow} from '@/components/request-workflow';
import {BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {familyPageContext} from '@/lib/server/family-page';
export const dynamic='force-dynamic';
export default async function NewFamilyConcern({searchParams}:{searchParams:Promise<{child?:string|string[]}>}){const params=await searchParams,{workspace,selected}=await familyPageContext(Array.isArray(params.child)?undefined:params.child);return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Protected family channel" title="Raise a concern" description={`Submit a concern about ${selected.displayName} to the school&apos;s configured reviewer.`} actions={<Link className="btn btn-secondary" href={`/family/concerns?child=${encodeURIComponent(selected.studentId)}`}>My concerns</Link>}/><FamilyConcernCreateWorkflow studentId={selected.studentId}/></PageStack></main></FamilyPortalFrame></BrandSurface>;}
