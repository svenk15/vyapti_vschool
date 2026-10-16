import {LearningTeacherFeedbackFlow} from '@/components/learning-teacher-feedback';
import {PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {learningGateway} from '@/lib/server/learning';
export const dynamic='force-dynamic';
export default async function TeacherSubmission({params}:{params:Promise<{id:string;submissionId:string}>}){const {id,submissionId}=await params,row=await learningGateway.teacherFeedback(await getIdentity(),id,submissionId);return <main id="main-content" className="container page-space"><PageStack><PageHeader title="Review student work" description={`${row.studentName} · ${row.assignmentTitle}`}/><LearningTeacherFeedbackFlow initial={row}/></PageStack></main>}
