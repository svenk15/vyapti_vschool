'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {PortalIcon,type PortalNavigationGroupData,type PortalNavigationItem} from './portal-navigation-group';
import {PortalShell} from './portal/portal-shell';
import {studentNavigationCatalogue as nav,studentNavigationRouteGroups as studentGroupRoutes,type WorkspaceNavigationItem} from './workspace-navigation';
import type {StudentPortalContext,StudentPortalWorkspace} from '@/shared/contracts/student-portal';
import type {ThemeId} from '@/shared/contracts/branding';

export function StudentPortalFrame({workspace,selected,children}:{workspace:StudentPortalWorkspace;selected:StudentPortalContext&Readonly<{theme:ThemeId}>;children:ReactNode}){
 const pathname=usePathname(),contextHref=(href:string,studentId=selected.studentId)=>`${href}?student=${encodeURIComponent(studentId)}`,initials=selected.displayName.split(/\s+/).map(value=>value[0]).join('').slice(0,2);
 const visibleNav=nav.filter(([,href])=>href!=='/student/timetable'||selected.purposes.includes('timetable.read_self')).filter(([,href])=>href!=='/student/calendar'||selected.purposes.includes('calendar.event.read_self')).filter(([,href])=>!['/student/classes','/student/assignments'].includes(href)||selected.purposes.includes('learning.assignment.read_self')).filter(([,href])=>href!=='/student/results'||selected.purposes.includes('results.read_self')).filter(([,href])=>href!=='/student/attendance'||selected.purposes.includes('attendance.read_self')).filter(([,href])=>href!=='/student/notices'||selected.purposes.includes('communication.notice.read_self'));
 const item=([label,href,icon]:WorkspaceNavigationItem):PortalNavigationItem=>({label,href:contextHref(href),icon,matches:[{path:href,exact:href==='/student'}]});
 const inGroup=(routes:Set<string>)=>visibleNav.filter(([,href])=>routes.has(href)).map(item);
 const groups:readonly PortalNavigationGroupData[]=[
  {id:'student-primary',label:'Student',showLabel:false,items:visibleNav.filter(([,href])=>href==='/student').map(item)},
  {id:'student-learning',label:'Learning',sectionBreakBefore:true,items:inGroup(studentGroupRoutes.learning)},
  {id:'student-school-life',label:'School life',sectionBreakBefore:true,items:inGroup(studentGroupRoutes.schoolLife)},
  {id:'student-personal',label:'Personal',sectionBreakBefore:true,items:inGroup(studentGroupRoutes.personal)},
 ];
 return <PortalShell groups={groups} homeHref={contextHref('/student')} navigationLabel="Student navigation" roleLabel="Student" accountDisplayName={workspace.displayName} accountHref={contextHref('/student/account')} stagedSignOut={false} theme={selected.theme} navigationId="student-navigation" openNavigationLabel="Open Student navigation" closeNavigationLabel="Close navigation" shellClassName="student-portal-shell" contentClassName="student-portal-content" academicYearLabel={selected.academicYear} sidebarContext={<div className="portal-school-identity"><strong>{selected.schoolName}</strong><span>{selected.schoolCode} · {selected.classLabel}</span></div>} bottomNavigation={({open,openNavigation})=><nav className="student-bottom-nav" aria-label="Quick navigation"><Link href={contextHref('/student')} aria-current={pathname==='/student'?'page':undefined}><PortalIcon name="home"/><span>My day</span></Link>{selected.purposes.includes('learning.assignment.read_self')&&<Link href={contextHref('/student/assignments')} aria-current={pathname.startsWith('/student/assignments')?'page':undefined}><PortalIcon name="academics"/><span>Work</span></Link>}{selected.purposes.includes('communication.notice.read_self')&&<Link href={contextHref('/student/notices')} aria-current={pathname.startsWith('/student/notices')?'page':undefined}><PortalIcon name="mail"/><span>Messages</span></Link>}<Link href={contextHref('/student/account')} aria-current={pathname.startsWith('/student/account')?'page':undefined}><PortalIcon name="account"/><span>Account</span></Link><button type="button" aria-expanded={open} aria-controls="student-navigation" onClick={event=>openNavigation(event.currentTarget)}><PortalIcon name="menu"/><span>More</span></button></nav>}>
  <div className="student-context-shell"><div className="student-context-ribbon"><div className="family-child-identity"><span className="portal-identity-avatar">{initials}</span><span><strong>{selected.displayName} · {selected.classLabel}</strong><small>{selected.schoolName} · {selected.institutionName}</small></span></div>{workspace.contexts.length>1?<label className="family-child-selector"><span className="sr-only">Switch school context</span><select aria-label="Switch school context" value={selected.studentId} onChange={event=>location.assign(contextHref(pathname,event.target.value))}>{workspace.contexts.map(context=><option key={context.accessId} value={context.studentId}>{context.schoolName} · {context.classLabel}</option>)}</select><span className="family-selector-icon"><PortalIcon name="down"/></span></label>:<span className="student-current-context">Current school</span>}</div></div>{children}
 </PortalShell>;
}
