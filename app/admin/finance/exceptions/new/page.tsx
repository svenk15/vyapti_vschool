import {FinanceExceptionComposer} from '@/components/finance-exception-composer';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {financeGateway} from '@/lib/server/finance';
export const dynamic='force-dynamic';
export default async function Page(){const identity=await getIdentity();let data:{summary:Awaited<ReturnType<typeof financeGateway.summary>>;reviewers:Awaited<ReturnType<typeof financeGateway.reviewers>>}|null=null;try{const summary=await financeGateway.summary(identity,'INR'),reviewers=await financeGateway.reviewers(identity,summary.reconciliationId);data={summary,reviewers};}catch{}return <main id="main-content" className="container page-space">{data?<FinanceExceptionComposer {...data} baseHref="/admin/finance/exceptions"/>:<Alert tone="danger" title="Exception request unavailable">A current request purpose and independent reviewer are required.</Alert>}</main>;}
