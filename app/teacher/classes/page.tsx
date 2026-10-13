import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';
import {TeacherClassesDirectory} from '@/components/teacher-classes';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function TeacherClassesPage({searchParams}:{searchParams:Promise<{date?:string|string[];q?:string|string[];by?:string|string[];sort?:string|string[];order?:string|string[];year?:string|string[]}>}){const identity=await getIdentity(),params=await searchParams;let workspace;try{const home=await accountGateway.getHome(identity),today=schoolDate(new Date(),home.timezone),date=typeof params.date==='string'?params.date:today;workspace=await academicsGateway.teacherClasses(identity,date);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');}if(!workspace)return <main id="main-content" className="container page-space"><PageStack><PageHeader title="My classes" description="Your dated teaching assignments."/><Alert tone="danger" title="Classes unavailable">Your current identity, assignments and minimal-roster permission are checked on every request.</Alert></PageStack></main>;const by=params.by==='subject'?'subject':'name',sort=params.sort==='subject'?'subject':'name',order=params.order==='desc'?'desc':'asc',query=typeof params.q==='string'?params.q:'',year=typeof params.year==='string'?params.year:'';return <main id="main-content" className="container page-space"><TeacherClassesDirectory workspace={workspace} query={query} by={by} sort={sort} order={order} year={year}/></main>;}
