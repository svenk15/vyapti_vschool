import {BrandSurface,ButtonLink,PageHeader,PageStack} from '@/components/ui/primitives';
import {StudentPortalFrame} from '@/components/student-portal-frame';
import {StudentNotice} from '@/components/student-notice';
import {studentPageContext} from '@/lib/server/student-page';
import {getIdentity} from '@/lib/server/auth';
import {communicationGateway} from '@/lib/server/communication';
export const dynamic='force-dynamic';
export default async function StudentNoticePage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{student?:string|string[]}>}){const query=await searchParams,{workspace,selected}=await studentPageContext(Array.isArray(query.student)?undefined:query.student,'communication.notice.read_self'),notice=await communicationGateway.detailStudent(await getIdentity(),selected.studentId,(await params).id),backHref=`/student/notices?student=${encodeURIComponent(selected.studentId)}`;return <BrandSurface><StudentPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader title={notice.title} description={`School office · ${new Date(notice.publishedAt).toLocaleDateString()}`} actions={<ButtonLink variant="secondary" href={backHref}>← Messages</ButtonLink>}/><StudentNotice notice={notice} studentId={selected.studentId}/></PageStack></main></StudentPortalFrame></BrandSurface>}
