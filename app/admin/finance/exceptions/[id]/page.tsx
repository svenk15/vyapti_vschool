import {FinanceExceptionReview} from '@/components/finance-exception-review';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {financeGateway} from '@/lib/server/finance';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){let item:Awaited<ReturnType<typeof financeGateway.get>>|null=null;try{item=await financeGateway.get(await getIdentity(),(await params).id);}catch{}return <main id="main-content" className="container page-space">{item?<FinanceExceptionReview item={item} baseHref="/admin/finance/exceptions"/>:<Alert tone="danger" title="Financial exception unavailable">This item is outside your assignment or Finance purpose.</Alert>}</main>;}
