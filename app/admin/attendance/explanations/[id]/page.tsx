import {PageHeader,PageStack} from '@/components/ui/primitives';
import {AttendanceReviewPage} from '@/components/attendance/review-page';
import {attendanceExplanationsGateway} from '@/lib/server/attendance-explanations';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){const item=await attendanceExplanationsGateway.getReviewer(await getIdentity(),(await params).id);return <main id="main-content" className="container page-space"><PageStack><PageHeader title="Review explanation"/><AttendanceReviewPage item={{kind:'explanation',value:item}}/></PageStack></main>;}
