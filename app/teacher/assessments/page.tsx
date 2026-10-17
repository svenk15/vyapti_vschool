import {redirect} from 'next/navigation';
import {AssessmentMarkEntry} from '@/components/assessment-mark-entry';
import {AssessmentModerationActions} from '@/components/assessment-moderation-actions';
import {Alert,PageHeader,PageStack} from '@/components/ui/primitives';
import {AccessError} from '@/backend/modules/access/contracts';
import {getIdentity} from '@/lib/server/auth';
import {assessmentsGateway} from '@/lib/server/assessments';
export const dynamic='force-dynamic';
export default async function TeacherAssessmentsPage(){const identity=await getIdentity();let workspace,moderation;try{[workspace,moderation]=await Promise.all([assessmentsGateway.markWorkspace(identity),assessmentsGateway.moderationWorkspace(identity)]);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');}return <main id="main-content" className="container page-space">{workspace&&moderation?<PageStack><AssessmentMarkEntry initial={workspace}/><AssessmentModerationActions initial={moderation}/></PageStack>:<PageStack><PageHeader eyebrow="Assessments" title="Enter marks"/><Alert tone="danger" title="Assessments unavailable">Your current branch, Teacher identity, exact subject assignment and module access are checked on every request.</Alert></PageStack>}</main>;}
