import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {PortalShell} from '@/components/portal/portal-shell';

export function TeacherPortalFrame({home,canUseClasses=false,canUseTimetable=false,canUseHistory=false,children}:{home:AdminHome;canUseClasses?:boolean;canUseTimetable?:boolean;canUseHistory?:boolean;children:ReactNode}){
 const teachingGroups=[{label:'Teaching',items:[{label:'My teaching day',href:'/teacher/today',icon:'calendar' as const},...(canUseClasses?[{label:'My classes',href:'/teacher/classes',icon:'classes' as const}]:[]),...(canUseHistory?[{label:'Attendance history',href:'/teacher/history',icon:'attendance' as const}]:[]),...(canUseTimetable?[{label:'My timetable',href:'/teacher/timetable',icon:'classes' as const}]:[])]},{label:'Personal',items:[{label:'My account',href:'/account',icon:'account' as const}]}] as const;
 return <PortalShell home={home} groups={teachingGroups} homeHref="/teacher/today" navigationLabel="Teaching navigation" roleLabel="Teacher" contextHref="/account/context" stagedSignOutHref="/account/context?destination=sign-out" contentClassName="teacher-portal-content">{children}</PortalShell>;
}
