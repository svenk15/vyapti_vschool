import type {ReactNode} from 'react';
import {PortalShell} from '@/components/portal/portal-shell';
import {principalNavigationGroups,type PrincipalNavigationOptions} from '@/components/principal-navigation';

type PrincipalPortalFrameProps=PrincipalNavigationOptions&{
 preferences?:{density:'COMFORTABLE'|'COMPACT';reducedMotion:'SYSTEM'|'REDUCE'};
 children:ReactNode;
};

export function PrincipalPortalFrame(props:PrincipalPortalFrameProps){
 const {home,preferences,children}=props,groups=principalNavigationGroups(props),roleLabel=home.actingDelegation?'Acting Principal':'Principal';
 return <PortalShell home={home} groups={groups} homeHref="/leadership" navigationLabel="Principal leadership" roleLabel={roleLabel} accountHref="/leadership/account" contextHref="/leadership/context" stagedSignOutHref="/leadership/context?destination=sign-out" contentClassName="leadership-portal-content" preferences={preferences}>{children}</PortalShell>;
}
