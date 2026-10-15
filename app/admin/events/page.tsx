import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,Badge,ButtonLink,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {eventsGateway} from '@/lib/server/events';

export const dynamic='force-dynamic';
const when=(row:Awaited<ReturnType<typeof eventsGateway.listAdmin>>[number],timezone:string)=>row.schedule.kind==='ALL_DAY'?row.schedule.startsOn===row.schedule.endsOn?row.schedule.startsOn:`${row.schedule.startsOn} – ${row.schedule.endsOn}`:new Intl.DateTimeFormat('en-GB',{timeZone:timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(row.schedule.startsAt));

export default async function EventsPage(){
 const identity=await getIdentity();let rows:Awaited<ReturnType<typeof eventsGateway.listAdmin>>|null=null,timezone='UTC',error:unknown;
 try{const [events,home]=await Promise.all([eventsGateway.listAdmin(identity),accountGateway.getHome(identity)]);rows=events;timezone=home.timezone;}catch(cause){error=cause;if(cause instanceof AccessError&&cause.code==='UNAUTHENTICATED')redirect('/sign-in');}
 return <main id="main-content" className="container page-space"><PageStack>
  <PageHeader title="Calendar & events" description="Publish one-off branch or class events to explicitly authorized families and Students." actions={<ButtonLink href="/admin/events/new">Create event</ButtonLink>}/>
  {error?<Alert tone="danger" title="Calendar unavailable">Current branch, module and explicit publisher authority are checked on the server.</Alert>:rows?.length?<Card className="directory-card event-directory-table"><div className="directory-heading"><div><h2>School events</h2><p className="small muted">Draft, published and canceled events keep their version history.</p></div><Badge>{rows.length}</Badge></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Event</th><th>When</th><th>Audience</th><th>Status</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><th scope="row"><strong>{row.title}</strong><small>{row.description}</small></th><td data-label="When">{when(row,timezone)}</td><td data-label="Audience">{row.audience.label}<small>{row.recipientCount} frozen student{row.recipientCount===1?'':'s'}</small></td><td data-label="Status"><Badge tone={row.status==='PUBLISHED'?'success':row.status==='CANCELED'?'warning':'neutral'}>{row.status}</Badge><small>Revision {row.revision}</small></td><td data-label="Action"><ButtonLink variant="secondary" href={`/admin/events/${row.id}`}>{row.status==='DRAFT'?'Continue':'Review'}</ButtonLink></td></tr>)}</tbody></table></div></Card>:<Card><EmptyState icon="calendar" title="No events published" description="Create a bounded one-off event for the branch or one class."/></Card>}
 </PageStack></main>;
}
