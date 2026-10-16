import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {WorkspaceExitFlow} from '@/components/workspace-exit-flow';
import {TeacherPortalFrame} from '@/components/teacher-portal-frame';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {accountGateway,contextGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {moduleGateway} from '@/lib/server/tenancy';
import {academicsGateway} from '@/lib/server/academics';
import {attendanceGateway} from '@/lib/server/attendance';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';

export const dynamic='force-dynamic';

export default async function TeacherContextPage({searchParams}:{searchParams:Promise<{destination?:string|string[]}>}){
 const identity=await getIdentity(),query=await searchParams;
 let home:Awaited<ReturnType<typeof accountGateway.getHome>>|null=null,directory:Awaited<ReturnType<typeof contextGateway.getContexts>>|null=null;
 try{[home,directory]=await Promise.all([accountGateway.getHome(identity),contextGateway.getContexts(identity)]);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');}
 if(!home||!directory)return <main id="main-content" className="container page-space"><Alert tone="danger" title="Destinations unavailable">Your current branch remains active. Refresh and try again.</Alert></main>;
 const destination=typeof query.destination==='string'?query.destination:'';
 if(home.capabilities.includes('school.manage'))redirect(`/admin/context${destination?`?destination=${encodeURIComponent(destination)}`:''}`);
 const today=schoolDate(new Date(),home.timezone),[canUseTimetable,canUseClasses,canUseHistory]=await Promise.all([home.capabilities.includes('timetable.read')?moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'timetable','timetable.read').catch(()=>false):false,home.capabilities.includes('class.read')&&home.capabilities.includes('student.read')?academicsGateway.teacherClasses(identity,today).then(()=>true).catch(()=>false):false,home.capabilities.includes('attendance.read_class')?attendanceGateway.teacherHistory(identity,{}).then(()=>true).catch(()=>false):false]);
 return <TeacherPortalFrame home={home} canUseClasses={canUseClasses} canUseTimetable={canUseTimetable} canUseHistory={canUseHistory}><main id="main-content" className="container page-space context-workflow-page"><PageStack><PageHeader eyebrow="My account" title="Switch branch or leave the workspace" description={`${home.institutionName} · ${home.schoolName}`}/><WorkspaceExitFlow home={home} directory={directory} initialDestination={destination} returnHref="/account"/></PageStack></main></TeacherPortalFrame>;
}
