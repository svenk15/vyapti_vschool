import {notFound,redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {NoticeWithdrawFlow} from '@/components/notice-withdraw-flow';
import {PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {communicationGateway} from '@/lib/server/communication';
export const dynamic='force-dynamic';
export default async function WithdrawNoticePage({params}:{params:Promise<{id:string}>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');let rows;try{rows=await communicationGateway.listAdmin(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');throw error;}const {id}=await params,notice=rows.find(row=>row.noticeId===id&&row.status==='PUBLISHED');if(!notice)notFound();return <main id="main-content" className="container page-space form-page"><PageStack><PageHeader eyebrow="Communication" title="Withdraw notice" description="Review the effect before removing protected content from recipient access."/><NoticeWithdrawFlow notice={notice}/></PageStack></main>}
