import {redirect} from 'next/navigation';
import Link from 'next/link';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {PrincipalDecisionInbox} from '@/components/principal-decision-inbox';
import {PrincipalDecisionControls} from '@/components/principal-decision-controls';
import {getIdentity} from '@/lib/server/auth';
import {decisionGateway} from '@/lib/server/decisions';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';
const first=(value:string|string[]|undefined)=>Array.isArray(value)?value[0]:value;
const href=(queue:NonNullable<Awaited<ReturnType<typeof decisionGateway.list>>>,cursor:string)=>{const params=new URLSearchParams();if(queue.query.reference)params.set('reference',queue.query.reference);if(queue.query.type)params.set('type',queue.query.type);if(queue.query.state)params.set('state',queue.query.state);if(queue.query.due)params.set('due',queue.query.due);if(queue.query.sort!=='due')params.set('sort',queue.query.sort);if(queue.query.order!=='asc')params.set('order',queue.query.order);params.set('cursor',cursor);return `/leadership/decisions?${params}`;};
export default async function PrincipalDecisionsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const params=await searchParams,[queue,routes]=await Promise.all([decisionGateway.list(identity,{reference:first(params.reference),type:first(params.type),state:first(params.state),due:first(params.due),sort:first(params.sort),order:first(params.order),cursor:first(params.cursor)}).catch(()=>null),coordinationGateway.decisionRouteQueue(identity).catch(()=>null)]);return <main id="main-content" className="container page-space"><PageStack className="decision-inbox-page"><PageHeader eyebrow="Purpose-scoped inbox" title="My decisions" description="Review only the items whose owning module currently authorizes you to decide." actions={routes?.items.length?<Link className="btn btn-secondary" href="/leadership/decisions/routing">Route unassigned decisions</Link>:undefined}/>{queue?<><PrincipalDecisionControls queue={queue}/><PrincipalDecisionInbox queue={queue}/>{queue.nextCursor?<div className="leadership-pagination"><Link className="btn btn-secondary" href={href(queue,queue.nextCursor)}>Next decisions</Link></div>:null}</>:<Alert tone="danger" title="Decisions unavailable">No decision owner is currently available with your branch authority.</Alert>}</PageStack></main>;}
