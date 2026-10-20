import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import type {PortalNavigationGroupData} from '@/components/portal-navigation-group';
import {PortalShell} from '@/components/portal/portal-shell';

export function AdminPortalFrame({home,groups,academicYearLabel,accountDisplayName,children}:{home:AdminHome;groups:readonly PortalNavigationGroupData[];academicYearLabel?:string|null;accountDisplayName?:string|null;children:ReactNode}){
 const utilityGroups=groups.filter(group=>group.id==='admin-utility'),navigationGroups=groups.filter(group=>group.id!=='admin-utility');
 return <PortalShell home={home} groups={navigationGroups} utilityGroups={utilityGroups} homeHref="/admin" navigationLabel="School administration" roleLabel="School administrator" academicYearLabel={academicYearLabel} accountDisplayName={accountDisplayName} shellClassName="administrator-portal-shell">{children}</PortalShell>;
}
