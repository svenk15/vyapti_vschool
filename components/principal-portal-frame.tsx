import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {PortalShell} from '@/components/portal/portal-shell';

export function PrincipalPortalFrame({home,canUseAttendance=false,canUseTimetable=false,canUseLearning=false,canUseCommunication=false,canUseReports=false,children}:{home:AdminHome;canUseAttendance?:boolean;canUseTimetable?:boolean;canUseLearning?:boolean;canUseCommunication?:boolean;canUseReports?:boolean;children:ReactNode}){
 const groups=[
  {label:'Leadership',items:[{label:'My school today',href:'/leadership',icon:'home' as const},...(canUseAttendance?[{label:'Attendance oversight',href:'/leadership/attendance',icon:'attendance' as const}]:[]),...(canUseTimetable?[{label:'Timetable exceptions',href:'/leadership/timetable',icon:'calendar' as const}]:[]),...(canUseLearning?[{label:'Assignment completion',href:'/leadership/learning',icon:'academics' as const},{label:'Feedback turnaround',href:'/leadership/learning/feedback',icon:'report' as const}]:[]),...(canUseCommunication?[{label:'Notice coverage',href:'/leadership/communication',icon:'mail' as const}]:[]),...(canUseReports?[{label:'Reports',href:'/leadership/reports',icon:'report' as const}]:[])]},
  {label:'Personal',items:[{label:'My account',href:'/leadership/account',icon:'account' as const}]},
 ] as const;
 return <PortalShell home={home} groups={groups} homeHref="/leadership" navigationLabel="Principal leadership" roleLabel="Principal" contextHref="/leadership/context" stagedSignOutHref="/leadership/context?destination=sign-out" contentClassName="leadership-portal-content">{children}</PortalShell>;
}
