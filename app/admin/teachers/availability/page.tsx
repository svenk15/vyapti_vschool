import {redirect} from 'next/navigation';
import {StaffAvailabilityRecorder} from '@/components/staff-availability-recorder';
import {peopleAvailabilityGateway} from '@/lib/server/people';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
export const dynamic='force-dynamic';
export default async function AvailabilityRecorderPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const [params,home]=await Promise.all([searchParams,accountGateway.getHome(identity)]),date=typeof params.date==='string'?params.date:new Intl.DateTimeFormat('en-CA',{timeZone:home.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),initial=await peopleAvailabilityGateway.recorder(identity,date);return <main id="main-content" className="container page-space"><StaffAvailabilityRecorder initial={initial}/></main>;}
