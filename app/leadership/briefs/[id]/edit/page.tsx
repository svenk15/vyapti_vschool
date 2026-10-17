import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {Alert,Card,PageHeader,PageStack} from '@/components/ui/primitives';
import {LeadershipBriefComposer} from '@/components/leadership-brief-workflow';
import {getIdentity} from '@/lib/server/auth';
import {reportingGateway} from '@/lib/server/reporting';
export const dynamic='force-dynamic';
export default async function EditLeadershipBriefPage({params}:{params:Promise<{id:string}>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const {id}=await params,[current,availability]=await Promise.all([reportingGateway.getLeadershipBrief(identity,id).catch(()=>null),reportingGateway.leadershipBriefAvailability(identity).catch(()=>null)]);if(!current)notFound();return <main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Leadership brief" title="Create a new brief revision" description="Prior revisions remain retained. This save replaces neither finalized content nor source evidence in place." actions={<Link className="btn btn-secondary" href={`/leadership/briefs/${id}`}>Back to brief</Link>}/>{current.state!=='DRAFT'||!availability?.enabled||!availability.canGenerate?<Alert tone="warning" title="Revision unavailable">Only the current draft author with live generation and source authority can append a revision.</Alert>:<Card className="padded workflow-card"><LeadershipBriefComposer availability={availability} current={current}/></Card>}</PageStack></main>;}
