import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {LearningPublishFlow} from '@/components/learning-publish-flow';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {learningGateway} from '@/lib/server/learning';
export const dynamic='force-dynamic';
export default async function NewLearningAssignment(){let workspace:Awaited<ReturnType<typeof learningGateway.teacherWorkspace>>|null=null;try{workspace=await learningGateway.teacherWorkspace(await getIdentity());}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');}return <main id="main-content" className="container page-space">{workspace?.offerings.length?<LearningPublishFlow offerings={workspace.offerings} timezone={workspace.timezone}/>:<Alert tone="danger" title="No assigned class available">A current dated Teacher assignment and active Learning module are required.</Alert>}</main>;
}
