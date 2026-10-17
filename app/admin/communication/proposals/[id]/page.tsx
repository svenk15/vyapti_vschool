import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {NoticeProposalAuthorFlow} from '@/components/notice-proposal-author-flow';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {communicationGateway} from '@/lib/server/communication';

export const dynamic='force-dynamic';

export default async function ProposalPage({params}:{params:Promise<{id:string}>}){
  const identity=await getIdentity(),{id}=await params;
  const result=await (async()=>{
    try{
      const [home,workspace,initial]=await Promise.all([
        accountGateway.getHome(identity),
        academicsGateway.workspace(identity),
        communicationGateway.authorProposalDetail(identity,id),
      ]);
      return {ok:true as const,home,workspace,initial};
    }catch(error){
      if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
      return {ok:false as const};
    }
  })();
  if(!result.ok)return <main id="main-content" className="container page-space"><Alert tone="danger" title="Notice proposal unavailable">Your current branch, AUTHOR designation and proposal ownership are rechecked.</Alert></main>;
  const sections=result.workspace.sections.filter(item=>item.active).map(item=>({id:item.id,name:item.name,gradeName:result.workspace.grades.find(grade=>grade.id===item.gradeId)?.name??'Class'}));
  return <main id="main-content" className="container page-space"><NoticeProposalAuthorFlow sections={sections} schoolName={`${result.home.institutionName} · ${result.home.schoolName}`} initial={result.initial}/></main>;
}
