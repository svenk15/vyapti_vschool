import Link from 'next/link';
import {redirect} from 'next/navigation';
import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {BrandSurface,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
import {familyPageContext} from '@/lib/server/family-page';
import {getIdentity} from '@/lib/server/auth';
import {learningGateway} from '@/lib/server/learning';
export const dynamic='force-dynamic';
export default async function FamilyLearning({searchParams}:{searchParams:Promise<{child?:string|string[]}>}){const query=await searchParams,{workspace,selected}=await familyPageContext(Array.isArray(query.child)?undefined:query.child);if(!selected.purposes.includes('learning.assignment.read_child'))redirect('/family/access-unavailable');const rows=await learningGateway.listParent(await getIdentity(),selected.studentId),context=`child=${encodeURIComponent(selected.studentId)}`;return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader title="Learning" description="Published assignments you are permitted to see for this child."/>{rows.length?<div className="stack">{rows.map(row=><Card className="padded" key={row.id}><div className="card-title"><div><h2>{row.title}</h2><p className="small muted">{row.offering.subject} · Due {new Intl.DateTimeFormat('en-GB',{timeZone:selected.timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(row.dueAt))}</p></div></div><Link className="btn btn-secondary btn-small" href={`/family/learning/${row.id}?${context}`}>View assignment <span aria-hidden="true">→</span></Link></Card>)}</div>:<Card><EmptyState icon="document" title="No published assignments" description="Text assignments published to this child's exact class and access will appear here."/></Card>}</PageStack></main></FamilyPortalFrame></BrandSurface>;
}
