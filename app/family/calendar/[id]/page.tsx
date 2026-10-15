import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {Alert,Badge,BrandSurface,Card,PageHeader,PageStack} from '@/components/ui/primitives';
import {familyPageContext} from '@/lib/server/family-page';
import {getIdentity} from '@/lib/server/auth';
import {eventsGateway} from '@/lib/server/events';

export const dynamic='force-dynamic';
const when=(event:Awaited<ReturnType<typeof eventsGateway.detailParent>>)=>event.schedule.kind==='ALL_DAY'?event.schedule.startsOn===event.schedule.endsOn?event.schedule.startsOn:`${event.schedule.startsOn} to ${event.schedule.endsOn}`:`${new Intl.DateTimeFormat('en-GB',{timeZone:event.timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(event.schedule.startsAt))} to ${new Intl.DateTimeFormat('en-GB',{timeZone:event.timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(event.schedule.endsAt))}`;

export default async function FamilyEvent({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{child?:string|string[]}>}){
 const query=await searchParams,{workspace,selected}=await familyPageContext(Array.isArray(query.child)?undefined:query.child);
 if(!selected.purposes.includes('calendar.event.read_child'))redirect('/family/access-unavailable');
 let event:Awaited<ReturnType<typeof eventsGateway.detailParent>>;
 try{event=await eventsGateway.detailParent(await getIdentity(),selected.studentId,(await params).id);}
 catch(error){if(error instanceof AccessError&&error.code==='NOT_FOUND')notFound();throw error;}
 const back=`/family/calendar?child=${encodeURIComponent(selected.studentId)}`;
 return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack>
  <PageHeader title={event.title} description={`${event.schoolName} · ${event.audience.label}`} actions={<Link className="btn btn-secondary btn-normal" href={back}>Back to calendar</Link>}/>
  {event.status==='CANCELED'&&<Alert tone="warning" title="This event was canceled">The school retained the event so the change remains clear.</Alert>}
  <Card className="padded receipt"><Badge tone={event.status==='CANCELED'?'warning':'success'}>{event.status}</Badge><p>{event.description}</p><dl className="record-facts"><div><dt>Category</dt><dd>{event.category==='GENERAL'?'School event':event.category==='CLASS_EVENT'?'Class event':event.category==='HOLIDAY'?'Holiday':'Meeting'}</dd></div><div><dt>When</dt><dd>{when(event)}</dd></div><div><dt>Timezone</dt><dd>{event.timezone}</dd></div><div><dt>Audience</dt><dd>{event.audience.label}</dd></div><div><dt>Version</dt><dd>{event.version}</dd></div></dl></Card>
 </PageStack></main></FamilyPortalFrame></BrandSurface>;
}
