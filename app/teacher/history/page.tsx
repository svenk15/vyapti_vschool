import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';
import {TeacherAttendanceHistory} from '@/components/teacher-attendance-history';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {attendanceGateway} from '@/lib/server/attendance';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function TeacherHistoryPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const identity=await getIdentity(),params=await searchParams;let result,classes,timezone='UTC';try{const home=await accountGateway.getHome(identity),today=schoolDate(new Date(),home.timezone);timezone=home.timezone;[result,classes]=await Promise.all([attendanceGateway.teacherHistory(identity,params),academicsGateway.teacherClasses(identity,today)]);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');}if(!result||!classes)return <main id="main-content" className="container page-space"><PageStack><PageHeader title="Attendance history"/><Alert tone="danger" title="History unavailable">Your current identity, branch and teaching assignments could not be verified.</Alert></PageStack></main>;const one=(value:unknown)=>typeof value==='string'?value:'',status=Array.isArray(params.status)?params.status:typeof params.status==='string'?[params.status]:[];return <main id="main-content" className="container page-space"><TeacherAttendanceHistory result={result} classes={classes.classes} timezone={timezone} query={one(params.q)} by={params.by==='class'?'class':params.by==='date'?'date':'subject'} sort={params.sort==='subject'?'subject':params.sort==='class'?'class':'date'} order={params.order==='asc'?'asc':'desc'} statuses={status} offeringId={one(params.offeringId)} date={one(params.date)}/></main>}
