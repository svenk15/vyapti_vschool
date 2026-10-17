import {redirect} from 'next/navigation';
import {Alert,Badge,Card,PageHeader,PageStack} from '@/components/ui/primitives';
import {delegationGateway,leadershipGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';

export const dynamic='force-dynamic';
const labels:Record<string,string>={
  'leadership.read':'Leadership workspace',
  'attendance.read_leadership':'Attendance oversight',
  'timetable.read_leadership':'Timetable oversight',
  'learning.read_leadership':'Learning oversight',
  'communication.read_leadership':'Communication oversight',
};

export default async function LeadershipDelegations(){
  const identity=await getIdentity();if(!identity)redirect('/sign-in');
  const home=await leadershipGateway.getHome(identity).catch(()=>null);if(!home)redirect('/choose-workspace');
  const items=(await delegationGateway.listOwn(identity)).filter(item=>item.schoolId===home.scope.schoolId);
  const active=items.find(item=>item.status==='ACTIVE'&&item.delegationId===home.actingDelegation?.delegationId)??null;
  return <main id="main-content" className="container page-space"><PageStack>
    <PageHeader eyebrow="Acting leadership" title="My acting access" description={`${home.institutionName} · ${home.schoolName}`}/>
    {active?<Card className="padded"><div className="record-heading"><div><h2>Current delegation</h2><p className="muted">This temporary authority is rechecked on every protected request.</p></div><Badge tone="success">Active</Badge></div><dl className="record-facts"><div><dt>Starts</dt><dd>{new Date(active.startsAt).toLocaleString('en-IN',{timeZone:home.timezone})}</dd></div><div><dt>Ends</dt><dd>{new Date(active.endsAt).toLocaleString('en-IN',{timeZone:home.timezone})}</dd></div><div><dt>Reason</dt><dd>{active.reason}</dd></div><div><dt>Allowed actions</dt><dd>{active.actions.map(action=>labels[action]??action).join(', ')}</dd></div></dl><Alert tone="info" title="Temporary, bounded authority">Permanent roles are unchanged. Actions outside this list remain unavailable, and expiry or revocation stops future protected requests immediately.</Alert></Card>:<Alert tone="warning" title="No active acting access">The temporary delegation ended, was revoked, or is not yet effective. Existing attributable receipts remain unchanged.</Alert>}
    {items.length>1?<Card className="padded"><h2>Delegation history</h2><div className="record-list">{items.filter(item=>item.delegationId!==active?.delegationId).map(item=><div className="record-row" key={item.delegationId}><div><strong>{item.status.toLowerCase()}</strong><p className="small muted">{new Date(item.startsAt).toLocaleDateString('en-IN',{timeZone:home.timezone})}–{new Date(item.endsAt).toLocaleDateString('en-IN',{timeZone:home.timezone})}</p></div><Badge tone={item.status==='REVOKED'?'warning':'neutral'}>{item.status}</Badge></div>)}</div></Card>:null}
    <p className="footer-note">Synthetic-only D02 authority · Issuance and revocation use the trusted Access operator path · Human review pending.</p>
  </PageStack></main>;
}
