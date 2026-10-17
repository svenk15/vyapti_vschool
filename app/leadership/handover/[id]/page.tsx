import {redirect} from 'next/navigation';
import {CoordinationHandoverReceiptView} from '@/components/coordination-handover';
import {Alert,Breadcrumbs,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';

export default async function LeadershipHandoverReceiptPage({params}:{params:Promise<{id:string}>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const {id}=await params,receipt=await coordinationGateway.getHandover(identity,id).catch(()=>null);return <main id="main-content" className="container page-space"><PageStack className="coordination-page"><Breadcrumbs items={[{label:'Operational follow-ups',href:'/leadership/coordination'},{label:'Handover',href:'/leadership/handover'},{label:'Result'}]}/><PageHeader eyebrow="Leadership continuity" title="Handover result" description="Review the durable per-item outcome before changing access separately."/>{receipt?<CoordinationHandoverReceiptView receipt={receipt}/>:<Alert tone="danger" title="Handover unavailable">This result is not visible with your current branch authority.</Alert>}</PageStack></main>;}
