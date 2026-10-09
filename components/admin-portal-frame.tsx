import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import type {PortalNavigationGroupData} from '@/components/portal-navigation-group';
import {PortalShell} from '@/components/portal/portal-shell';

export function AdminPortalFrame({home,groups,children}:{home:AdminHome;groups:readonly PortalNavigationGroupData[];children:ReactNode}){
 return <PortalShell home={home} groups={groups} homeHref="/admin" navigationLabel="School administration" roleLabel="School administrator">{children}</PortalShell>;
}
