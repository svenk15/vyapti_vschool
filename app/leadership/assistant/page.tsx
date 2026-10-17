import {AssistantDraftList} from '@/components/assistant-workspace';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {assistantGateway} from '@/lib/server/assistant';
export const dynamic='force-dynamic';
export default async function Page(){const identity=await getIdentity();let data:{availability:Awaited<ReturnType<typeof assistantGateway.availability>>;items:Awaited<ReturnType<typeof assistantGateway.list>>}|null=null;try{const [availability,items]=await Promise.all([assistantGateway.availability(identity),assistantGateway.list(identity)]);data={availability,items};}catch{}return data?<AssistantDraftList availability={data.availability} items={data.items}/>:<Alert tone="warning" title="Evidence assistant unavailable">An explicit synthetic Assistant designation, an authorized retained source and the local test adapter are required.</Alert>;}
