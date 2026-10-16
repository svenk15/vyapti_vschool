import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {PortalShell} from '@/components/portal/portal-shell';

export function PrincipalPortalFrame({home,canUseAttendance=false,canUseTimetable=false,children}:{home:AdminHome;canUseAttendance?:boolean;canUseTimetable?:boolean;children:ReactNode}){
 const groups=[
  {label:'Leadership',items:[{label:'My school today',href:'/leadership',icon:'home' as const},...(canUseAttendance?[{label:'Attendance oversight',href:'/leadership/attendance',icon:'attendance' as const}]:[]),...(canUseTimetable?[{label:'Timetable exceptions',href:'/leadership/timetable',icon:'calendar' as const}]:[])]},
  {label:'Personal',items:[{label:'My account',href:'/leadership/account',icon:'account' as const}]},
 ] as const;
 return <PortalShell home={home} groups={groups} homeHref="/leadership" navigationLabel="Principal leadership" roleLabel="Principal" contextHref="/leadership/context" stagedSignOutHref="/leadership/context?destination=sign-out" contentClassName="leadership-portal-content">{children}</PortalShell>;
}
