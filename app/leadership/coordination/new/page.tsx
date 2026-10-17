import {redirect} from 'next/navigation';
import {Alert,Breadcrumbs,PageHeader,PageStack} from '@/components/ui/primitives';
import {CoordinationCreate} from '@/components/coordination-create';
import {getIdentity} from '@/lib/server/auth';
import {coordinationGateway} from '@/lib/server/coordination';
import {leadershipAttendanceGateway} from '@/lib/server/attendance';
import {leadershipGateway} from '@/lib/server/access';
import type {CoordinationRequestKind,CoordinationSourceSummary} from '@/shared/contracts/coordination';

export const dynamic='force-dynamic';
const first=(value:string|string[]|undefined)=>Array.isArray(value)?value[0]:value;
export default async function NewCoordinationPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const identity=await getIdentity();if(!identity)redirect('/sign-in');const params=await searchParams,sessionId=first(params.session),pupilReview=first(params.pupilReview),kind=first(params.kind) as CoordinationRequestKind,returnHref=first(params.return)?.startsWith('/leadership/attendance')?first(params.return)!:'/leadership/attendance';
 let data:{source:CoordinationSourceSummary;assignees:Awaited<ReturnType<typeof coordinationGateway.sourceAssignees>>;home:Awaited<ReturnType<typeof leadershipGateway.getHome>>}|null=null;
 try{if(pupilReview&&kind==='PUPIL_ATTENDANCE_SUPPORT'){const [setup,home]=await Promise.all([coordinationGateway.sourceSetup(identity,{sourceType:'ATTENDANCE_PUPIL_PATTERN',sourceId:pupilReview,kind}),leadershipGateway.getHome(identity)]);data={source:setup.source,assignees:setup.assignees,home};}else if(sessionId&&['MISSING_REGISTER','SESSION_SETUP_REVIEW'].includes(kind)){const [source,assignees,home]=await Promise.all([leadershipAttendanceGateway.detail(identity,sessionId),coordinationGateway.sourceAssignees(identity,{sessionId,kind}),leadershipGateway.getHome(identity)]);data={source:{type:'ATTENDANCE_SESSION',id:source.id,version:source.version,schoolDate:source.schoolDate,startsAt:source.startsAt,endsAt:source.endsAt,sectionName:source.sectionName,subjectName:source.subjectName,teacherName:source.teacherName,state:source.currentState,eligible:source.evidenceState!=='CANCELLED'},assignees,home};}}catch{data=null;}
 if(!data)return <main id="main-content" className="container page-space"><PageStack><Breadcrumbs items={[{label:'Attendance oversight',href:returnHref},{label:'New follow-up'}]}/><PageHeader title="Create Attendance follow-up"/><Alert tone="danger" title="Source unavailable">The exact source, current named-pupil authority or eligible coordinator list could not be verified.</Alert></PageStack></main>;
 const title=kind==='MISSING_REGISTER'?'Create missing-register follow-up':kind==='PUPIL_ATTENDANCE_SUPPORT'?'Route pupil Attendance support':'Send session setup for review';return <main id="main-content" className="container page-space"><PageStack className="coordination-create-page"><Breadcrumbs items={[{label:'Attendance oversight',href:returnHref},{label:'New follow-up'}]}/><PageHeader eyebrow="Attendance coordination" title={title} description="Review the exact source and create one scoped, accountable request."/>{data.assignees.length?<CoordinationCreate source={data.source} kind={kind} assignees={data.assignees} timezone={data.home.timezone} returnHref={returnHref}/>:<Alert tone="warning" title="No eligible coordinator">No currently designated worker also has the named-pupil Attendance grant required for this source.</Alert>}</PageStack></main>;
}
