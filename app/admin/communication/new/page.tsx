import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert} from '@/components/ui/primitives';
import {NoticePublishFlow} from '@/components/notice-publish-flow';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
export const dynamic='force-dynamic';
export default async function NewNotice(){const identity=await getIdentity();let data:{sections:{id:string;name:string;gradeName:string}[];schoolName:string}|undefined;try{const [home,workspace]=await Promise.all([accountGateway.getHome(identity),academicsGateway.workspace(identity)]);data={sections:workspace.sections.filter(item=>item.active).map(item=>({id:item.id,name:item.name,gradeName:workspace.grades.find(grade=>grade.id===item.gradeId)?.name??'Class'})),schoolName:`${home.institutionName} · ${home.schoolName}`};}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');}if(!data)return <main id="main-content" className="container page-space"><Alert tone="danger" title="Notice composition unavailable">Current academic structure and communication authority are required.</Alert></main>;return <main id="main-content" className="container page-space"><NoticePublishFlow sections={data.sections} schoolName={data.schoolName}/></main>;}
