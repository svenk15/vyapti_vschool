import {redirect} from 'next/navigation';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {moduleGateway} from '@/lib/server/tenancy';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,BrandSurface,PageHeader,Card} from '@/components/ui/primitives';
import {TenancyModuleConfiguration} from '@/components/tenancy-module-configuration';
import {CapabilityInterestWorkspace} from '@/components/capability-interest-workspace';
export const dynamic='force-dynamic';
export default async function ModuleConfigurationPage(){
 const identity=await getIdentity();let home:Awaited<ReturnType<typeof accountGateway.getHome>>;
 try{home=await accountGateway.getHome(identity);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');return <BrandSurface><main className="container page-space"><Alert tone="danger" title="Branch service unavailable">Refresh to try again.</Alert></main></BrandSurface>;}
 let context:Awaited<ReturnType<typeof moduleGateway.getCapabilityInterests>>|undefined,contextError:unknown;
 try{context=await moduleGateway.getCapabilityInterests(identity);}catch(error){contextError=error;}
 if(!context){const denied=contextError instanceof AccessError&&(contextError.code==='FORBIDDEN'||contextError.code==='NOT_FOUND');return <BrandSurface><main id="main-content" className="container page-space"><PageHeader title="Branch module access" description={home.schoolName}/><Card className="padded"><Alert tone={denied?'warning':'danger'} title={denied?'No module access':'Module service unavailable'}>{denied?'A current School administrator membership is required in this branch.':'Refresh to try again.'}</Alert></Card></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow={home.institutionName} title="Branch module access" description={`Review status and express capability interest for ${home.schoolName}.`}/><CapabilityInterestWorkspace initial={context}/>{context.canConfigure?<TenancyModuleConfiguration initial={context.configuration}/>:<Card className="padded"><Alert tone="info" title="Activation is institution-managed">Your submission records non-binding interest for institution review. It does not purchase, activate or change access to a module.</Alert></Card>}</main></BrandSurface>;
}
