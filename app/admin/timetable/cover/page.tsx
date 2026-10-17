import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {TimetableCoverInboxView,TimetableCoverProposal} from '@/components/timetable-cover-workspace';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {academicsGateway} from '@/lib/server/academics';

export const dynamic='force-dynamic';

export default async function Page({searchParams}:{searchParams:Promise<{occurrenceId?:string}>}){
 const identity=await getIdentity();
 if(!identity)redirect('/sign-in');
 const occurrenceId=(await searchParams).occurrenceId;
 let context:Awaited<ReturnType<typeof academicsGateway.timetableCoverContext>>|undefined;
 let inbox:Awaited<ReturnType<typeof academicsGateway.timetableCoverInbox>>|undefined;
 let error:unknown;
 try{
  if(occurrenceId)context=await academicsGateway.timetableCoverContext(identity,occurrenceId);
  else inbox=await academicsGateway.timetableCoverInbox(identity);
 }catch(cause){error=cause;}
 if(error)return <main id="main-content" className="container page-space"><PageHeader title="Cover coordination"/><Alert tone="warning" title="Cover workspace unavailable">{error instanceof AccessError&&error.code==='NOT_FOUND'?'Select a future reconciled timetable occurrence.':'Current permissions or module configuration do not allow this workspace.'}</Alert></main>;
 return <main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Timetable operations" title={occurrenceId?'Arrange occurrence cover':'Cover coordination'} description="Coordinate one exact published occurrence without changing the immutable timetable."/>{context?<TimetableCoverProposal context={context}/>:<TimetableCoverInboxView data={inbox!} baseHref="/admin/timetable/cover" canPropose/>}</PageStack></main>;
}
