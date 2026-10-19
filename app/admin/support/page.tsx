import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {SupportProcedurePublisher} from '@/components/support-workspace';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {supportGateway} from '@/lib/server/support';

export const dynamic='force-dynamic';

export default async function Page(){
 const identity=await getIdentity();
 let specialists:Awaited<ReturnType<typeof supportGateway.specialists>>|null=null;
 let current:Awaited<ReturnType<typeof supportGateway.currentProcedure>>|null=null;
 let failure:unknown;
 try{[specialists,current]=await Promise.all([supportGateway.specialists(identity),supportGateway.currentProcedure(identity)]);}catch(error){failure=error;}
 if(failure instanceof AccessError&&failure.code==='UNAUTHENTICATED')redirect('/sign-in');
 const unavailable=failure instanceof AccessError&&['RELEASE_UNAVAILABLE','MODULE_NOT_LICENSED','MODULE_DISABLED'].includes(failure.code);
 return <main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="School configuration" title="Restricted support procedure" description="Publish a reviewed school-authored contact instruction and exact responsible person."/>{specialists!==null&&!failure?<SupportProcedurePublisher specialists={specialists} current={current}/>:<Alert tone={unavailable?'info':'danger'} title={unavailable?'Restricted support is not enabled':'Support configuration unavailable'}>{unavailable?'This optional capability is unavailable in the current released branch configuration.':'Current branch authority and the restricted Support purpose are checked on the server.'}</Alert>}</PageStack></main>;
}
