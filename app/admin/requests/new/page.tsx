import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PageHeader,PageStack} from '@/components/ui/primitives';
import {RequestCreateWorkflow} from '@/components/request-workflow';
import {getIdentity} from '@/lib/server/auth';
import {requestsGateway} from '@/lib/server/requests';
export const dynamic='force-dynamic';
export default async function NewRequestPage(){const identity=await getIdentity();if(!identity)redirect('/sign-in');const queue=await requestsGateway.list(identity).catch(()=>null);return <main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Staff operations" title="New request" description="Submit an availability or classroom resource need for an authorized review." actions={<Link className="btn btn-secondary" href="/admin/requests">My requests</Link>}/>{queue?<RequestCreateWorkflow categories={queue.categories}/>:null}</PageStack></main>}
