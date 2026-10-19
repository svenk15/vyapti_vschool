import Link from 'next/link';
import {redirect} from 'next/navigation';
import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {Alert,BrandSurface,Card,PageHeader,PageStack} from '@/components/ui/primitives';
import {familyPageContext} from '@/lib/server/family-page';
import {getIdentity} from '@/lib/server/auth';
import {learningGateway} from '@/lib/server/learning';
export const dynamic='force-dynamic';
export default async function FamilyAssignment({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{child?:string|string[]}>}){const [{id},query]=await Promise.all([params,searchParams]),{workspace,selected}=await familyPageContext(Array.isArray(query.child)?undefined:query.child);if(!selected.purposes.includes('learning.assignment.read_child'))redirect('/family/access-unavailable');const row=await learningGateway.detailParent(await getIdentity(),selected.studentId,id),context=`child=${encodeURIComponent(selected.studentId)}`;return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader title={row.title} description={`${row.offering.subject} · Due ${new Intl.DateTimeFormat('en-GB',{timeZone:selected.timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(row.dueAt))}`}/><div className="stack"><Card className="padded"><h2>Assignment instructions</h2><p>{row.instructions}</p><div className="section-divider"/><p className="small muted">Your child completes this work in their Student workspace. This family view is read-only.</p></Card><Card className="padded"><h2>Published version</h2><p>Version {row.version} · {row.offering.classLabel}</p><Alert title="Read-only family view">You can review the published assignment here. Submission and editing stay with your child.</Alert></Card></div><Link href={`/family/learning?${context}`}>← Back to Learning</Link></PageStack></main></FamilyPortalFrame></BrandSurface>;
}
