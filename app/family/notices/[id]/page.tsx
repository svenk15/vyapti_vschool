import {BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {FamilyNotice} from '@/components/family-notice';
import {familyPageContext} from '@/lib/server/family-page';
import {getIdentity} from '@/lib/server/auth';
import {communicationGateway} from '@/lib/server/communication';
export const dynamic='force-dynamic';
export default async function NoticePage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{child?:string|string[]}>}){const query=await searchParams,{workspace,selected}=await familyPageContext(Array.isArray(query.child)?undefined:query.child),notice=await communicationGateway.detailParent(await getIdentity(),selected.studentId,(await params).id),backHref=`/family/notices?child=${encodeURIComponent(selected.studentId)}`;return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader title={notice.title} description={`${selected.schoolName} · ${new Date(notice.publishedAt).toLocaleDateString()} · Version ${notice.version}`}/><FamilyNotice notice={notice} studentId={selected.studentId} backHref={backHref}/></PageStack></main></FamilyPortalFrame></BrandSurface>}
