import {AssistantComposer} from '@/components/assistant-workspace';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {assistantGateway} from '@/lib/server/assistant';
export const dynamic='force-dynamic';
export default async function Page(){const identity=await getIdentity();let availability:Awaited<ReturnType<typeof assistantGateway.availability>>|null=null;try{availability=await assistantGateway.availability(identity);}catch{}return availability?.canGenerate&&availability.sources.length?<AssistantComposer sources={availability.sources}/>:<Alert tone="warning" title="No authorized source">Capture a retained Reporting snapshot and obtain an explicit Assistant generation designation.</Alert>;}
