import {redirect} from 'next/navigation';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {PrincipalDecisionInbox} from '@/components/principal-decision-inbox';
import {getIdentity} from '@/lib/server/auth';
import {decisionGateway} from '@/lib/server/decisions';

export const dynamic='force-dynamic';
export default async function PrincipalDecisionsPage(){const identity=await getIdentity();if(!identity)redirect('/sign-in');const queue=await decisionGateway.list(identity,{}).catch(()=>null);return <main id="main-content" className="container page-space"><PageStack className="decision-inbox-page"><PageHeader eyebrow="Purpose-scoped inbox" title="My decisions" description="Review only the items whose owning module currently authorizes you to decide."/>{queue?<PrincipalDecisionInbox queue={queue}/>:<Alert tone="danger" title="Decisions unavailable">No decision owner is currently available with your branch authority.</Alert>}</PageStack></main>;}
