import {redirect} from 'next/navigation';
import {Alert,Badge,ButtonLink,Card,EmptyState,PageHeader,PageStack} from '@/components/ui/primitives';
import {AssessmentPlanningWorkspaceView} from '@/components/assessment-planning-workspace';
import {PortalIcon} from '@/components/portal-navigation-group';
import {getIdentity} from '@/lib/server/auth';
import {assessmentsGateway} from '@/lib/server/assessments';
export const dynamic='force-dynamic';
export default async function AssessmentPlanningPage({searchParams}:{searchParams:Promise<{workflow?:string}>}){const identity=await getIdentity();if(!identity)redirect('/sign-in');const params=await searchParams;let workspace:Awaited<ReturnType<typeof assessmentsGateway.planningWorkspace>>|null=null;try{workspace=await assessmentsGateway.planningWorkspace(identity);}catch{}return <main id="main-content" className="container page-space">{workspace?(params.workflow==='planning'?<AssessmentPlanningWorkspaceView initial={workspace}/>:<AssessmentLanding workspace={workspace}/>):<><PageHeader eyebrow="Academics · Assessments" title="Assessments"/><Alert tone="warning" title="Assessment coordination unavailable">This branch requires the Assessments module and an explicit planning designation. School Administrator role alone is not sufficient.</Alert></>}</main>;}

function AssessmentLanding({workspace}:{workspace:Awaited<ReturnType<typeof assessmentsGateway.planningWorkspace>>}){const active=workspace.cycles.filter(cycle=>cycle.state!=='RELEASED'&&cycle.state!=='WITHDRAWN'),drafts=workspace.cycles.filter(cycle=>cycle.state==='DRAFT');return <PageStack className="assessment-directory-page">
 <PageHeader title="Assessments" description="Coordinate assessment setup and marks readiness."/>
 <div className="assessment-directory-grid">
  <div className="assessment-directory-main">
   <Card className="assessment-work-list"><div className="assessment-card-heading"><div><h2>Work to coordinate</h2><p className="muted">Current assessment cycles for this branch.</p></div><Badge tone={drafts.length?'warning':'success'}>{drafts.length?`${drafts.length} draft${drafts.length===1?'':'s'}`:'Up to date'}</Badge></div>{active.length?<ul>{active.slice(0,4).map(cycle=><li key={cycle.id}><span className="assessment-row-icon"><PortalIcon name="academics"/></span><span><strong>{cycle.name}</strong><small>{cycle.academicYearName} · {cycle.sectionName} · {cycle.planItemCount} subject{cycle.planItemCount===1?'':'s'}</small></span><Badge tone={cycle.state==='DRAFT'?'warning':'info'}>{cycle.state.replaceAll('_',' ')}</Badge></li>)}</ul>:<EmptyState icon="document" title="No active assessment cycles" description="Open planning to create a versioned scoring scale and the first assessment cycle."/>}</Card>
   <Card className="padded assessment-workflow-entry"><div className="assessment-card-heading"><div><h2>Coordinate assessment setup and marks readiness</h2><p>The assessment moves only when its defined prerequisites are met.</p></div><Badge tone="info">Planning</Badge></div><ButtonLink variant="secondary" href="/admin/assessments?workflow=planning">Open planning workflow <span aria-hidden="true">→</span></ButtonLink></Card>
  </div>
  <aside className="assessment-directory-aside"><Card className="padded"><h2>How this connects</h2><p>Planning pins the scoring rules, subject requirements and dated pupil cohort used by later assessment work.</p><div className="section-divider"/><h3>Access boundary</h3><p>School coordination does not imply permission to edit teachers’ marks, moderate outcomes or publish reports.</p></Card></aside>
 </div>
 </PageStack>;}
