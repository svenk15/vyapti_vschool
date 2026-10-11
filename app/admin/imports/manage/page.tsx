import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,BrandSurface,PageHeader} from '@/components/ui/primitives';
import {ImportPreviewWorkspace} from '@/components/import-preview-workspace';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {importsGateway} from '@/lib/server/imports';
export const dynamic='force-dynamic';
export default async function ImportManagementPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const identity=await getIdentity(),params=await searchParams,jobId=typeof params.jobId==='string'&&/^[0-9a-f-]{36}$/i.test(params.jobId)?params.jobId:null;let home,options;try{home=await accountGateway.getHome(identity);options=await importsGateway.options(identity);}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');const title=error instanceof AccessError&&error.code==='FORBIDDEN'?'Roster import permission required':'Roster import is temporarily unavailable';return <BrandSurface><main className="container page-space"><PageHeader title="Roster import"/><Alert tone="danger" title={title}>Current permission, branch scope and required modules are checked on the server.</Alert></main></BrandSurface>;}
 return <BrandSurface><main id="main-content" className="container page-space"><ImportPreviewWorkspace options={options} home={home} initialJobId={jobId}/></main></BrandSurface>;}
