'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {AccessSignOut} from '@/components/access-login';
import {BranchSwitcher} from '@/components/institution-context';
import {PortalIcon,PortalNavigationGroup,portalItemMatchSpecificity,type PortalNavigationGroupData} from '@/components/portal-navigation-group';

type PortalShellProps={
 home:AdminHome;
 groups:readonly PortalNavigationGroupData[];
 homeHref:string;
 navigationLabel:string;
 roleLabel:string;
 academicYearLabel?:string|null;
 accountDisplayName?:string|null;
 accountHref?:string;
 contextHref?:string;
 stagedSignOutHref?:string;
 children:ReactNode;
 contentClassName?:string;
 preferences?:{density:'COMFORTABLE'|'COMPACT';reducedMotion:'SYSTEM'|'REDUCE'};
};

const focusableSelector='a[href],button:not([disabled]),select:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function PortalShell({home,groups,homeHref,navigationLabel,roleLabel,academicYearLabel,accountDisplayName,accountHref='/account',contextHref='/admin/context',stagedSignOutHref='/admin/context?destination=sign-out',children,contentClassName,preferences}:PortalShellProps){
 const pathname=usePathname(),entries=groups.flatMap((group,index)=>group.items.map(item=>({group,groupKey:group.id??`${index}-${group.label}`,item,specificity:portalItemMatchSpecificity(pathname,item)}))),currentEntry=entries.filter(entry=>entry.specificity>=0).sort((left,right)=>right.specificity-left.specificity)[0],currentItem=currentEntry?.item,activeCollapsibleGroup=currentEntry?.group.collapsible===true?currentEntry.groupKey:null;
 const [openOnPath,setOpenOnPath]=useState<string|null>(null),[expandedGroups,setExpandedGroups]=useState<readonly string[]>(()=>activeCollapsibleGroup?[activeCollapsibleGroup]:[]),toggle=useRef<HTMLButtonElement>(null),sidebar=useRef<HTMLElement>(null),firstItem=useRef<HTMLAnchorElement>(null),open=openOnPath===pathname;
 const close=useCallback((returnFocus=false)=>{setOpenOnPath(null);if(returnFocus)requestAnimationFrame(()=>toggle.current?.focus());},[]);
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
 return <div className="portal-shell" data-density={preferences?.density} data-reduced-motion={preferences?.reducedMotion}>
  <header className="portal-topbar">
   <button ref={toggle} type="button" className="portal-menu-toggle" aria-controls="portal-navigation" aria-expanded={open} onClick={()=>open?close(true):setOpenOnPath(pathname)}><span aria-hidden="true"><PortalIcon name={open?'close':'menu'}/></span><span className="sr-only">{open?'Close navigation':'Open navigation'}</span></button>
   <Link className="portal-mobile-brand" href={homeHref}><span className="portal-brand-mark" aria-hidden="true">v</span><span>VSchool</span></Link>
   <span className="portal-workspace-label">{currentItem?.label??roleLabel}</span>
   <div className="portal-top-context"><BranchSwitcher home={home} contextHref={contextHref}/>{academicYearLabel&&<span className="portal-top-year" aria-label={`Academic year ${academicYearLabel}`}>{academicYearLabel}</span>}</div>
  </header>
  {open&&<div className="portal-sidebar-backdrop" aria-hidden="true" onClick={()=>close(true)}/>}
  <aside ref={sidebar} id="portal-navigation" className={`portal-sidebar${open?' portal-sidebar-open':''}`} aria-label={`${roleLabel} menu`} role={open?'dialog':undefined} aria-modal={open||undefined}>
   <div className="portal-sidebar-heading">
    <Link className="portal-brand" href={homeHref} aria-label={`VSchool ${roleLabel.toLowerCase()}`}><span className="portal-brand-mark" aria-hidden="true">v</span><span>VSchool</span></Link>
    <button type="button" className="portal-sidebar-close" onClick={()=>close(true)}><span aria-hidden="true"><PortalIcon name="close"/></span><span className="sr-only">Close menu panel</span></button>
   </div>
   <div className="portal-school-identity"><strong>{home.institutionName}</strong><span>{home.schoolName}</span></div>
   <div className="portal-nav-scroll"><nav aria-label={navigationLabel}>{groups.filter(group=>group.items.length>0).map((group,index)=>{const groupKey=group.id??`${index}-${group.label}`,isExpanded=expandedGroups.includes(groupKey)||activeCollapsibleGroup===groupKey;return <PortalNavigationGroup key={groupKey} group={group} groupKey={groupKey} activeHref={currentItem?.href??null} onNavigate={key=>{setExpandedGroups(current=>current.includes(key)?current:[...current,key]);close();}} firstItemRef={index===0?firstItem:undefined} expanded={isExpanded} onToggle={key=>setExpandedGroups(current=>{if(key===activeCollapsibleGroup)return current.includes(key)?current:[...current,key];return current.includes(key)?current.filter(value=>value!==key):[...current,key];})}/>;})}</nav></div>
   <footer className="portal-sidebar-footer">
    <Link className="portal-identity" href={accountHref} aria-label={accountDisplayName?.trim()?`${identityLabel}, ${roleLabel} account`:identityLabel} onClick={()=>close()}>
     <span className="portal-identity-avatar" aria-hidden="true">{initials}</span>
     <span><strong>{identityLabel}</strong><small>{roleLabel}</small></span>
    </Link>
    <div className="portal-sidebar-signout"><AccessSignOut staged stagedHref={stagedSignOutHref}/></div>
   </footer>
  </aside>
  <div className={`portal-page-content${contentClassName?` ${contentClassName}`:''}`}>{children}</div>
 </div>;
}
