'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {PortalIcon,type PortalNavigationGroupData,type PortalNavigationItem} from './portal-navigation-group';
import {PortalShell} from './portal/portal-shell';
import {familyNavigationCatalogue as nav,familyNavigationRouteGroups as familyGroupRoutes,type WorkspaceNavigationItem} from './workspace-navigation';
import type {GuardianChildSummary,GuardianWorkspace} from '@/shared/contracts/guardians';
import type {ThemeId} from '@/shared/contracts/branding';

export function FamilyPortalFrame({workspace,selected,children}:{workspace:GuardianWorkspace;selected:GuardianChildSummary&Readonly<{theme:ThemeId}>;children:ReactNode}){
 const pathname=usePathname(),childHref=(href:string,childId=selected.studentId)=>`${href}?child=${encodeURIComponent(childId)}`,initials=selected.displayName.split(/\s+/).map(value=>value[0]).join('').slice(0,2),hasNotices=selected.purposes.includes('communication.notice.read');
 const visibleNav=nav.filter(([,href])=>href!=='/family/notices'||selected.purposes.includes('communication.notice.read')).filter(([,href])=>href!=='/family/calendar'||selected.purposes.includes('calendar.event.read_child')).filter(([,href])=>href!=='/family/learning'||selected.purposes.includes('learning.assignment.read_child')).filter(([,href])=>href!=='/family/results'||selected.purposes.includes('results.read_child'));
 const item=([label,href,icon]:WorkspaceNavigationItem,includeChild=true):PortalNavigationItem=>({label,href:includeChild?childHref(href):href,icon,matches:[{path:href,exact:href==='/family'}]});
 const inGroup=(routes:Set<string>)=>visibleNav.filter(([,href])=>routes.has(href)).map(entry=>item(entry));
 const groups:readonly PortalNavigationGroupData[]=[
  {id:'family-primary',label:'Family',showLabel:false,items:visibleNav.filter(([,href])=>href==='/family'||href==='/family/children').map(entry=>item(entry))},
  {id:'family-learning',label:'Learning',sectionBreakBefore:true,items:inGroup(familyGroupRoutes.learning)},
  {id:'family-school-day',label:'School day',sectionBreakBefore:true,items:inGroup(familyGroupRoutes.schoolDay)},
  {id:'family-communication',label:'Communication',sectionBreakBefore:true,items:inGroup(familyGroupRoutes.communication)},
  {id:'family-account',label:'Account',sectionBreakBefore:true,items:visibleNav.filter(([,href])=>href==='/family/account').map(entry=>item(entry,false))},
 ];
 return <PortalShell groups={groups} homeHref={childHref('/family')} navigationLabel="Family navigation" roleLabel="Parent / guardian" accountDisplayName={workspace.accountDisplayName} accountHref="/family/account" stagedSignOut={false} theme={selected.theme} navigationId="family-navigation" openNavigationLabel="Open Parent navigation" closeNavigationLabel="Close navigation" shellClassName="family-portal-shell" contentClassName="family-portal-content" topContext={<span className="family-topbar-school">{selected.schoolName}</span>} sidebarContext={<div className="portal-school-identity"><strong>My family workspace</strong><span>Only your permitted children</span></div>} bottomNavigation={({open,openNavigation})=><nav className="family-bottom-nav" aria-label="Quick navigation"><Link href={childHref('/family')} aria-current={pathname==='/family'?'page':undefined}><PortalIcon name="home"/><span>Home</span></Link><Link href={childHref('/family/attendance')} aria-current={pathname.startsWith('/family/attendance')?'page':undefined}><PortalIcon name="attendance"/><span>Attendance</span></Link><Link href={childHref('/family/timetable')} aria-current={pathname.startsWith('/family/timetable')?'page':undefined}><PortalIcon name="calendar"/><span>Timetable</span></Link>{hasNotices&&<Link href={childHref('/family/notices')} aria-current={pathname.startsWith('/family/notices')?'page':undefined}><PortalIcon name="mail"/><span>Messages</span></Link>}<button type="button" aria-expanded={open} aria-controls="family-navigation" onClick={event=>openNavigation(event.currentTarget)}><PortalIcon name="menu"/><span>More</span></button></nav>}>
  <div className="family-child-context-shell"><div className="family-child-context"><div className="family-child-identity"><span className="portal-identity-avatar">{initials}</span><span><strong>{selected.displayName}</strong><small>{selected.classLabel??'Class unavailable'} · {selected.schoolName} · {selected.institutionName}</small></span></div><label className="family-child-selector"><span className="sr-only">Switch child</span><select aria-label="Switch child" value={selected.studentId} onChange={event=>location.assign(childHref(pathname,event.target.value))}>{workspace.children.map(child=><option key={child.studentId} value={child.studentId}>{workspace.children.length===1?'Current child':child.displayName}</option>)}</select><span className="family-selector-icon"><PortalIcon name="down"/></span></label></div></div>{children}
 </PortalShell>;
}
