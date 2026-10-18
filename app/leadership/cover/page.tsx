import {redirect} from 'next/navigation';
import {PrincipalTimetableNavigation} from '@/components/principal-area-navigation';
import {TimetableCoverInboxView} from '@/components/timetable-cover-workspace';
import {PageHeader,PageStack} from '@/components/ui/primitives';
import {academicsGateway} from '@/lib/server/academics';
import {getIdentity} from '@/lib/server/auth';
import {principalNavigationGateway} from '@/lib/server/principal-navigation';

export const dynamic='force-dynamic';

export default async function Page(){
 const identity=await getIdentity();if(!identity)redirect('/sign-in');
 const [data,navigation]=await Promise.all([academicsGateway.timetableCoverInbox(identity),principalNavigationGateway.timetable(identity)]);
 return <main id="main-content" className="container page-space"><PrincipalTimetableNavigation current="cover" availability={navigation}/><PageStack><PageHeader eyebrow="Staffing decisions" title="Cover requests" description="Approve only requests within your current delegated authority."/><TimetableCoverInboxView data={data} baseHref="/leadership/cover"/></PageStack></main>;
}
