import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {EventPublishFlow} from '@/components/event-publish-flow';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
export const dynamic='force-dynamic';
export default async function NewEvent(){const identity=await getIdentity();let data:{sections:{id:string;name:string;gradeName:string}[];schoolName:string;timezone:string}|undefined;try{const [home,workspace]=await Promise.all([accountGateway.getHome(identity),academicsGateway.workspace(identity)]);data={sections:workspace.sections.filter(item=>item.active).map(item=>({id:item.id,name:item.name,gradeName:item.gradeName})),schoolName:`${home.institutionName} · ${home.schoolName}`,timezone:home.timezone};}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');}return <main id="main-content" className="container page-space">{data?<EventPublishFlow {...data}/>:<Alert tone="danger" title="Event composition unavailable">Current academic structure and publisher authority are required.</Alert>}</main>}
