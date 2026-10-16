import {redirect} from 'next/navigation';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {CoordinationQueueView} from '@/components/coordination-view';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';
export default async function AdminCoordinationPage(){const identity=await getIdentity();if(!identity)redirect('/sign-in');try{const queue=await coordinationGateway.list(identity,{assignment:'mine'});return <main id="main-content" className="container page-space"><PageStack className="coordination-page"><PageHeader eyebrow="Attendance coordination" title="Assigned follow-ups" description="Work assigned for this branch. Attendance corrections and cancellations remain in the Attendance workspace."/><CoordinationQueueView queue={queue} baseHref="/admin/coordination" manager={false}/></PageStack></main>;}catch{return <main id="main-content" className="container page-space"><PageStack><PageHeader title="Assigned follow-ups"/><Alert tone="danger" title="Follow-ups unavailable">Your current worker designation or branch authority could not be verified.</Alert></PageStack></main>;}}
