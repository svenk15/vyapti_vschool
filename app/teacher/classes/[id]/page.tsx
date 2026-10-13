import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';
import {TeacherClassDetail} from '@/components/teacher-classes';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function TeacherClassPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{date?:string|string[]}>}){const identity=await getIdentity(),route=await params,query=await searchParams;let workspace;try{const home=await accountGateway.getHome(identity),today=schoolDate(new Date(),home.timezone),date=typeof query.date==='string'?query.date:today;workspace=await academicsGateway.teacherClasses(identity,date,route.id);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');}if(!workspace)return <main id="main-content" className="container page-space"><PageStack><PageHeader title="Class unavailable" description="This assigned class cannot be opened."/><Alert tone="danger" title="Access unavailable">Return to My classes or ask the school administrator to review your dated assignment.</Alert></PageStack></main>;return <main id="main-content" className="container page-space"><TeacherClassDetail workspace={workspace}/></main>;}
