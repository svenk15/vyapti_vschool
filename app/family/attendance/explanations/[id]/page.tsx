import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {AttendanceExplanationDetail} from '@/components/attendance-explanation-detail';
import {BrandSurface,ButtonLink,PageHeader,PageStack} from '@/components/ui/primitives';
import {familyPageContext} from '@/lib/server/family-page';
import {attendanceExplanationsGateway} from '@/lib/server/attendance-explanations';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function ExplanationDetail({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{child?:string}>}){const [{id},query]=await Promise.all([params,searchParams]),{workspace,selected}=await familyPageContext(query.child),item=await attendanceExplanationsGateway.getParent(await getIdentity(),selected.studentId,id);return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Attendance" title="Explanation status" description="Track the school decision without changing the attendance register." actions={<ButtonLink href={`/family/attendance?child=${selected.studentId}`} variant="secondary">Back to attendance</ButtonLink>}/><AttendanceExplanationDetail item={item} studentId={selected.studentId}/></PageStack></main></FamilyPortalFrame></BrandSurface>}
