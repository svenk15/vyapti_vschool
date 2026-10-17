import {redirect} from 'next/navigation';
import {AttendanceExplanationReview} from '@/components/attendance-explanation-review';
import {Breadcrumbs,PageHeader,PageStack} from '@/components/ui/primitives';
import {attendanceExplanationsGateway} from '@/lib/server/attendance-explanations';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function LeadershipExplanationReview({params}:{params:Promise<{id:string}>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const item=await attendanceExplanationsGateway.getReviewer(identity,(await params).id);return <main id="main-content" className="container page-space"><PageStack><Breadcrumbs items={[{label:'Attendance oversight',href:'/leadership/attendance'},{label:'Absence explanations',href:'/leadership/attendance/explanations'},{label:'Review'}]}/><PageHeader eyebrow="Assigned protected review" title="Review absence explanation" description="Clarification stays with the original authorized submitter. Disposition never changes the Attendance mark."/><AttendanceExplanationReview item={item} returnTo="/leadership/attendance/explanations"/></PageStack></main>;}
