import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {WorkspaceExitFlow} from '@/components/workspace-exit-flow';
import {Alert,PageHeader} from '@/components/ui/primitives';
import {accountGateway,contextGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';

export const dynamic='force-dynamic';

export default async function ContextPage({searchParams}:{searchParams:Promise<{destination?:string|string[]}>}){
 const identity=await getIdentity(),query=await searchParams;
 let home:Awaited<ReturnType<typeof accountGateway.getHome>>|null=null,directory:Awaited<ReturnType<typeof contextGateway.getContexts>>|null=null,error:unknown;
 try{
  [home,directory]=await Promise.all([accountGateway.getHome(identity),contextGateway.getContexts(identity)]);
 }catch(cause){error=cause;}
 if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
 if(!home||!directory)return <main id="main-content" className="container page-space"><PageHeader title="Switch branch or sign out"/><Alert tone="danger" title="Destinations unavailable">Your current branch remains active. Refresh and try again.</Alert></main>;
 const destination=typeof query.destination==='string'?query.destination:'';
 return <main id="main-content" className="container page-space context-workflow-page"><PageHeader title="Switch branch or sign out" description={`${home.institutionName} · ${home.schoolName}`}/><WorkspaceExitFlow home={home} directory={directory} initialDestination={destination}/></main>;
}
