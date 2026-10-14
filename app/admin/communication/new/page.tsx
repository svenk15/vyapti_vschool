import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert} from '@/components/ui/primitives';
import {NoticePublishFlow} from '@/components/notice-publish-flow';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
export const dynamic='force-dynamic';
export default async function NewNotice(){const identity=await getIdentity();try{const [home,workspace]=await Promise.all([accountGateway.getHome(identity),academicsGateway.workspace(identity)]);const sections=workspace.sections.filter(item=>item.active).map(item=>({id:item.id,name:item.name,gradeName:workspace.grades.find(grade=>grade.id===item.gradeId)?.name??'Class'}));return <main id="main-content" className="container page-space"><NoticePublishFlow sections={sections} schoolName={`${home.institutionName} · ${home.schoolName}`}/></main>;}catch(error){if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');return <main id="main-content" className="container page-space"><Alert tone="danger" title="Notice composition unavailable">Current academic structure and communication authority are required.</Alert></main>;}}
