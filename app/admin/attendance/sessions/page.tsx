import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {AttendanceAdminTabs} from '@/components/attendance-admin-tabs';
import {AttendanceScheduler} from '@/components/attendance-scheduler';
import {AttendanceAdminList} from '@/components/attendance-admin-list';
import {Alert,BrandSurface,ButtonLink,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {attendanceGateway} from '@/lib/server/attendance';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';

export const dynamic='force-dynamic';
const first=(value:string|string[]|undefined)=>Array.isArray(value)?undefined:value;

export default async function ScheduleSessionsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const identity=await getIdentity(),params=await searchParams;let home,offerings,sessions,today='',date='',sectionId='',sectionOptions:readonly {id:string;label:string}[]=[];let unavailable=false;
 try{
  home=await accountGateway.getHome(identity);await attendanceGateway.authorizeAdmin(identity);
  today=schoolDate(new Date(),home.timezone);const requestedDate=first(params.date);date=requestedDate&&/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)?requestedDate:today;const workspace=await academicsGateway.workspace(identity),year=workspace.years.find(item=>item.status==='OPEN');
  [offerings,sessions]=await Promise.all([year?academicsGateway.offerings(identity,year.id):Promise.resolve([]),attendanceGateway.schoolDay(identity,date)]);
  const requestedSection=first(params.section)??'',allowedSections=new Set(offerings.map(item=>item.section.id));sectionId=allowedSections.has(requestedSection)?requestedSection:'';const offeringIds=new Set(offerings.filter(item=>item.section.id===sectionId).map(item=>item.id));sessions=sectionId?sessions.filter(item=>offeringIds.has(item.offering.id)):sessions;
  sectionOptions=Array.from(new Map(offerings.map(item=>[item.section.id,{id:item.section.id,label:`${item.section.gradeName} · ${item.section.name}`}])).values());
 }catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');unavailable=true;}
 if(!home||unavailable)return <BrandSurface><main id="main-content" className="container page-space"><PageStack><PageHeader title="Schedule attendance sessions" description="Plan and monitor class attendance for the active branch."/><Alert tone="danger" title="Attendance unavailable">Current branch permissions and module access are checked when loading and scheduling. Refresh after access or service issues are resolved.</Alert></PageStack></main></BrandSurface>;
 const monitor=first(params.view)==='monitor';
  return <BrandSurface><main id="main-content" className="container page-space"><PageStack className="attendance-admin-page">{monitor?<><PageHeader title="Attendance" description={`${home.institutionName} · ${home.schoolName} · Monitor scheduled and submitted registers.`} actions={<ButtonLink href="/admin/attendance/sessions" variant="primary">Schedule session</ButtonLink>}/><AttendanceAdminTabs active="sessions"/><AttendanceAdminList sessions={sessions??[]} date={date} sectionId={sectionId} sections={sectionOptions} timezone={home.timezone}/></>:<AttendanceScheduler offerings={offerings??[]} today={today} timezone={home.timezone} home={home}/>}</PageStack></main></BrandSurface>;
}
