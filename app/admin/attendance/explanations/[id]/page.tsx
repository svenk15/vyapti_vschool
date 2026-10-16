import {BrandSurface,ButtonLink,PageHeader,PageStack} from '@/components/ui/primitives';
import {AttendanceExplanationReview} from '@/components/attendance-explanation-review';
import {attendanceExplanationsGateway} from '@/lib/server/attendance-explanations';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function ExplanationReviewPage({params}:{params:Promise<{id:string}>}){const item=await attendanceExplanationsGateway.getReviewer(await getIdentity(),(await params).id);return <BrandSurface><main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Attendance" title="Review absence explanation" description="The Parent explanation and school response stay separate from the immutable register." actions={<ButtonLink href="/admin/attendance/explanations" variant="secondary">Back to queue</ButtonLink>}/><AttendanceExplanationReview item={item}/></PageStack></main></BrandSurface>}
