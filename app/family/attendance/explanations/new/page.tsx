import {notFound} from 'next/navigation';
import {FamilyPortalFrame} from '@/components/family-portal-frame';
import {AttendanceExplanationForm} from '@/components/attendance-explanation-form';
import {BrandSurface,PageHeader,PageStack} from '@/components/ui/primitives';
import {familyPageContext} from '@/lib/server/family-page';
import {guardiansGateway} from '@/lib/server/guardians';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function NewExplanation({searchParams}:{searchParams:Promise<{child?:string;session?:string}>}){const params=await searchParams;if(!params.child||!params.session)notFound();const {workspace,selected}=await familyPageContext(params.child);if(!selected.purposes.includes('attendance.explanation.submit'))notFound();const today=new Date().toISOString().slice(0,10),history=await guardiansGateway.attendance(await getIdentity(),selected.studentId,'2000-01-01',today),session=history.items.find(item=>item.sessionId===params.session&&item.status==='ABSENT'&&item.sessionState==='SUBMITTED');if(!session)notFound();const label=`${session.date} · ${session.subjectName} · ${session.sectionName}`;return <BrandSurface><FamilyPortalFrame workspace={workspace} selected={selected}><main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Attendance" title="Explain an absence" description="Send a bounded explanation to the school for review."/><AttendanceExplanationForm studentId={selected.studentId} studentName={selected.displayName} sessionId={session.sessionId} sessionLabel={label} returnTo={`/family/attendance?child=${selected.studentId}`}/></PageStack></main></FamilyPortalFrame></BrandSurface>}
