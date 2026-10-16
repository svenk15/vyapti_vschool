import {redirect} from 'next/navigation';
import {Alert,Breadcrumbs,PageStack} from '@/components/ui/primitives';
import {CoordinationRequestView} from '@/components/coordination-view';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';

export const dynamic='force-dynamic';
export default async function AdminCoordinationDetail({params}:{params:Promise<{id:string}>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const {id}=await params,data=await coordinationGateway.get(identity,id).then(async request=>({request,assignees:request.can.assign?await coordinationGateway.eligibleAssignees(identity,id):[]})).catch(()=>null);return <main id="main-content" className="container page-space">{data?<PageStack className="coordination-detail-page"><Breadcrumbs items={[{label:'Assigned follow-ups',href:'/admin/coordination'},{label:'Request'}]}/><CoordinationRequestView request={data.request} assignees={data.assignees} backHref="/admin/coordination" sourceHref={`/admin/attendance/sessions/${data.request.source.id}`}/></PageStack>:<PageStack><Breadcrumbs items={[{label:'Assigned follow-ups',href:'/admin/coordination'},{label:'Request'}]}/><Alert tone="danger" title="Follow-up unavailable">This request is not assigned to you or your current authority no longer permits it.</Alert></PageStack>}</main>;}
