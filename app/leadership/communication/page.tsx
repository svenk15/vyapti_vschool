import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Alert,Badge,Card,EmptyState,PageHeader,PageStack,StatCard} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {communicationGateway} from '@/lib/server/communication';

export const dynamic='force-dynamic';
const display=(value:string,timezone:string)=>new Intl.DateTimeFormat('en-IN',{timeZone:timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(value));

export default async function LeadershipCommunication(){
 const identity=await getIdentity();if(!identity)redirect('/sign-in');let coverage,error=false;try{coverage=await communicationGateway.listLeadership(identity);}catch{error=true;}
 const items=coverage?.items??[],eligible=items.reduce((sum,item)=>sum+item.eligibleAccounts,0),read=items.reduce((sum,item)=>sum+item.readAccounts,0),acknowledged=items.filter(item=>item.requiresAcknowledgement).reduce((sum,item)=>sum+item.acknowledgedAccounts,0),ackRequired=items.filter(item=>item.requiresAcknowledgement).reduce((sum,item)=>sum+item.eligibleAccounts,0);
 return <main id="main-content" className="container page-space"><PageStack>
  <PageHeader eyebrow="Communication oversight" title="Notice coverage" description="Frozen publication audiences, reads and explicit acknowledgements reported as separate facts." actions={coverage&&coverage.total<=coverage.items.length?<Link className="btn btn-primary" href="/leadership/reports/communication">Export report</Link>:undefined}/>
  {error||!coverage?<Alert tone="danger" title="Notice coverage unavailable">No zero or coverage rate is inferred because the current authorized Communication projection could not be read.</Alert>:<>
   <section className="leadership-coverage-metrics" aria-label="Notice coverage summary"><StatCard label="Eligible accounts" value={String(eligible)} detail={`${coverage.total} current publication${coverage.total===1?'':'s'} in this branch.`}/><StatCard label="Read" value={String(read)} detail="First portal read of the exact current publication version."/><StatCard label="Acknowledged" value={String(acknowledged)} detail={`${ackRequired} explicit acknowledgement${ackRequired===1?'':'s'} requested.`}/></section>
   <Alert tone="info" title="Three different measures">Eligible audience, portal read and acknowledgement are not delivery synonyms. Withdrawn notices retain immutable evidence but expose no reminder or resend action here.</Alert>
   <Card className="leadership-register-list"><div className="leadership-register-heading padded"><div><h2>Published notice evidence</h2><p className="muted">Current immutable versions, ordered by publication time.</p></div><Badge>{items.length}</Badge></div>{items.length?<div className="table-scroll"><table className="data-table"><caption className="sr-only">Notice coverage by immutable publication</caption><thead><tr><th scope="col">Notice</th><th scope="col">Audience</th><th scope="col">Eligible</th><th scope="col">Read</th><th scope="col">Acknowledged</th><th scope="col">State</th></tr></thead><tbody>{items.map(item=><tr key={item.versionId}><th scope="row"><strong>{item.title}</strong><span className="sub">Version {item.version} · {display(item.publishedAt,coverage.timezone)}</span></th><td data-label="Audience">{item.audienceLabel}</td><td data-label="Eligible">{item.eligibleAccounts}</td><td data-label="Read">{item.readAccounts}</td><td data-label="Acknowledged">{item.requiresAcknowledgement?`${item.acknowledgedAccounts} / ${item.eligibleAccounts}`:'Not requested'}</td><td data-label="State"><Badge tone={item.status==='PUBLISHED'?'success':'warning'}>{item.status==='PUBLISHED'?'Published':'Withdrawn'}</Badge></td></tr>)}</tbody></table></div>:<EmptyState icon="mail" title="No notice coverage yet" description="No current immutable school notice version exists in this authorized branch."/>}</Card>
   <p className="footer-note">Definition {coverage.definitionVersion} · As of {display(coverage.asOf,coverage.timezone)} · {coverage.timezone} · No recipient identities, notice body or family relationship detail.</p>
  </>}
 </PageStack></main>;
}
