import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Alert,Card,PageHeader,PageStack,StatCard} from '@/components/ui/primitives';
import {LeadershipAttendanceControls} from '@/components/leadership-attendance-controls';
import {LeadershipAttendanceRegisters} from '@/components/leadership-attendance-registers';
import {getIdentity} from '@/lib/server/auth';
import {leadershipAttendanceGateway} from '@/lib/server/attendance';

export const dynamic='force-dynamic';
const first=(value:string|string[]|undefined)=>Array.isArray(value)?value[0]:value;
const time=(value:string,timezone:string)=>new Intl.DateTimeFormat('en-IN',{timeZone:timezone,hour:'2-digit',minute:'2-digit'}).format(new Date(value));
const href=(coverage:NonNullable<Awaited<ReturnType<typeof leadershipAttendanceGateway.get>>>,cursor?:string)=>{const params=new URLSearchParams({date:coverage.schoolDate});if(coverage.query.classId)params.set('class',coverage.query.classId);if(coverage.query.status)params.set('status',coverage.query.status);if(coverage.query.teacherId)params.set('teacher',coverage.query.teacherId);if(coverage.query.sort!=='due')params.set('sort',coverage.query.sort);if(coverage.query.order!=='asc')params.set('order',coverage.query.order);if(cursor)params.set('cursor',cursor);return `/leadership/attendance?${params}`;};

export default async function LeadershipAttendance({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const identity=await getIdentity();if(!identity)redirect('/sign-in');const params=await searchParams,date=first(params.date),cursor=first(params.cursor);let coverage,error=false;
 try{coverage=await leadershipAttendanceGateway.get(identity,{date,classId:first(params.class),status:first(params.status),teacherId:first(params.teacher),sort:first(params.sort),order:first(params.order),cursor});}catch{error=true;}
 return <main id="main-content" className="container page-space"><PageStack className="leadership-attendance-page"><PageHeader eyebrow="Attendance oversight" title="Register submission coverage" description="Exact scheduled sessions for the selected branch. An awaiting register is not an absent pupil."/>
  {error||!coverage?<Alert tone="danger" title="Attendance coverage unavailable">No count is shown because the current source could not be read. Check the date, branch access and Attendance availability, then try again.</Alert>:<>
   <Card className="padded leadership-coverage-toolbar"><form method="get"><label htmlFor="leadership-date">School date</label><div><input id="leadership-date" name="date" type="date" defaultValue={coverage.schoolDate}/><button className="btn btn-secondary" type="submit">Refresh</button></div></form><p><strong>As of {time(coverage.asOf,coverage.timezone)}</strong><span>{coverage.timezone} · Due at scheduled session end · {coverage.definitionVersion}</span></p></Card>
   <section className="leadership-coverage-metrics" aria-label="Register coverage summary"><StatCard label="Received" value={String(coverage.counts.received)} detail="Authoritative final submissions."/><StatCard label="Due" value={String(coverage.counts.due)} detail="Ended by the as-of time."/><StatCard label="Awaiting" value={String(coverage.counts.awaiting)} detail="Due registers still outstanding."/></section>
   <p className="leadership-coverage-scope">Of {coverage.counts.scheduled} non-cancelled sessions, {coverage.counts.notDue} {coverage.counts.notDue===1?'is':'are'} not due yet. This measures submitted registers, never pupil absence.</p>
   {coverage.counts.received+coverage.counts.awaiting!==coverage.counts.due?<Alert tone="danger" title="Coverage inconsistent">The source snapshot did not reconcile. Refresh before relying on this view.</Alert>:null}
   <LeadershipAttendanceControls date={coverage.schoolDate} query={coverage.query} filters={coverage.filters}/>
   <LeadershipAttendanceRegisters key={href(coverage).split('?')[1]} items={coverage.awaiting.items} total={coverage.awaiting.total} awaitingTotal={coverage.counts.awaiting} timezone={coverage.timezone} sourceQuery={href(coverage).split('?')[1]}/>
   {coverage.awaiting.nextCursor?<div className="leadership-pagination"><Link className="btn btn-secondary" href={href(coverage,coverage.awaiting.nextCursor)}>Next awaiting registers</Link></div>:null}
   <p className="footer-note">Cancelled sessions: {coverage.counts.cancelled}. They are retained for history and excluded from scheduled, due and received totals.</p>
  </>}
 </PageStack></main>;
}
