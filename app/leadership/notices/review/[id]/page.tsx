import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {NoticeProposalReviewFlow} from '@/components/notice-proposal-review-flow';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {leadershipGateway} from '@/lib/server/access';
import {communicationGateway} from '@/lib/server/communication';

export const dynamic='force-dynamic';

export default async function NoticeReviewPage({params}:{params:Promise<{id:string}>}){
  const identity=await getIdentity(),{id}=await params;
  const result=await (async()=>{
    try{
      const [home,initial]=await Promise.all([leadershipGateway.getHome(identity),communicationGateway.reviewProposalDetail(identity,id)]);
      return {ok:true as const,home,initial};
    }catch(error){
      if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
      return {ok:false as const};
    }
  })();
  if(!result.ok)return <main id="main-content" className="leadership-page"><Alert tone="danger" title="Notice review unavailable">The exact assignment and current REVIEW authority are rechecked.</Alert></main>;
  return <main id="main-content" className="leadership-page"><NoticeProposalReviewFlow initial={result.initial} schoolName={`${result.home.institutionName} · ${result.home.schoolName}`}/></main>;
}
