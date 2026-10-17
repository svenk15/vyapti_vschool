import {redirect} from 'next/navigation';
import {Alert,Card,PageHeader,PageStack} from '@/components/ui/primitives';
import {StudentSessionManager} from '@/components/student-session-manager';
import {PrincipalAccountPreferences} from '@/components/principal-account-preferences';
import {leadershipGateway,preferenceGateway,sessionGateway} from '@/lib/server/access';
import {getSessionPrincipal} from '@/lib/server/auth';

export const dynamic='force-dynamic';

export default async function LeadershipAccount(){
 const principal=await getSessionPrincipal();if(!principal)redirect('/sign-in');
 const home=await leadershipGateway.getHome(principal.identity).catch(()=>null);
 if(!home)redirect('/choose-workspace');
 const [sessions,preferences,support]=await Promise.all([sessionGateway.list(principal.identity,principal.sessionId),preferenceGateway.get(principal.identity),preferenceGateway.getSupport(principal.identity,home.scope.organizationId,home.scope.schoolId)]);
 return <main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Principal workspace" title="My account" description={`${home.institutionName} · ${home.schoolName}`}/><div className="principal-account-grid"><Card className="padded student-sessions-card"><StudentSessionManager initial={sessions} returnHref="/leadership"/></Card><Card className="padded"><PrincipalAccountPreferences initial={preferences}/></Card><Card className="padded principal-support-card"><h2>School support</h2>{support?<><p className="muted">Published by your school for this branch.</p><dl className="record-facts"><div><dt>Contact</dt><dd>{support.label}</dd></div>{support.email&&<div><dt>Email</dt><dd><a href={`mailto:${support.email}`}>{support.email}</a></dd></div>}{support.phone&&<div><dt>Phone</dt><dd>{support.phone}</dd></div>}<div><dt>Hours</dt><dd>{support.hours}</dd></div><div><dt>Timezone</dt><dd>{support.timezone}</dd></div></dl><p className="small muted">This route does not promise continuous monitoring.</p></>:<><Alert tone="warning" title="School support is not configured">Ask your school office for its approved support route. VSchool does not substitute an unverified contact.</Alert></>}</Card></div></PageStack></main>;
}
