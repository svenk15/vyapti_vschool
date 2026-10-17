import {redirect} from 'next/navigation';
import {AssessmentReportRecipientList} from '@/components/assessment-report-recipient-list';
import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {familyPageContext} from '@/lib/server/family-page';
import {assessmentsGateway} from '@/lib/server/assessments';
export const dynamic='force-dynamic';
export default async function FamilyResults({searchParams}:{searchParams:Promise<{child?:string|string[]}>}){const query=await searchParams,{identity,workspace,selected}=await familyPageContext(Array.isArray(query.child)?undefined:query.child);if(!selected.purposes.includes('results.read_child'))redirect('/family/access-unavailable');const portal=await assessmentsGateway.guardianReports(identity,selected.studentId);return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader title="Results" description="School-published assessment reports for this child and your current explicit access."/><AssessmentReportRecipientList portal={portal} timezone={selected.timezone}/></PageStack></main></FamilyPortalFrame></BrandSurface>;}
