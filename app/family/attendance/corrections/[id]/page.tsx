import Link from 'next/link';
import {AttendanceCorrectionRequestStatus} from '@/components/attendance-correction-request';
import {BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {attendanceCorrectionRequestsGateway as gateway} from '@/lib/server/attendance-correction-requests';
import {familyPageContext} from '@/lib/server/family-page';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{child?:string}>}){const {id}=await params,{child}=await searchParams,{workspace,selected}=await familyPageContext(child),item=await gateway.getOwn(await getIdentity(),'GUARDIAN',id,selected.studentId);return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader title="Correction request status" description="The current status is reauthorized on every view."/><AttendanceCorrectionRequestStatus item={item}/><Link href={`/family/attendance?child=${selected.studentId}`}>← Back to attendance</Link></PageStack></main></FamilyPortalFrame></BrandSurface>}
