import Link from 'next/link';
import {AttendanceCorrectionRequestStatus} from '@/components/attendance-correction-request';
import {PageHeader,PageStack} from '@/components/ui/primitives';
import {attendanceCorrectionRequestsGateway as gateway} from '@/lib/server/attendance-correction-requests';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){const item=await gateway.getOwn(await getIdentity(),'TEACHER',(await params).id);return <main id="main-content" className="container page-space"><PageStack><PageHeader title="Correction request status" description="The current assignment and purpose grant are rechecked before disclosure."/><AttendanceCorrectionRequestStatus item={item}/><Link href={`/teacher/sessions/${item.sessionId}`}>← Back to submitted register</Link></PageStack></main>}
