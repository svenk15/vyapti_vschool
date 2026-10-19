import Link from 'next/link';
import {notFound} from 'next/navigation';
import {AttendanceCorrectionRequestForm} from '@/components/attendance-correction-request';
import {PageHeader,PageStack} from '@/components/ui/primitives';
import {attendanceGateway} from '@/lib/server/attendance';
import {getIdentity} from '@/lib/server/auth';

export const dynamic='force-dynamic';

export default async function TeacherCorrectionRequest({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const query=await searchParams,studentId=typeof query.student==='string'?query.student:'',sessionId=typeof query.session==='string'?query.session:'';
 if(!studentId||!sessionId)notFound();
 let session;
 try{session=await attendanceGateway.detail(await getIdentity(),sessionId);}catch{notFound();}
 const record=session.records?.find(item=>item.studentId===studentId),student=session.roster?.find(item=>item.studentId===studentId),sourceRevision=session.recordRevisions?.[studentId];
 if(session.status!=='SUBMITTED'||!record||!student||!sourceRevision)notFound();
 return <main id="main-content" className="container page-space"><PageStack><PageHeader eyebrow="Submitted register" title="Flag an attendance error" description="This request is tied to the exact pupil, session and source revision."/><AttendanceCorrectionRequestForm kind="TEACHER" studentId={studentId} sessionId={session.id} sourceRevision={sourceRevision} currentStatus={record.status} currentLateMinutes={record.lateMinutes??null} sourceLabel={`${student.displayName} · ${session.schoolDate} · ${session.offering.subjectName}`}/><Link href={`/teacher/sessions/${session.id}`}>← Back to submitted register</Link></PageStack></main>;
}
