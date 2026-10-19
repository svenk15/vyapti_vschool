import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,Badge,ButtonLink,Card,EmptyState,PageHeader,PageStack,SectionHeader} from '@/components/ui/primitives';
import {CommunicationTabs} from '@/components/communication-tabs';
import {PortalIcon} from '@/components/portal-navigation-group';
import {getIdentity} from '@/lib/server/auth';
import {communicationGateway} from '@/lib/server/communication';
export const dynamic='force-dynamic';
export default async function CommunicationPage(){
 const identity=await getIdentity();
 const [publishedResult,proposalResult]=await Promise.allSettled([communicationGateway.listAdmin(identity),communicationGateway.listAuthorProposals(identity)]);
 if(publishedResult.status==='rejected'&&publishedResult.reason instanceof AccessError&&publishedResult.reason.code==='UNAUTHENTICATED')redirect('/sign-in');
 const rows=publishedResult.status==='fulfilled'?publishedResult.value:null,proposals=proposalResult.status==='fulfilled'?proposalResult.value:null;
 const publishedCount=rows?.filter(row=>row.status==='PUBLISHED').length??null;
 const reviewCount=proposals?.filter(row=>row.status==='IN_REVIEW').length??null;
 const readyCount=proposals?.filter(row=>row.status==='APPROVED').length??null;
 return <main id="main-content" className="container page-space"><PageStack>
  <PageHeader title="Communication" description="Keep the school community informed, with a clear next action." actions={proposals!==null?<ButtonLink href="/admin/communication/new"><PortalIcon name="mail"/> Create notice</ButtonLink>:undefined}/>
  <CommunicationTabs/>
  <Card className="communication-summary-strip" aria-label="Communication summary">
   <div><strong>{publishedCount??'—'}</strong><span>Published notices</span></div>
   <div><strong>{reviewCount??'—'}</strong><span>Awaiting review</span></div>
   <div><strong>{readyCount??'—'}</strong><span>Ready to publish</span></div>
  </Card>
  <section id="published-notices" className="communication-section" aria-labelledby="published-notices-title">
   {rows===null?<Alert tone="danger" title="Published notices unavailable">Current module state and publication authority are checked on the server.</Alert>:rows.length?<Card className="directory-card communication-directory"><div className="directory-heading"><div><h2 id="published-notices-title">Published notices</h2><p className="small muted">Read and acknowledgement are reported separately for the frozen audience.</p></div><Badge>{rows.length}</Badge></div><div id="delivery-follow-up" className="table-scroll communication-directory-table"><table className="data-table"><caption className="sr-only">Published school notices and delivery status</caption><thead><tr><th>Notice</th><th>Audience</th><th>Status</th><th>Acknowledged</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{rows.map(row=><tr key={row.noticeId}><th scope="row"><span className="table-cell-stack"><strong>{row.title}</strong><small>Version {row.version} · {new Date(row.publishedAt).toLocaleDateString()}</small></span></th><td data-label="Audience"><span className="table-cell-stack"><span>{row.audienceLabel}</span><small>{row.recipientCount} recipient account{row.recipientCount===1?'':'s'}</small></span></td><td data-label="Status"><span className="table-cell-stack"><Badge tone={row.status==='PUBLISHED'?'success':'warning'}>{row.status==='PUBLISHED'?'Published':'Withdrawn'}</Badge><small>{row.readCount} read</small></span></td><td data-label="Acknowledged">{row.requiresAcknowledgement?`${row.acknowledgedCount} / ${row.recipientCount}`:'Not requested'}</td><td data-label="Action">{row.status==='PUBLISHED'&&<ButtonLink variant="secondary" href={`/admin/communication/${row.noticeId}/withdraw`}>Withdraw</ButtonLink>}</td></tr>)}</tbody></table></div></Card>:<Card><EmptyState icon="mail" title="No published notices" description="An independently approved proposal appears here only after a separate publisher confirms it."/></Card>}
  </section>
  <section id="notice-proposals" className="communication-section" aria-labelledby="notice-proposals-title">
   {proposals===null?<Alert tone="warning" title="Proposal authoring unavailable">Current branch and exact Communication AUTHOR designation are required.</Alert>:proposals.length?<Card className="directory-card communication-directory"><div className="directory-heading"><SectionHeader title="Drafts & approvals" description="Draft, independent review and final publication remain separate."/><Badge>{proposals.length}</Badge></div><div className="table-scroll communication-directory-table"><table className="data-table"><caption className="sr-only">Notice drafts and approval status</caption><thead><tr><th>Proposal</th><th>Audience</th><th>Status</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{proposals.map(row=><tr key={row.proposalId}><th scope="row"><span className="table-cell-stack"><strong>{row.title}</strong><small>Revision {row.revisionNumber}</small></span></th><td data-label="Audience"><span className="table-cell-stack"><span>{row.audienceLabel}</span></span></td><td data-label="Status"><span className="table-cell-stack"><Badge tone={row.status==='PUBLISHED'||row.status==='APPROVED'?'success':row.status==='REJECTED'?'danger':'warning'}>{row.status.replace('_',' ')}</Badge></span></td><td data-label="Action"><ButtonLink variant="secondary" href={`/admin/communication/proposals/${row.proposalId}`}>{row.status==='APPROVED'?'Publish':row.status==='DRAFT'||row.status==='RETURNED'?'Continue':'View'}</ButtonLink></td></tr>)}</tbody></table></div></Card>:<Card><EmptyState icon="mail" title="No notice proposals" description="Prepare a text-only portal notice and submit its exact revision for independent review."/></Card>}
  </section>
 </PageStack></main>;
}
