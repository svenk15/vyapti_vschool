import {redirect} from 'next/navigation';
import {Alert,Breadcrumbs,PageHeader,PageStack} from '@/components/ui/primitives';
import {CoordinationBatchCreate} from '@/components/coordination-batch';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';
export default async function BulkCoordination({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const identity=await getIdentity();if(!identity)redirect('/sign-in');const params=await searchParams,raw=params.session,sourceIds=(Array.isArray(raw)?raw:raw?[raw]:[]).slice(0,51),candidate=Array.isArray(params.return)?params.return[0]:params.return,returnHref=candidate?.startsWith('/leadership/attendance?')?candidate:'/leadership/attendance';
 let preview=null,error='';try{preview=await coordinationGateway.previewBatch(identity,{sourceIds,kind:'MISSING_REGISTER'});}catch{error='The selected sources are invalid or unavailable in the current branch.';}
 return <main id="main-content" className="container page-space"><PageStack className="coordination-create-page"><Breadcrumbs items={[{label:'Attendance oversight',href:returnHref},{label:'Bulk follow-up'}]}/><PageHeader eyebrow="Attendance coordination" title="Follow up multiple missing registers" description="Review an explicit selection and receive an honest outcome for every register."/>
  {preview?<CoordinationBatchCreate preview={preview} sourceIds={sourceIds} returnHref={returnHref}/>:<Alert tone="danger" title="Selection unavailable">{error}</Alert>}
 </PageStack></main>;
}
