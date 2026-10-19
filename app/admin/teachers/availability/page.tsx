import {redirect} from 'next/navigation';
import {StaffAvailabilityRecorder} from '@/components/staff-availability-recorder';
import {peopleAvailabilityGateway,peopleGateway} from '@/lib/server/people';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {AdminStaffNavigation} from '@/components/admin-staff-navigation';
export const dynamic='force-dynamic';
export default async function AvailabilityRecorderPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const [params,home]=await Promise.all([searchParams,accountGateway.getHome(identity)]),date=typeof params.date==='string'?params.date:new Intl.DateTimeFormat('en-CA',{timeZone:home.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),[initial,profiles]=await Promise.all([peopleAvailabilityGateway.recorder(identity,date),peopleGateway.workspace(identity,{limit:1}).then(()=>true).catch(()=>false)]);return <main id="main-content" className="container page-space"><AdminStaffNavigation current="availability" profiles={profiles} access={home.capabilities.includes('user.manage')} availability/><StaffAvailabilityRecorder initial={initial}/></main>;}
