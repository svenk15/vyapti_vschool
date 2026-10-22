import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import type {PortalNavigationGroupData} from '@/components/portal-navigation-group';
import {PortalShell} from '@/components/portal/portal-shell';
import {AdminNavigationProvider,type AdminNavigationDestination} from '@/components/admin-navigation-context';

export function AdminPortalFrame({home,groups,destinations,academicYearLabel,accountDisplayName,children}:{home:AdminHome;groups:readonly PortalNavigationGroupData[];destinations:readonly AdminNavigationDestination[];academicYearLabel?:string|null;accountDisplayName?:string|null;children:ReactNode}){
 const utilityGroups=groups.filter(group=>group.id==='admin-utility'),navigationGroups=groups.filter(group=>group.id!=='admin-utility');
 return <AdminNavigationProvider destinations={destinations}><PortalShell home={home} groups={navigationGroups} utilityGroups={utilityGroups} homeHref="/admin" navigationLabel="School administration" roleLabel="School administrator" academicYearLabel={academicYearLabel} accountDisplayName={accountDisplayName} shellClassName="administrator-portal-shell">{children}</PortalShell></AdminNavigationProvider>;
}
