import {redirect} from 'next/navigation';
import {attendanceExplanationsGateway as explanations} from '@/lib/server/attendance-explanations';
import {attendanceCorrectionRequestsGateway as corrections} from '@/lib/server/attendance-correction-requests';
import {getIdentity} from '@/lib/server/auth';
import {AttendanceAdminTabs} from '@/components/attendance-admin-tabs';
import {AttendanceRequestsWorkspace,type AttendanceRequestRow} from '@/components/attendance/requests-workspace';
import {Alert,BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
export const dynamic='force-dynamic';
const one=(v:string|string[]|undefined)=>typeof v==='string'?v:'';
export default async function AttendanceRequests({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const actor=await getIdentity();if(!actor)redirect('/sign-in');const params=await searchParams,view=one(params.view)==='all'?'all':'pending',type=['explanation','correction'].includes(one(params.type))?one(params.type):'all',size=[25,50,100].includes(Number(one(params.size)))?Number(one(params.size)):25;
 const probes=await Promise.allSettled([explanations.reviewerPage(actor,{view,offset:0,limit:1}),corrections.reviewPage(actor,{view,offset:0,limit:1})]);
 const failures:string[]=[];probes.forEach((result,i)=>{if(result.status==='rejected'){const code=result.reason?.code;if(code==='UNAUTHENTICATED')redirect('/sign-in');if(!['FORBIDDEN','NOT_FOUND'].includes(code))failures.push(i===0?'Absence explanations':'Correction requests');}});
 const eTotal=type!=='correction'&&probes[0].status==='fulfilled'?probes[0].value.total:0,cTotal=type!=='explanation'&&probes[1].status==='fulfilled'?probes[1].value.total:0,total=eTotal+cTotal,page=Math.min(Math.max(0,Math.trunc(Number(one(params.page)))||0),Math.max(0,Math.ceil(total/size)-1)),offset=page*size,eTake=Math.min(size,Math.max(0,eTotal-offset)),cTake=Math.min(size-eTake,Math.max(0,cTotal-Math.max(0,offset-eTotal))),items:AttendanceRequestRow[]=[];
 const pages=await Promise.allSettled([eTake?explanations.reviewerPage(actor,{view,offset,limit:eTake}):Promise.resolve(null),cTake?corrections.reviewPage(actor,{view,offset:Math.max(0,offset-eTotal),limit:cTake}):Promise.resolve(null)]);
 pages.forEach((result,i)=>{if(result.status==='rejected'){if(result.reason?.code==='UNAUTHENTICATED')redirect('/sign-in');failures.push(i===0?'Absence explanations':'Correction requests');}});
 if(pages[0].status==='fulfilled')for(const row of pages[0].value?.items??[])items.push({id:row.id,studentName:row.studentName,sectionName:row.sectionName,schoolDate:row.schoolDate,kind:'explanation',status:row.status==='SUBMITTED'?row.clarification?.status==='OPEN'?'Awaiting clarification':'Awaiting review':row.status==='ACCEPTED'?'Accepted':row.status==='DECLINED'?'Declined':'Withdrawn'});
 if(pages[1].status==='fulfilled')for(const row of pages[1].value?.items??[])items.push({id:row.id,studentName:row.studentName,sectionName:row.sectionName,schoolDate:row.schoolDate,kind:'correction',status:['APPLIED','DECLINED','WITHDRAWN'].includes(row.status)?row.status==='APPLIED'?'Applied':row.status==='DECLINED'?'Declined':'Withdrawn':row.currentRevision===row.sourceRevision?'Awaiting review':'Changed'});
 const otherView=view==='pending'?'all':'pending';
 const other=await Promise.allSettled([probes[0].status==='fulfilled'?explanations.reviewerPage(actor,{view:otherView,offset:0,limit:1}):Promise.resolve(null),probes[1].status==='fulfilled'?corrections.reviewPage(actor,{view:otherView,offset:0,limit:1}):Promise.resolve(null)]);
 const selectedCount=failures.length?null:probes.reduce((sum,r)=>sum+(r.status==='fulfilled'?r.value.total:0),0),otherCount=other.some(r=>r.status==='rejected')?null:other.reduce((sum,r)=>sum+(r.status==='fulfilled'?r.value?.total??0:0),0);
 const pendingCount=view==='pending'?selectedCount:otherCount,allCount=view==='all'?selectedCount:otherCount;
 const allowed=probes.some(r=>r.status==='fulfilled');
 return <BrandSurface><main id="main-content" className="container page-space"><PageStack className="attendance-queue-page"><PageHeader title="Attendance"/><AttendanceAdminTabs active="requests"/>{[...new Set(failures)].map(label=><Alert key={label} tone="warning" title={`${label} unavailable`}>Refresh to retry. Unavailable work is not counted as empty.</Alert>)}{allowed?<AttendanceRequestsWorkspace pendingCount={pendingCount} allCount={allCount} items={items} total={total} page={page} size={size} view={view} type={type} incomplete={failures.length>0}/>:<Alert tone="warning" title="Review access unavailable">No request-review authority could be verified.</Alert>}</PageStack></main></BrandSurface>;
}
