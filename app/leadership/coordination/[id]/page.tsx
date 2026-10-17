import {redirect} from 'next/navigation';
import {Alert,Breadcrumbs,PageStack} from '@/components/ui/primitives';
import {CoordinationRequestView} from '@/components/coordination-view';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';
export default async function LeadershipCoordinationDetail({params}:{params:Promise<{id:string}>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const {id}=await params,data=await coordinationGateway.get(identity,id).then(async request=>({request,assignees:request.can.assign?await coordinationGateway.eligibleAssignees(identity,id):[]})).catch(()=>null);return <main id="main-content" className="container page-space">{data?<PageStack className="coordination-detail-page"><Breadcrumbs items={[{label:'Operational follow-ups',href:'/leadership/coordination'},{label:'Request'}]}/><CoordinationRequestView request={data.request} assignees={data.assignees} backHref="/leadership/coordination" sourceHref={data.request.source.type==='LEARNING_RECIPIENT'?`/leadership/learning/evidence?assignment=${encodeURIComponent(data.request.source.assignmentId)}`:`/leadership/attendance/sessions/${data.request.source.id}`}/></PageStack>:<PageStack><Breadcrumbs items={[{label:'Operational follow-ups',href:'/leadership/coordination'},{label:'Request'}]}/><Alert tone="danger" title="Follow-up unavailable">This request is not visible with your current designation and branch authority.</Alert></PageStack>}</main>;}
