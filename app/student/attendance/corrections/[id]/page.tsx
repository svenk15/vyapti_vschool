import Link from 'next/link';
import {AttendanceCorrectionRequestStatus} from '@/components/attendance-correction-request';
import {BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {StudentPortalFrame} from '@/components/student-portal-frame';
import {attendanceCorrectionRequestsGateway as gateway} from '@/lib/server/attendance-correction-requests';
import {studentPageContext} from '@/lib/server/student-page';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{student?:string}>}){const {id}=await params,{student}=await searchParams,{workspace,selected}=await studentPageContext(student,'attendance.correction.request_self'),item=await gateway.getOwn(await getIdentity(),'STUDENT',id,selected.studentId);return <BrandSurface><StudentPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader title="Correction request status" description="The current status is reauthorized on every view."/><AttendanceCorrectionRequestStatus item={item}/><Link href={`/student/attendance?student=${selected.studentId}`}>← Back to attendance</Link></PageStack></main></StudentPortalFrame></BrandSurface>}
