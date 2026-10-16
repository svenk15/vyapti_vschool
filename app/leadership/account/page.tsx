import {redirect} from 'next/navigation';
import {Card,PageHeader,PageStack} from '@/components/ui/primitives';
import {StudentSessionManager} from '@/components/student-session-manager';
import {leadershipGateway,sessionGateway} from '@/lib/server/access';
import {getSessionPrincipal} from '@/lib/server/auth';

export const dynamic='force-dynamic';

export default async function LeadershipAccount(){
 const principal=await getSessionPrincipal();if(!principal)redirect('/sign-in');
 const [home,sessions]=await Promise.all([leadershipGateway.getHome(principal.identity).catch(()=>null),sessionGateway.list(principal.identity,principal.sessionId)]);
 if(!home)redirect('/choose-workspace');
 return <main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Principal workspace" title="My account" description={`${home.institutionName} · ${home.schoolName}`}/><Card className="padded student-sessions-card"><StudentSessionManager initial={sessions} returnHref="/leadership"/></Card></PageStack></main>;
}
