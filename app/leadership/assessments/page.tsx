import {redirect} from 'next/navigation';
import {Alert,Badge,Card,EmptyState,PageHeader,PageStack,StatCard} from '@/components/ui/primitives';
import {SelectField} from '@/components/ui/forms';
import {getIdentity} from '@/lib/server/auth';
import {assessmentsGateway} from '@/lib/server/assessments';

export const dynamic='force-dynamic';
const label=(value:string)=>value.replaceAll('_',' ').toLowerCase();

export default async function LeadershipAssessments({searchParams}:{searchParams:Promise<{cycle?:string}>}){
 const identity=await getIdentity();if(!identity)redirect('/sign-in');
 const params=await searchParams;let view,error=false;
 try{view=await assessmentsGateway.leadershipReadiness(identity,params.cycle);}catch{error=true;}
 return <main id="main-content" className="container page-space"><PageStack>
  <PageHeader eyebrow="Assessment oversight" title="Assessment and report readiness" description="Frozen cohort outcomes, moderation and report states from one exact scheme version." actions={view&&!view.readyForApproval?<a className="btn btn-primary" href={`/leadership/coordination/new?assessmentCycle=${encodeURIComponent(view.cycle.id)}&kind=ASSESSMENT_READINESS_FOLLOW_UP&return=${encodeURIComponent(`/leadership/assessments?cycle=${view.cycle.id}`)}`}>Create readiness follow-up</a>:undefined}/>
  {error||!view?<Alert tone="danger" title="Assessment readiness unavailable">No readiness count is shown. Check the current branch, Assessments module and explicit oversight grant.</Alert>:<>
   <Card className="padded"><form method="get" className="compact-toolbar"><SelectField label="Assessment cycle" name="cycle" defaultValue={view.cycle.id}>{view.cycles.map(cycle=><option key={cycle.id} value={cycle.id}>{cycle.name} · {cycle.academicYearName} · {cycle.sectionName} · scheme {cycle.schemeVersion}</option>)}</SelectField><button className="btn btn-secondary" type="submit">View cycle</button></form></Card>
   <Card className="padded"><div className="split-heading"><div><Badge tone={view.readyForApproval?'success':'warning'}>{view.readyForApproval?'Ready for approval':'Action required'}</Badge><h2>{view.cycle.name}</h2><p>{view.cycle.academicYearName} · {view.cycle.sectionName} · Scheme {view.cycle.schemeVersion}</p></div><div className="small muted">Source cutoff {new Intl.DateTimeFormat('en-IN',{timeZone:view.timezone,dateStyle:'medium',timeStyle:'short'}).format(new Date(view.cycle.sourceCutoff))}</div></div></Card>
   <section className="leadership-coverage-metrics assessment-readiness-metrics" aria-label="Assessment readiness summary"><StatCard label="Required outcomes" value={String(view.counts.requiredSlots)} detail="Frozen required subject and cohort slots."/><StatCard label="Numeric" value={String(view.counts.numeric)} detail="Includes a recorded numeric zero."/><StatCard label="Missing" value={String(view.counts.missing)} detail="Never converted to zero."/><StatCard label="Moderation pending" value={String(view.counts.moderationPending)} detail="Approval and publication remain separate."/></section>
   {view.blockers.length?<Alert tone="warning" title="Readiness blockers">{view.blockers.map(label).join(' · ')}</Alert>:<Alert tone="success" title="Readiness prerequisites satisfied">This does not publish a report.</Alert>}
   <Card className="leadership-register-list assessment-readiness-table"><div className="leadership-register-heading padded"><div><h2>Subject requirements</h2><p className="muted">Not assessed, absent, excused and missing remain distinct.</p></div><Badge>{view.cycle.state}</Badge></div>{view.subjects.length?<div className="table-scroll"><table className="data-table"><thead><tr><th>Subject</th><th>Requirement</th><th>Numeric</th><th>Not assessed</th><th>Absent</th><th>Excused</th><th>Missing</th><th>Moderation</th></tr></thead><tbody>{view.subjects.map(row=><tr key={row.planItemId}><th scope="row">{row.subjectName}</th><td data-label="Requirement">{row.required?'Required':'Optional'}</td><td data-label="Numeric">{row.numeric}</td><td data-label="Not assessed">{row.notAssessed}</td><td data-label="Absent">{row.absent}</td><td data-label="Excused">{row.excused}</td><td data-label="Missing">{row.missing}</td><td data-label="Moderation">{row.moderationStatus?label(row.moderationStatus):'Not submitted'}</td></tr>)}</tbody></table></div>:<EmptyState icon="document" title="No subject requirements" description="This cycle has no configured assessment plan. No readiness percentage is inferred."/>}</Card>
   <Card className="padded"><h2>Report states</h2><dl className="record-facts"><div><dt>Withheld</dt><dd>{view.counts.reportsWithheld}</dd></div><div><dt>Approved</dt><dd>{view.counts.reportsApproved}</dd></div><div><dt>Published</dt><dd>{view.counts.reportsPublished}</dd></div><div><dt>Withdrawn</dt><dd>{view.counts.reportsWithdrawn}</dd></div></dl></Card>
   <p className="footer-note">Definition {view.definitionVersion} · {view.scale.name} uses scaled integers with {view.scale.rounding.toLowerCase().replace('_',' ')} rounding.</p>
  </>}
 </PageStack></main>;
}
