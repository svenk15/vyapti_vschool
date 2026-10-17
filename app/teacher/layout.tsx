import type {ReactNode} from 'react';
import {BrandSurface} from '@/components/ui/primitives';
import {TeacherPortalFrame} from '@/components/teacher-portal-frame';
import {getIdentity} from '@/lib/server/auth';
import {brandingGateway} from '@/lib/server/branding';
import {accountGateway} from '@/lib/server/access';
import {moduleGateway} from '@/lib/server/tenancy';
import {academicsGateway} from '@/lib/server/academics';
import {attendanceGateway} from '@/lib/server/attendance';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';
import {learningGateway} from '@/lib/server/learning';
import {assessmentsGateway} from '@/lib/server/assessments';
import {eventsGateway} from '@/lib/server/events';
export const dynamic='force-dynamic';

export default async function TeacherLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)return children;
 const home=await accountGateway.getHome(identity).catch(()=>null);
 if(!home)return children;
 const [palette,canUseTimetable,canUseCover,canUseClasses,canUseHistory,canUseLearning,canUseAssessments,canUseMeetings]=await Promise.all([brandingGateway.effectivePalette(identity).catch(()=>null),home.capabilities.includes('timetable.read')?moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'timetable','timetable.read').catch(()=>false):false,academicsGateway.timetableCoverInbox(identity).then(()=>true).catch(()=>false),home.capabilities.includes('class.read')&&home.capabilities.includes('student.read')?academicsGateway.teacherClasses(identity,schoolDate(new Date(),home.timezone)).then(()=>true).catch(()=>false):false,home.capabilities.includes('attendance.read_class')?attendanceGateway.teacherHistory(identity,{}).then(()=>true).catch(()=>false):false,home.capabilities.includes('learning.assignment.write')?learningGateway.teacherWorkspace(identity).then(()=>true).catch(()=>false):false,assessmentsGateway.markWorkspace(identity).then(()=>true).catch(()=>false),eventsGateway.meetings.list(identity).then(()=>true).catch(()=>false)]);
 return <BrandSurface palette={palette??undefined}><TeacherPortalFrame home={home} canUseClasses={canUseClasses} canUseTimetable={canUseTimetable} canUseCover={canUseCover} canUseMeetings={canUseMeetings} canUseHistory={canUseHistory} canUseLearning={canUseLearning} canUseAssessments={canUseAssessments}>{children}</TeacherPortalFrame></BrandSurface>;
}
