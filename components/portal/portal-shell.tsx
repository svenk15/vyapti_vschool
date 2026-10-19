'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {AccessSignOut} from '@/components/access-login';
import {BranchSwitcher} from '@/components/institution-context';
import {PortalIcon,PortalNavigationGroup,portalItemMatchSpecificity,type PortalNavigationGroupData} from '@/components/portal-navigation-group';

type PortalShellProps={
 home?:AdminHome;
 groups:readonly PortalNavigationGroupData[];
 homeHref:string;
 navigationLabel:string;
 roleLabel:string;
 academicYearLabel?:string|null;
 accountDisplayName?:string|null;
 accountHref?:string;
 contextHref?:string;
 stagedSignOut?:boolean;
 stagedSignOutHref?:string;
 children:ReactNode;
 shellClassName?:string;
 contentClassName?:string;
 preferences?:{density:'COMFORTABLE'|'COMPACT';reducedMotion:'SYSTEM'|'REDUCE'};
 theme?:string;
 navigationId?:string;
 sidebarContext?:ReactNode;
 topContext?:ReactNode;
 openNavigationLabel?:string;
 closeNavigationLabel?:string;
 bottomNavigation?:(controls:{open:boolean;openNavigation:(openerId:string)=>void})=>ReactNode;
};

const focusableSelector='a[href],button:not([disabled]),select:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function PortalShell({home,groups,homeHref,navigationLabel,roleLabel,academicYearLabel,accountDisplayName,accountHref='/account',contextHref='/admin/context',stagedSignOut=true,stagedSignOutHref='/admin/context?destination=sign-out',children,shellClassName,contentClassName,preferences,theme,navigationId='portal-navigation',sidebarContext,topContext,openNavigationLabel='Open navigation',closeNavigationLabel='Close menu panel',bottomNavigation}:PortalShellProps){
 const pathname=usePathname(),entries=groups.flatMap((group,index)=>group.items.map(item=>({group,groupKey:group.id??`${index}-${group.label}`,item,specificity:portalItemMatchSpecificity(pathname,item)}))),currentEntry=entries.filter(entry=>entry.specificity>=0).sort((left,right)=>right.specificity-left.specificity)[0],currentItem=currentEntry?.item,activeCollapsibleGroup=currentEntry?.group.collapsible===true?currentEntry.groupKey:null;
 const [openOnPath,setOpenOnPath]=useState<string|null>(null),[returnFocusId,setReturnFocusId]=useState<string|null>(null),[expandedGroups,setExpandedGroups]=useState<readonly string[]>(()=>activeCollapsibleGroup?[activeCollapsibleGroup]:[]),sidebar=useRef<HTMLElement>(null),firstItem=useRef<HTMLAnchorElement>(null),open=openOnPath===pathname;
 const toggleId=`${navigationId}-toggle`;
 const close=useCallback((returnFocus=false)=>{setOpenOnPath(null);if(returnFocus)requestAnimationFrame(()=>document.getElementById(returnFocusId??toggleId)?.focus());},[returnFocusId,toggleId]);
 const openNavigation=useCallback((openerId:string)=>{setReturnFocusId(openerId);setOpenOnPath(pathname);},[pathname]);
 useEffect(()=>{
  if(!open)return;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const onKeyDown=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();close(true);return;}
   if(event.key!=='Tab'||!sidebar.current)return;
   const items=[...sidebar.current.querySelectorAll<HTMLElement>(focusableSelector)].filter(item=>item.getClientRects().length>0);
   if(!items.length)return;
   const first=items[0],last=items.at(-1)!;
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',onKeyDown);
  requestAnimationFrame(()=>firstItem.current?.focus());
  return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener('keydown',onKeyDown);};
 },[close,open]);
 const identityLabel=accountDisplayName?.trim()||`${roleLabel} account`,initials=identityLabel.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase();
 return <div className={`portal-shell${shellClassName?` ${shellClassName}`:''}`} data-vs-theme={theme} data-density={preferences?.density} data-reduced-motion={preferences?.reducedMotion}>
  <header className="portal-topbar">
   <button id={toggleId} type="button" className="portal-menu-toggle" aria-controls={navigationId} aria-expanded={open} onClick={()=>{setReturnFocusId(toggleId);if(open)close(true);else setOpenOnPath(pathname);}}><span aria-hidden="true"><PortalIcon name={open?'close':'menu'}/></span><span className="sr-only">{open?closeNavigationLabel:openNavigationLabel}</span></button>
   <Link className="portal-mobile-brand" href={homeHref}><span className="portal-brand-mark" aria-hidden="true">v</span><span>VSchool</span></Link>
   <span className="portal-workspace-label">{currentItem?.label??roleLabel}</span>
   <div className="portal-top-context">{topContext??(home?<BranchSwitcher home={home} contextHref={contextHref}/>:null)}{academicYearLabel&&<span className="portal-top-year" aria-label={`Academic year ${academicYearLabel}`}>{academicYearLabel}</span>}</div>
  </header>
  {open&&<div className="portal-sidebar-backdrop" aria-hidden="true" onClick={()=>close(true)}/>}
  <aside ref={sidebar} id={navigationId} className={`portal-sidebar${open?' portal-sidebar-open':''}`} aria-label={`${roleLabel} menu`} role={open?'dialog':undefined} aria-modal={open||undefined}>
   <div className="portal-sidebar-heading">
    <Link className="portal-brand" href={homeHref} aria-label={`VSchool ${roleLabel.toLowerCase()}`}><span className="portal-brand-mark" aria-hidden="true">v</span><span>VSchool</span></Link>
    <button type="button" className="portal-sidebar-close" onClick={()=>close(true)}><span aria-hidden="true"><PortalIcon name="close"/></span><span className="sr-only">Close menu panel</span></button>
   </div>
   {sidebarContext??(home?<div className="portal-school-identity"><strong>{home.institutionName}</strong><span>{home.schoolName}</span></div>:null)}
   <div className="portal-nav-scroll"><nav aria-label={navigationLabel}>{groups.filter(group=>group.items.length>0).map((group,index)=>{const groupKey=group.id??`${index}-${group.label}`,isExpanded=expandedGroups.includes(groupKey)||activeCollapsibleGroup===groupKey;return <PortalNavigationGroup key={groupKey} group={group} groupKey={groupKey} activeHref={currentItem?.href??null} onNavigate={key=>{setExpandedGroups(current=>current.includes(key)?current:[...current,key]);close();}} firstItemRef={index===0?firstItem:undefined} expanded={isExpanded} onToggle={key=>setExpandedGroups(current=>{if(key===activeCollapsibleGroup)return current.includes(key)?current:[...current,key];return current.includes(key)?current.filter(value=>value!==key):[...current,key];})}/>;})}</nav></div>
   <footer className="portal-sidebar-footer">
    <Link className="portal-identity" href={accountHref} aria-label={accountDisplayName?.trim()?`${identityLabel}, ${roleLabel} account`:identityLabel} onClick={()=>close()}>
     <span className="portal-identity-avatar" aria-hidden="true">{initials}</span>
     <span><strong>{identityLabel}</strong><small>{roleLabel}</small></span>
    </Link>
    <div className="portal-sidebar-signout"><AccessSignOut staged={stagedSignOut} stagedHref={stagedSignOutHref}/></div>
   </footer>
  </aside>
  <div className={`portal-page-content${contentClassName?` ${contentClassName}`:''}`}>{children}</div>
  {bottomNavigation?.({open,openNavigation})}
 </div>;
}
