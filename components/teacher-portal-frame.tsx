import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {PortalShell} from '@/components/portal/portal-shell';

export function TeacherPortalFrame({home,canUseClasses=false,canUseTimetable=false,children}:{home:AdminHome;canUseClasses?:boolean;canUseTimetable?:boolean;children:ReactNode}){
 const teachingGroups=[{label:'Teaching',items:[{label:'My teaching day',href:'/teacher/today',icon:'calendar' as const},...(canUseClasses?[{label:'My classes',href:'/teacher/classes',icon:'classes' as const}]:[]),...(canUseTimetable?[{label:'My timetable',href:'/teacher/timetable',icon:'classes' as const}]:[])]}] as const;
 return <PortalShell home={home} groups={teachingGroups} homeHref="/teacher/today" navigationLabel="Teaching navigation" roleLabel="Teacher" contentClassName="teacher-portal-content">{children}</PortalShell>;
}
