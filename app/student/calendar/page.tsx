import Link from 'next/link';
import {StudentPortalFrame} from '@/components/student-portal-frame';
import {BrandSurface,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
import {studentPageContext} from '@/lib/server/student-page';
import {getIdentity} from '@/lib/server/auth';
import {eventsGateway} from '@/lib/server/events';

export const dynamic='force-dynamic';
const when=(row:Awaited<ReturnType<typeof eventsGateway.listStudent>>[number],timezone:string)=>row.schedule.kind==='ALL_DAY'?row.schedule.startsOn===row.schedule.endsOn?row.schedule.startsOn:`${row.schedule.startsOn} – ${row.schedule.endsOn}`:new Intl.DateTimeFormat('en-GB',{timeZone:timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(row.schedule.startsAt));

export default async function StudentCalendar({searchParams}:{searchParams:Promise<{student?:string|string[]}>}){
 const query=await searchParams,{workspace,selected}=await studentPageContext(Array.isArray(query.student)?undefined:query.student,'calendar.event.read_self'),rows=await eventsGateway.listStudent(await getIdentity(),selected.studentId),context=`student=${encodeURIComponent(selected.studentId)}`;
 return <BrandSurface><StudentPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack>
  <PageHeader title="School calendar" description={`${selected.displayName} · ${selected.schoolName}`}/>
  {rows.length?<div className="family-notice-list">{rows.map(row=><Card className="padded family-notice-row" key={row.id}><div><span className="small muted">{when(row,selected.timezone)} · {row.audience.label}</span><h2>{row.title}</h2><p className="small muted">{row.status==='CANCELED'?'Canceled':row.description}</p></div><Link className="btn btn-secondary btn-small" href={`/student/calendar/${row.id}?${context}`}>View event <span aria-hidden="true">→</span></Link></Card>)}</div>:<Card><EmptyState icon="calendar" title="No published events" description="Branch and class events addressed to your Student account will appear here."/></Card>}
  <Link href={`/student?${context}`}>← Back to my day</Link>
 </PageStack></main></StudentPortalFrame></BrandSurface>;
}
