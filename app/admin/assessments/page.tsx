import {redirect} from 'next/navigation';
import {Alert,PageHeader} from '@/components/ui/primitives';
import {AssessmentPlanningWorkspaceView} from '@/components/assessment-planning-workspace';
import {getIdentity} from '@/lib/server/auth';
import {assessmentsGateway} from '@/lib/server/assessments';
export const dynamic='force-dynamic';
export default async function AssessmentPlanningPage(){const identity=await getIdentity();if(!identity)redirect('/sign-in');let workspace:Awaited<ReturnType<typeof assessmentsGateway.planningWorkspace>>|null=null;try{workspace=await assessmentsGateway.planningWorkspace(identity);}catch{}return <main id="main-content" className="container page-space">{workspace?<AssessmentPlanningWorkspaceView initial={workspace}/>:<><PageHeader eyebrow="Academics · Assessments" title="Assessment planning"/><Alert tone="warning" title="Assessment planning unavailable">This branch requires the Assessments module and an explicit planning designation. School Administrator role alone is not sufficient.</Alert></>}</main>;}
