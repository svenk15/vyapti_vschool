import {redirect} from 'next/navigation';
import {Alert,Breadcrumbs,PageHeader,PageStack} from '@/components/ui/primitives';
import {PrincipalDecisionReview} from '@/components/principal-decision-review';
import {getIdentity} from '@/lib/server/auth';
import {decisionGateway} from '@/lib/server/decisions';

export const dynamic='force-dynamic';
export default async function PrincipalDecisionDetail({params}:{params:Promise<{owner:string;id:string}>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const {owner,id}=await params,decision=await decisionGateway.get(identity,owner,id).catch(()=>null);return <main id="main-content" className="container page-space"><PageStack className="decision-detail-page"><Breadcrumbs items={[{label:'My decisions',href:'/leadership/decisions'},{label:'Review'}]}/>{decision?<><PageHeader eyebrow={decision.typeLabel} title="Review assigned decision" description={`${decision.title} · ${decision.reference}`} actions={<BadgeLabel/>}/><PrincipalDecisionReview decision={decision}/></>:<><PageHeader title="Decision unavailable"/><Alert tone="danger" title="Protected item unavailable">The owner, item, source evidence or current decision authority could not be verified.</Alert></>}</PageStack></main>;}
function BadgeLabel(){return <span className="badge badge-warning">Ready for review</span>;}
