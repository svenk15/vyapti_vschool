import {redirect} from 'next/navigation';
import {Alert,PageHeader} from '@/components/ui/primitives';
import {WorkspaceExitFlow} from '@/components/workspace-exit-flow';
import {leadershipGateway,contextGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';

export const dynamic='force-dynamic';

export default async function LeadershipContext({searchParams}:{searchParams:Promise<{destination?:string|string[]}>}){
 const identity=await getIdentity(),query=await searchParams;
 if(!identity)redirect('/sign-in');
 const [home,directory]=await Promise.all([leadershipGateway.getHome(identity).catch(()=>null),contextGateway.getContexts(identity).catch(()=>null)]);
 if(!home||!directory)return <main id="main-content" className="container page-space"><PageHeader title="Switch branch or sign out"/><Alert tone="danger" title="Destinations unavailable">Your current branch remains active. Refresh and try again.</Alert></main>;
 return <main id="main-content" className="container page-space context-workflow-page"><PageHeader title="Switch branch or sign out" description={`${home.institutionName} · ${home.schoolName}`}/><WorkspaceExitFlow home={home} directory={directory} initialDestination={typeof query.destination==='string'?query.destination:''} returnHref="/leadership"/></main>;
}
