import {AssessmentReportRecipientList} from '@/components/assessment-report-recipient-list';
import {StudentPortalFrame} from '@/components/student-portal-frame';
import {BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {studentPageContext} from '@/lib/server/student-page';
import {assessmentsGateway} from '@/lib/server/assessments';
export const dynamic='force-dynamic';
export default async function StudentResults({searchParams}:{searchParams:Promise<{student?:string|string[]}>}){const query=await searchParams,{identity,workspace,selected}=await studentPageContext(Array.isArray(query.student)?undefined:query.student,'results.read_self'),portal=await assessmentsGateway.studentReports(identity,selected.studentId);return <BrandSurface><StudentPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader title="My results" description="Assessment reports published to your current Student access."/><AssessmentReportRecipientList portal={portal} timezone={selected.timezone}/></PageStack></main></StudentPortalFrame></BrandSurface>;}
