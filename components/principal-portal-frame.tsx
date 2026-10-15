import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {PortalShell} from '@/components/portal/portal-shell';

const groups=[
 {label:'Leadership',items:[{label:'My school today',href:'/leadership',icon:'home' as const}]},
 {label:'Personal',items:[{label:'My account',href:'/leadership/account',icon:'account' as const}]},
] as const;

export function PrincipalPortalFrame({home,children}:{home:AdminHome;children:ReactNode}){
 return <PortalShell home={home} groups={groups} homeHref="/leadership" navigationLabel="Principal leadership" roleLabel="Principal" contextHref="/leadership/context" stagedSignOutHref="/leadership/context?destination=sign-out" contentClassName="leadership-portal-content">{children}</PortalShell>;
}
