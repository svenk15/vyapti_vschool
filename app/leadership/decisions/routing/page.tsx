import {redirect} from 'next/navigation';
import Link from 'next/link';
import {PageHeader,PageStack} from '@/components/ui/primitives';
import {PrincipalDecisionRouting} from '@/components/principal-decision-routing';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';
export default async function DecisionRoutingPage(){const identity=await getIdentity();if(!identity)redirect('/sign-in');const queue=await coordinationGateway.decisionRouteQueue(identity);return <main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Institution steward" title="Route unassigned decisions" description="Assign an independent reviewer without opening protected decision content." actions={<Link className="btn btn-secondary" href="/leadership/decisions">Back to decisions</Link>}/><PrincipalDecisionRouting items={queue.items}/></PageStack></main>;}
