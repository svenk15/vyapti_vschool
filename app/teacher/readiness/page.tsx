import {redirect} from 'next/navigation';
import {TeacherAssignmentReadiness} from '@/components/teacher-assignment-readiness';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {getIdentity} from '@/lib/server/auth';
import {AccessError} from '@/backend/modules/access/contracts';
function schoolDate(now:Date,timeZone:string){return new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export default async function TeacherReadinessPage({searchParams}:{searchParams:Promise<{date?:string|string[]}>}){const identity=await getIdentity(),params=await searchParams;let readiness,contextLabel='';try{const home=await accountGateway.getHome(identity),today=schoolDate(new Date(),home.timezone),date=typeof params.date==='string'?params.date:today;contextLabel=`${home.institutionName} · ${home.schoolName}`;readiness=await academicsGateway.teacherReadiness(identity,date);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');}return <main id="main-content" className="container page-space">{readiness?<TeacherAssignmentReadiness initial={readiness} contextLabel={contextLabel}/>:<PageStack><PageHeader title="Assignment readiness" description="Review your current teaching setup."/><Alert tone="danger" title="Readiness unavailable">Your current identity, branch access and module availability are rechecked on every request.</Alert></PageStack>}</main>;}
