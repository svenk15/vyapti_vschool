import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {ActivityReviewFlow} from '@/components/activity-review-flow';
import {Alert,BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {activityGateway} from '@/lib/server/activity';
import {activityCategories,type ActivityCategory,type ActivityPage} from '@/shared/contracts/activity';

import {AdminLocalNavigation} from "@/components/admin-local-navigation";
export const dynamic='force-dynamic';
type Stage='find'|'inspect'|'confirm'|'receipt';
type Action=''|'VIEW'|'COPY';
const first=(value:string|string[]|undefined)=>Array.isArray(value)?undefined:value;
function localToday(timezone:string){return new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}

export default async function ActivityPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const identity=await getIdentity(),params=await searchParams;
 let home,error:unknown;
 try{home=await accountGateway.getHome(identity);}catch(cause){error=cause;}
 if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
 if(!home){return <BrandSurface><main className="container page-space"><PageHeader title="Review activity, privacy or support access"/><Alert tone="danger" title="Activity unavailable">Current permission and branch scope are checked on the server.</Alert></main></BrandSurface>;}
 const today=localToday(home.timezone),fallback=new Date(`${today}T00:00:00Z`);fallback.setUTCDate(fallback.getUTCDate()-29);
 const categoryRaw=first(params.category),category=activityCategories.includes(categoryRaw as ActivityCategory)?categoryRaw as ActivityCategory:'STUDENT_CHANGE',from=first(params.from)??fallback.toISOString().slice(0,10),to=first(params.to)??today,stageRaw=first(params.stage),stage=(['find','inspect','confirm','receipt'].includes(stageRaw??'')?stageRaw:'find') as Stage,actionRaw=first(params.action),action=(actionRaw==='VIEW'||actionRaw==='COPY'?actionRaw:'') as Action;
 let visibleStage=stage,page:ActivityPage|null=null,failure:string|null=null;
 try{page=await activityGateway.list(identity,{category,from,to,cursor:null});if((stage==='confirm'||stage==='receipt')&&!action){visibleStage='inspect';failure='Choose an action before continuing.';}}catch(cause){visibleStage='find';failure=cause instanceof AccessError&&cause.code==='FORBIDDEN'?'Your current branch role does not allow activity review.':cause instanceof AccessError&&cause.code==='VALIDATION'?'Choose valid dates in chronological order covering no more than 93 days.':'Activity is temporarily unavailable. Retry with the same filters.';}
 return <BrandSurface><main id="main-content" className="container page-space context-workflow-page"><PageStack><PageHeader title="Review activity, privacy or support access" description={`${home.institutionName} · ${home.schoolName}`}/><AdminLocalNavigation label="Settings destinations" area="settings" current="/admin/activity"/><ActivityReviewFlow stage={visibleStage} filters={{category,from,to}} action={action} page={page} error={failure}/></PageStack></main></BrandSurface>;
}
