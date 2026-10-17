import {AssistantDraftView} from '@/components/assistant-workspace';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {assistantGateway} from '@/lib/server/assistant';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){let draft:Awaited<ReturnType<typeof assistantGateway.get>>|null=null;try{draft=await assistantGateway.get(await getIdentity(),(await params).id);}catch{}return draft?<AssistantDraftView initial={draft}/>:<Alert tone="danger" title="Draft unavailable">Current source permission and the exact Assistant designation are rechecked before any draft is disclosed.</Alert>;}
