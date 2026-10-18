import { redirect } from 'next/navigation';
import { getIdentity } from '@/lib/server/auth';
import { appearanceGateway,contextGateway } from '@/lib/server/access';
import { AccessError } from '@/backend/modules/access/contracts';
import { BrandSurface,Card,PageHeader,Alert,ButtonLink } from '@/components/ui/primitives';
import { InstitutionBranchManager } from '@/components/institution-context';
export const dynamic='force-dynamic';
export default async function InstitutionsPage(){const identity=await getIdentity();let directory,appearances;try{directory=await contextGateway.getContexts(identity);const managed=directory.institutions.filter(i=>i.canManage);appearances=await Promise.all(managed.map(institution=>appearanceGateway.getInstitution(identity,institution.id)));}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');return <Alert tone="danger" title="Institution service unavailable">Refresh to try again.</Alert>;}
 const managed=directory.institutions.filter(i=>i.canManage);if(!managed.length)redirect('/account');return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow="Authorized administration" title="Institutions" description="Manage portal appearance and branch details where you have institution authority." actions={<ButtonLink href="/account" variant="secondary">My account</ButtonLink>}/><InstitutionBranchManager institutions={managed} appearances={appearances}/>{managed.map(i=><Card className="padded" key={i.id}><h2>{i.name}</h2><ul>{i.branches.map(b=><li key={b.id}>{b.code} · {b.name}</li>)}</ul><p>Branch metadata access does not grant an operational membership.</p></Card>)}</main></BrandSurface>;
}
