import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {PeopleWorkspaceScreen} from '@/components/people-workspace';
import {Alert,BrandSurface,PageHeader} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {peopleAvailabilityGateway,peopleGateway} from '@/lib/server/people';
import {AdminStaffNavigation} from '@/components/admin-staff-navigation';
export const dynamic='force-dynamic';
export default async function PeoplePage(){const identity=await getIdentity();let home,workspace;try{home=await accountGateway.getHome(identity);workspace=await peopleGateway.workspace(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');const title=error instanceof AccessError&&error.code==='FORBIDDEN'?'Staff profile access denied':'Staff profiles are temporarily unavailable';return <BrandSurface><main className="container page-space"><PageHeader title="Staff profiles"/><Alert tone="danger" title={title}>This workspace checks current branch membership and class.manage permission on the server.</Alert></main></BrandSurface>;}
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:home.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),availability=await peopleAvailabilityGateway.recorder(identity,today).then(()=>true).catch(()=>false);
 return <BrandSurface><main id="main-content" className="container page-space"><PeopleWorkspaceScreen initial={workspace} home={home} navigation={<AdminStaffNavigation current="profiles" profiles access={home.capabilities.includes('user.manage')} availability={availability}/>}/></main></BrandSurface>;}
