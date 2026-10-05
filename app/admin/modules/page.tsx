import {redirect} from 'next/navigation';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {moduleGateway} from '@/lib/server/tenancy';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,BrandSurface,PageHeader,Card} from '@/components/ui/primitives';
import {TenancyModuleConfiguration} from '@/components/tenancy-module-configuration';
export const dynamic='force-dynamic';
export default async function ModuleConfigurationPage(){
 const identity=await getIdentity();let home:Awaited<ReturnType<typeof accountGateway.getHome>>;
 try{home=await accountGateway.getHome(identity);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');return <BrandSurface><main className="container page-space"><Alert tone="danger" title="Branch service unavailable">Refresh to try again.</Alert></main></BrandSurface>;}
 let configuration:Awaited<ReturnType<typeof moduleGateway.getCurrent>>|undefined,configurationError:unknown;
 try{configuration=await moduleGateway.getCurrent(identity);}catch(e){configurationError=e;}
 if(!configuration){const denied=configurationError instanceof AccessError&&(configurationError.code==='FORBIDDEN'||configurationError.code==='NOT_FOUND');return <BrandSurface><main className="container page-space"><PageHeader title="Branch module access" description={home.schoolName}/><Card className="padded"><Alert tone={denied?'warning':'danger'} title={denied?'No configuration access':'Configuration service unavailable'}>{denied?'Module configuration requires institution administrator authority and an active school administrator membership in this branch.':'Refresh to try again.'}</Alert></Card></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space"><PageHeader eyebrow={home.institutionName} title="Branch module access" description={`Review contracts and released capabilities for ${home.schoolName}.`}/><TenancyModuleConfiguration initial={configuration}/></main></BrandSurface>;
}
