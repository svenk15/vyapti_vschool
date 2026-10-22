import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {PeopleWorkspaceScreen} from '@/components/people-workspace';
import {Alert,BrandSurface,PageHeader} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {peopleAvailabilityGateway,peopleGateway} from '@/lib/server/people';
import {AdminStaffNavigation} from '@/components/admin-staff-navigation';
export const dynamic='force-dynamic';
type StaffPageProps={searchParams:Promise<Record<string,string|string[]|undefined>>};
const first=(value:string|string[]|undefined)=>Array.isArray(value)?value[0]:value;
const pageSize=(value:string|undefined):25|50|100=>{const parsed=Number(value);return parsed===50||parsed===100?parsed:25;};
const pageNumber=(value:string|undefined)=>{const parsed=Number(value);return Number.isSafeInteger(parsed)&&parsed>0?parsed:1;};
export default async function PeoplePage({searchParams}:StaffPageProps){const identity=await getIdentity(),params=await searchParams,limit=pageSize(first(params.limit)),page=pageNumber(first(params.page));let home,workspace;try{home=await accountGateway.getHome(identity);workspace=await peopleGateway.workspace(identity,{search:first(params.q),by:first(params.by),category:first(params.category),employment:first(params.employment),sort:first(params.sort),order:first(params.order),cursor:first(params.cursor),limit});}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');const title=error instanceof AccessError&&error.code==='FORBIDDEN'?'Staff profile access denied':'Staff profiles are temporarily unavailable';return <BrandSurface><main className="container page-space"><PageHeader title="Staff profiles"/><Alert tone="danger" title={title}>This workspace checks current branch membership and class.manage permission on the server.</Alert></main></BrandSurface>;}
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:home.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),availability=await peopleAvailabilityGateway.recorder(identity,today).then(()=>true).catch(()=>false);
 const workspaceKey=[first(params.q),first(params.by),first(params.category),first(params.employment),first(params.sort),first(params.order),first(params.cursor),limit].join('|');
 return <BrandSurface><main id="main-content" className="container page-space"><PeopleWorkspaceScreen key={workspaceKey} initial={workspace} pageSize={limit} pageNumber={page} navigation={<AdminStaffNavigation current="profiles" profiles access={home.capabilities.includes('user.manage')} availability={availability}/>}/></main></BrandSurface>;}
