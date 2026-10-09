import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {PortalShell} from '@/components/portal/portal-shell';

const teachingGroups=[{label:'Teaching',items:[{label:'My teaching day',href:'/teacher/today',icon:'calendar' as const}]}] as const;

export function TeacherPortalFrame({home,children}:{home:AdminHome;children:ReactNode}){
 return <PortalShell home={home} groups={teachingGroups} homeHref="/teacher/today" navigationLabel="Teaching navigation" roleLabel="Teacher" contentClassName="teacher-portal-content">{children}</PortalShell>;
}
