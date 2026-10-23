import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,Avatar,Badge,BrandSurface,ButtonLink,PageStack,SectionHeader} from '@/components/ui/primitives';
import {StaffPortalManagement} from '@/components/staff-portal-management';
import {StaffAssignmentsAction} from '@/components/staff-profile-actions';
import {getIdentity} from '@/lib/server/auth';
import {peopleGateway} from '@/lib/server/people';

export const dynamic='force-dynamic';
const category=(value:string)=>value==='ADMINISTRATION'?'Administration':value==='SUPPORT'?'Support':value==='UNCLASSIFIED'?'Unclassified':'Teaching';
const date=(value:string|null)=>value?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`)):'Current';
function safeReturn(value:string|undefined){if(!value)return '/admin/teachers';try{const url=new URL(value,'http://vschool.local');if(url.pathname!=='/admin/teachers')return '/admin/teachers';const output=new URLSearchParams();for(const key of ['q','by','category','categories','employment','employments','sort','order','cursor','limit']){const item=url.searchParams.get(key);if(item)output.set(key,item.slice(0,2048));}return `/admin/teachers${output.size?`?${output}`:''}`;}catch{return '/admin/teachers';}}

export default async function StaffProfilePage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{returnTo?:string|string[]}>}){
 const identity=await getIdentity(),{id}=await params,query=await searchParams,returnTo=safeReturn(Array.isArray(query.returnTo)?undefined:query.returnTo);let profile:Awaited<ReturnType<typeof peopleGateway.staffProfile>>;
 try{profile=await peopleGateway.staffProfile(identity,id);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');if(error instanceof AccessError&&(error.code==='NOT_FOUND'||error.code==='FORBIDDEN'))notFound();return <BrandSurface><main id="main-content" className="container page-space"><Alert tone="danger" title="Staff profile unavailable">Refresh the Staff directory and try again. No access or teaching state has been inferred.</Alert></main></BrandSurface>;}
 const active=profile.employee.employment.status==='ACTIVE',academics=profile.academics.status==='AVAILABLE'?profile.academics.value:null,access=profile.access.status==='AVAILABLE'?profile.access.value:null,currentAssignments=academics?.assignments.filter(item=>item.current)??[];
 return <BrandSurface><main id="main-content" className="container page-space"><PageStack className="staff-profile-page">
  <Link className="staff-profile-back" href={returnTo}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5-7 7 7 7M2 12h18"/></svg>Back to Staff</Link>
  <div className="staff-record">
   <header className="staff-record-identity"><Avatar name={profile.person.displayName}/><div><div><h1>{profile.person.displayName}</h1><Badge tone={active?'success':'neutral'}>{active?'Active':'Ended'}</Badge></div><p>Employee code {profile.employee.staffNumber}</p></div></header>
   <div className="staff-record-body">
    <section className="staff-record-section"><SectionHeader title="Personal details"/><dl className="staff-profile-facts"><div><dt>Full name</dt><dd>{profile.person.displayName}</dd></div><div><dt>Contact email</dt><dd>{profile.person.contactEmail??'Not recorded'}</dd></div></dl></section>
    <section className="staff-record-section"><SectionHeader title="Employment"/><dl className="staff-profile-facts"><div><dt>Employee code</dt><dd>{profile.employee.staffNumber}</dd></div><div><dt>Staff category</dt><dd>{category(profile.employee.category)}</dd></div><div><dt>Joining date</dt><dd>{date(profile.employee.employment.from)}</dd></div><div><dt>Employment</dt><dd>{active?'Current':`Ended ${date(profile.employee.employment.to)}`}</dd></div></dl></section>
    <section className="staff-record-section"><SectionHeader title="Teaching assignments" actions={academics?(currentAssignments.length?<StaffAssignmentsAction assignments={currentAssignments} employeeId={id} eligibility={academics.eligibility} eligibilityPeriod={academics.eligibilityPeriod}/>:<ButtonLink href={`/admin/teachers/${id}/eligibility`} variant="ghost" size="small">Review eligibility</ButtonLink>):undefined}/>{profile.academics.status==='UNAVAILABLE'?<div className="padded"><p className="muted">Teaching information is unavailable for this branch or your current access.</p></div>:<div className="staff-profile-list">{currentAssignments.map(item=><div key={item.assignmentId}><strong>{item.sectionName} · {item.subjectName}</strong><span className="muted small">Current dated assignment · until {date(item.validTo)}</span></div>)}{currentAssignments.length===0&&<div><strong>{academics!.eligibility==='ENABLED'?'Eligible to teach':academics!.eligibility==='DISABLED'?'Teaching disabled':'Not enabled for teaching'}</strong><span className="muted small">{academics!.eligibilityPeriod?`${date(academics!.eligibilityPeriod.validFrom)} to ${academics!.eligibilityPeriod.validTo?date(academics!.eligibilityPeriod.validTo):'Current'}`:'No dated eligibility recorded'}</span></div>}</div>}</section>
    <section id="staff-portal" className="staff-record-access"><span className="staff-portal-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-3.8 2.4-5.7 5.5-5.7s4.9 1.9 5.5 5.7M18 8v6M15 11h6"/></svg></span><div><h2>Staff portal</h2><p>{access?.state==='NO_ACCOUNT'?'Not set up':access?.state==='PENDING'?'Invitation pending':access?.state==='ACTIVE'?'Active':access?.state==='SUSPENDED'?'Suspended':access?.state==='REVOKED'?'Revoked':profile.access.status==='UNAVAILABLE'?'Unavailable':'Linked'}</p></div>{profile.access.status==='AVAILABLE'&&<StaffPortalManagement employeeId={id} access={access!}/>}</section>
   </div>
   <details className="staff-record-history"><summary>Recent activity</summary>{profile.history.length?<div className="staff-profile-list">{profile.history.map((item,index)=><div key={`${item.kind}-${item.occurredOn}-${index}`}><strong>{item.label}</strong><span className="muted small">{date(item.occurredOn)}</span></div>)}</div>:<p className="padded muted">No recorded People history.</p>}</details>
  </div>
 </PageStack></main></BrandSurface>;
}
