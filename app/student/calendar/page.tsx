import Link from 'next/link';
import {StudentPortalFrame} from '@/components/student-portal-frame';
import {Badge,BrandSurface,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
import {studentPageContext} from '@/lib/server/student-page';
import {getIdentity} from '@/lib/server/auth';
import {eventsGateway} from '@/lib/server/events';

export const dynamic='force-dynamic';
const when=(row:Awaited<ReturnType<typeof eventsGateway.listStudent>>[number],timezone:string)=>row.schedule.kind==='ALL_DAY'?row.schedule.startsOn===row.schedule.endsOn?row.schedule.startsOn:`${row.schedule.startsOn} – ${row.schedule.endsOn}`:new Intl.DateTimeFormat('en-GB',{timeZone:timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(row.schedule.startsAt));
const categoryLabel={GENERAL:'School event',HOLIDAY:'Holiday',MEETING:'Meeting',CLASS_EVENT:'Class event'} as const;
const localDay=(timezone:string)=>{const parts=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()),part=(type:string)=>parts.find(value=>value.type===type)?.value??'';return `${part('year')}-${part('month')}-${part('day')}`;};

export default async function StudentCalendar({searchParams}:{searchParams:Promise<{student?:string|string[]}>}){
 const query=await searchParams,{workspace,selected}=await studentPageContext(Array.isArray(query.student)?undefined:query.student,'calendar.event.read_self'),rows=await eventsGateway.listStudent(await getIdentity(),selected.studentId,{from:localDay(selected.timezone),category:'ALL'}),context=`student=${encodeURIComponent(selected.studentId)}`;
 return <BrandSurface><StudentPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack>
  <PageHeader title="School calendar" description={`${selected.displayName} · ${selected.schoolName}`}/>
  {rows.length?<div className="family-notice-list">{rows.map(row=><Card className="padded family-notice-row" key={row.id}><div><div className="family-calendar-meta"><Badge tone={row.status==='CANCELED'?'warning':'neutral'}>{categoryLabel[row.category]}</Badge><span className="small muted">{when(row,selected.timezone)} · {row.audience.label}</span></div><h2>{row.title}</h2><p className="small muted">{row.status==='CANCELED'?'Canceled · open the event for the retained current details.':row.description}</p></div><Link className="btn btn-secondary btn-small" href={`/student/calendar/${row.id}?${context}`}>View event <span aria-hidden="true">→</span></Link></Card>)}</div>:<Card><EmptyState icon="calendar" title="No upcoming permitted events" description="Published branch and class events addressed to your Student account will appear here."/></Card>}
  <Link href={`/student?${context}`}>← Back to my day</Link>
 </PageStack></main></StudentPortalFrame></BrandSurface>;
}
