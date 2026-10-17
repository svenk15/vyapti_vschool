import {FinanceWorkspace} from '@/components/finance-workspace';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {financeGateway} from '@/lib/server/finance';
export const dynamic='force-dynamic';
export default async function Page(){const identity=await getIdentity();let data:{summary:Awaited<ReturnType<typeof financeGateway.summary>>;items:Awaited<ReturnType<typeof financeGateway.list>>;canRequest:boolean}|null=null;try{const [summary,items]=await Promise.all([financeGateway.summary(identity,'INR'),financeGateway.list(identity)]);data={summary,items,canRequest:(await financeGateway.reviewers(identity,summary.reconciliationId).catch(()=>[])).length>0};}catch{}return <main id="main-content" className="container page-space">{data?<FinanceWorkspace {...data} baseHref="/leadership/finance/exceptions"/>:<Alert tone="danger" title="Financial oversight unavailable">The Fees module, a current exact Finance purpose and a reconciliation snapshot are required.</Alert>}</main>;}
