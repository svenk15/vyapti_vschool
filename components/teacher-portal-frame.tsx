import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {PortalShell} from '@/components/portal/portal-shell';
import {teacherNavigationGroups} from '@/components/workspace-navigation';

export function TeacherPortalFrame({home,canUseClasses=false,canUseTimetable=false,canUseCover=false,canUseMeetings=false,canUseSupport=false,canUseHistory=false,canUseLearning=false,canUseAssessments=false,children}:{home:AdminHome;canUseClasses?:boolean;canUseTimetable?:boolean;canUseCover?:boolean;canUseMeetings?:boolean;canUseSupport?:boolean;canUseHistory?:boolean;canUseLearning?:boolean;canUseAssessments?:boolean;children:ReactNode}){
 const teachingGroups=teacherNavigationGroups({canUseClasses,canUseTimetable,canUseCover,canUseMeetings,canUseSupport,canUseHistory,canUseLearning,canUseAssessments});
 return <PortalShell home={home} groups={teachingGroups} homeHref="/teacher/today" navigationLabel="Teaching navigation" roleLabel="Teacher" contextHref="/account/context" stagedSignOutHref="/account/context?destination=sign-out" contentClassName="teacher-portal-content">{children}</PortalShell>;
}
