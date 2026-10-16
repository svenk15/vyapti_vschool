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
export const dynamic='force-dynamic';

export default async function TeacherLayout({children}:{children:ReactNode}){
 const identity=await getIdentity();
 if(!identity)return children;
 const home=await accountGateway.getHome(identity).catch(()=>null);
 if(!home)return children;
 const [palette,canUseTimetable,canUseClasses,canUseHistory,canUseLearning]=await Promise.all([brandingGateway.effectivePalette(identity).catch(()=>null),home.capabilities.includes('timetable.read')?moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'timetable','timetable.read').catch(()=>false):false,home.capabilities.includes('class.read')&&home.capabilities.includes('student.read')?academicsGateway.teacherClasses(identity,schoolDate(new Date(),home.timezone)).then(()=>true).catch(()=>false):false,home.capabilities.includes('attendance.read_class')?attendanceGateway.teacherHistory(identity,{}).then(()=>true).catch(()=>false):false,home.capabilities.includes('learning.assignment.write')?learningGateway.teacherWorkspace(identity).then(()=>true).catch(()=>false):false]);
 return <BrandSurface palette={palette??undefined}><TeacherPortalFrame home={home} canUseClasses={canUseClasses} canUseTimetable={canUseTimetable} canUseHistory={canUseHistory} canUseLearning={canUseLearning}>{children}</TeacherPortalFrame></BrandSurface>;
}
