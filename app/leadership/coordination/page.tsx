import {redirect} from 'next/navigation';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {CoordinationQueueView} from '@/components/coordination-view';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';
export default async function LeadershipCoordinationPage(){const identity=await getIdentity();if(!identity)redirect('/sign-in');try{const queue=await coordinationGateway.list(identity,{});return <main id="main-content" className="container page-space"><PageStack className="coordination-page"><PageHeader eyebrow="Attendance coordination" title="Operational follow-ups" description="Assign exact Attendance exceptions, track accountable work and close only against verified owner evidence."/><CoordinationQueueView queue={queue} baseHref="/leadership/coordination" manager/></PageStack></main>;}catch{return <main id="main-content" className="container page-space"><PageStack><PageHeader title="Operational follow-ups"/><Alert tone="danger" title="Follow-ups unavailable">Your current designation, branch access or Attendance availability could not be verified.</Alert></PageStack></main>;}}
