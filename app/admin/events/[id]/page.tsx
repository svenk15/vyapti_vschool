import {notFound,redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {EventPublishFlow} from '@/components/event-publish-flow';
import {Alert,Badge,ButtonLink,Card,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {academicsGateway} from '@/lib/server/academics';
import {eventsGateway} from '@/lib/server/events';

export const dynamic='force-dynamic';

export default async function EventDetail({params}:{params:Promise<{id:string}>}){
 const identity=await getIdentity(),id=(await params).id;
 let data:{event:Awaited<ReturnType<typeof eventsGateway.detailAdmin>>;workspace:Awaited<ReturnType<typeof academicsGateway.workspace>>}|null=null;
 try{const [event,workspace]=await Promise.all([eventsGateway.detailAdmin(identity,id),academicsGateway.workspace(identity)]);data={event,workspace};}
 catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');if(error instanceof AccessError&&error.code==='NOT_FOUND')notFound();}
 if(!data)return <main id="main-content" className="container page-space"><Alert tone="danger" title="Event unavailable">Refresh the calendar and try again.</Alert></main>;
 const {event,workspace}=data;
 if(event.status==='CANCELED')return <main id="main-content" className="container page-space"><PageStack><PageHeader title={event.title} description={`${event.schoolName} · Canceled event`} actions={<ButtonLink variant="secondary" href="/admin/events">Back to calendar</ButtonLink>}/><Alert tone="warning" title="Event canceled">The frozen audience still sees this event as canceled. Its publication evidence has not been deleted.</Alert><Card className="padded"><Badge>CANCELED</Badge><p>{event.description}</p></Card></PageStack></main>;
 const sections=workspace.sections.filter(item=>item.active).map(item=>({id:item.id,name:item.name,gradeName:item.gradeName}));
 return <main id="main-content" className="container page-space"><EventPublishFlow sections={sections} schoolName={event.schoolName} timezone={event.timezone} initial={event}/></main>;
}
