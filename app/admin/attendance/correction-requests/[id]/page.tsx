import {PageHeader,PageStack} from '@/components/ui/primitives';
import {AttendanceReviewPage} from '@/components/attendance/review-page';
import {attendanceCorrectionRequestsGateway} from '@/lib/server/attendance-correction-requests';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){const item=await attendanceCorrectionRequestsGateway.getReview(await getIdentity(),(await params).id);return <main id="main-content" className="container page-space"><PageStack><PageHeader title="Review correction"/><AttendanceReviewPage item={{kind:'correction',value:item}}/></PageStack></main>;}
