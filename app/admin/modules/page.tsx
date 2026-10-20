import {redirect} from 'next/navigation';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {moduleGateway} from '@/lib/server/tenancy';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,BrandSurface,PageHeader,Card,PageStack} from '@/components/ui/primitives';
import {CapabilityInterestReviewFlow} from '@/components/capability-interest-review-flow';
import {AdminLocalNavigation} from "@/components/admin-local-navigation";
export const dynamic='force-dynamic';
export default async function ModuleConfigurationPage(){
 const identity=await getIdentity();let home:Awaited<ReturnType<typeof accountGateway.getHome>>;
 try{home=await accountGateway.getHome(identity);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');return <BrandSurface><main className="container page-space"><Alert tone="danger" title="Branch service unavailable">Refresh to try again.</Alert></main></BrandSurface>;}
 let context:Awaited<ReturnType<typeof moduleGateway.getCapabilityInterests>>|undefined,contextError:unknown;
 try{context=await moduleGateway.getCapabilityInterests(identity);}catch(error){contextError=error;}
 if(!context){const denied=contextError instanceof AccessError&&(contextError.code==='FORBIDDEN'||contextError.code==='NOT_FOUND');return <BrandSurface><main id="main-content" className="container page-space"><PageHeader title="Branch module access" description={home.schoolName}/><Card className="padded"><Alert tone={denied?'warning':'danger'} title={denied?'No module access':'Module service unavailable'}>{denied?'A current School administrator membership is required in this branch.':'Refresh to try again.'}</Alert></Card></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space context-workflow-page"><PageStack><PageHeader title="Review modules and request a capability" description={`${home.institutionName} · ${home.schoolName}`}/><AdminLocalNavigation label="Settings destinations" area="settings" current="/admin/modules"/><CapabilityInterestReviewFlow/></PageStack></main></BrandSurface>;
}
