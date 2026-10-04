import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {BranchSwitcher} from '@/components/institution-context';
import {PeopleWorkspaceScreen} from '@/components/people-workspace';
import {Alert,BrandSurface,ButtonLink,PageHeader} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {peopleGateway} from '@/lib/server/people';
export const dynamic='force-dynamic';
export default async function PeoplePage(){const identity=await getIdentity();let home,workspace;try{home=await accountGateway.getHome(identity);workspace=await peopleGateway.workspace(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');const title=error instanceof AccessError&&error.code==='FORBIDDEN'?'Staff profile access denied':'Staff profiles are temporarily unavailable';return <BrandSurface><main className="container page-space"><PageHeader title="Staff profiles" actions={<ButtonLink href="/admin" variant="secondary">School home</ButtonLink>}/><Alert tone="danger" title={title}>This workspace checks current branch membership and class.manage permission on the server.</Alert></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space"><BranchSwitcher home={home}/><PeopleWorkspaceScreen initial={workspace} institutionName={home.institutionName} schoolName={home.schoolName}/></main></BrandSurface>;}
