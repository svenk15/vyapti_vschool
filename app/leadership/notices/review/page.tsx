import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,Badge,ButtonLink,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {communicationGateway} from '@/lib/server/communication';

export const dynamic='force-dynamic';

export default async function NoticeReviewInbox(){
  const identity=await getIdentity();
  const result=await (async()=>{
    try{return {ok:true as const,rows:await communicationGateway.listReviewProposals(identity)};}
    catch(error){
      if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
      return {ok:false as const};
    }
  })();
  if(!result.ok)return <main id="main-content" className="leadership-page"><Alert tone="danger" title="Notice reviews unavailable">Current leadership authority and the exact REVIEW designation are required.</Alert></main>;
  return <main id="main-content" className="leadership-page"><PageStack><PageHeader eyebrow="Communication decisions" title="Notice reviews" description="Review only proposals assigned to your current exact branch authority."/>{result.rows.length?<Card className="directory-card"><div className="directory-heading"><div><h2>Assigned proposals</h2><p className="small muted">Approval covers one immutable content and audience digest.</p></div><Badge>{result.rows.length}</Badge></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Proposal</th><th>Audience</th><th>Status</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{result.rows.map(row=><tr key={row.proposalId}><th scope="row"><strong>{row.title}</strong><small>Revision {row.revisionNumber}</small></th><td data-label="Audience">{row.audienceLabel}</td><td data-label="Status"><Badge tone={row.status==='APPROVED'?'success':row.status==='REJECTED'?'danger':'warning'}>{row.status.replace('_',' ')}</Badge></td><td data-label="Action"><ButtonLink variant="secondary" href={`/leadership/notices/review/${row.proposalId}`}>{row.status==='IN_REVIEW'?'Review':'View decision'}</ButtonLink></td></tr>)}</tbody></table></div></Card>:<Card><EmptyState icon="mail" title="No notice reviews waiting" description="Only proposals assigned by the Communication owner appear here."/></Card>}</PageStack></main>;
}
