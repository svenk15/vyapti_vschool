import {redirect} from 'next/navigation';
import {Alert,Breadcrumbs,PageHeader,PageStack} from '@/components/ui/primitives';
import {CoordinationBatchReceiptView} from '@/components/coordination-batch';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';
export default async function CoordinationBatchResult({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const identity=await getIdentity();if(!identity)redirect('/sign-in');const rawReturn=(await searchParams).return,candidate=Array.isArray(rawReturn)?rawReturn[0]:rawReturn,returnHref=candidate?.startsWith('/leadership/attendance?')?candidate:'/leadership/attendance';let receipt=null;try{receipt=await coordinationGateway.getBatch(identity,(await params).id);}catch{}
 return <main id="main-content" className="container page-space"><PageStack className="coordination-create-page"><Breadcrumbs items={[{label:'Attendance oversight',href:'/leadership/attendance'},{label:'Bulk result'}]}/><PageHeader eyebrow="Attendance coordination" title="Bulk follow-up result" description="Each selected register has its own durable, authorized outcome."/>
  {receipt?<CoordinationBatchReceiptView receipt={receipt} returnHref={returnHref}/>:<Alert tone="danger" title="Batch unavailable">This result is unavailable in the current authorized branch.</Alert>}
 </PageStack></main>;
}
