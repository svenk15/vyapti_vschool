import Link from 'next/link';
import type {Ref} from 'react';

export type PortalIconName='home'|'school'|'settings'|'modules'|'branding'|'staff'|'people'|'students'|'import'|'academics'|'classes'|'attendance'|'calendar'|'mail'|'report'|'activity'|'account'|'menu'|'close'|'down';
export type PortalRouteMatch=Readonly<{path:string;exact?:boolean}>;
export type PortalNavigationItem=Readonly<{href:string;label:string;icon?:PortalIconName;matches?:readonly PortalRouteMatch[]}>;
export type PortalNavigationGroupData=Readonly<{id?:string;label:string;items:readonly PortalNavigationItem[];icon?:PortalIconName;collapsible?:boolean;showLabel?:boolean;sectionBreakBefore?:boolean}>;

export function portalRouteMatches(pathname:string,match:PortalRouteMatch){
 return match.exact===true?pathname===match.path:pathname===match.path||pathname.startsWith(`${match.path}/`);
}

export function portalItemMatchSpecificity(pathname:string,item:PortalNavigationItem){
 const matches=item.matches??[{path:item.href,exact:item.href==='/'||item.href.split('/').filter(Boolean).length===1}];
 return matches.reduce((specificity,match)=>portalRouteMatches(pathname,match)?Math.max(specificity,match.path.length):specificity,-1);
}

export function PortalIcon({name='home'}:{name?:PortalIconName}){
 const common={viewBox:'0 0 24 24',focusable:false,'aria-hidden':true} as const;
 if(name==='home')return <svg {...common}><path d="M3 10 12 3l9 7v10H3Z M9 20v-7h6v7"/></svg>;
 if(name==='school')return <svg {...common}><path d="M3 21V8l9-5 9 5v13 M1 21h22 M9 21v-6h6v6 M7 10h1m8 0h1 M7 13h1m8 0h1"/></svg>;
 if(name==='settings')return <svg {...common}><path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/></svg>;
 if(name==='modules')return <svg {...common}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>;
 if(name==='branding')return <svg {...common}><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a1.5 1.5 0 0 1 0-3h2a7 7 0 0 0-2-11ZM7.5 10h.01M9 6.5h.01M15 6.5h.01M17 10h.01"/></svg>;
 if(name==='staff'||name==='people')return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 4a4 4 0 0 1 0 7 M22 21v-2a4 4 0 0 0-3-3.87"/></svg>;
 if(name==='students')return <svg {...common}><path d="m2 8 10-5 10 5-10 5Z M6 10v6c4 3 8 3 12 0v-6 M22 8v7"/></svg>;
 if(name==='import')return <svg {...common}><path d="M12 16V3m-5 5 5-5 5 5 M3 15v6h18v-6"/></svg>;
 if(name==='academics')return <svg {...common}><path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1v15"/></svg>;
 if(name==='classes')return <svg {...common}><path d="M4 5h16v14H4zM4 9h16M9 9v10"/></svg>;
 if(name==='calendar')return <svg {...common}><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"/></svg>;
 if(name==='mail')return <svg {...common}><path d="M3 5h18v14H3zM3 6l9 7 9-7"/></svg>;
 if(name==='attendance')return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>;
 if(name==='report')return <svg {...common}><path d="M4 3v18h17 M8 17v-5m5 5V7m5 10V9"/></svg>;
 if(name==='activity')return <svg {...common}><path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2"/></svg>;
 if(name==='account')return <svg {...common}><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z M9 12l2 2 4-5"/></svg>;
 if(name==='menu')return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
 if(name==='close')return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
 if(name==='down')return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
 return null;
}

export function PortalNavigationGroup({group,groupKey=group.id??group.label.toLowerCase().replace(/[^a-z0-9]+/g,'-'),activeHref,onNavigate,firstItemRef,expanded,onToggle}:{group:PortalNavigationGroupData;groupKey?:string;activeHref:string|null;onNavigate?:(groupKey:string)=>void;firstItemRef?:Ref<HTMLAnchorElement>;expanded?:boolean;onToggle?:(groupKey:string)=>void}){
 const id=`portal-nav-${groupKey.replace(/[^a-z0-9-]/gi,'-').toLowerCase()}`,itemsId=`${id}-items`,showLabel=group.showLabel!==false,collapsible=group.collapsible===true,isExpanded=!collapsible||expanded===true;
 return <section className={`portal-nav-group${collapsible?' portal-nav-group-collapsible':''}${collapsible&&isExpanded?' portal-nav-group-expanded':''}${group.sectionBreakBefore?' portal-nav-group-section-break':''}`} aria-label={!showLabel?group.label:undefined}>{collapsible?<button type="button" id={id} className="portal-nav-disclosure" aria-expanded={isExpanded} aria-controls={itemsId} onClick={()=>onToggle?.(groupKey)}>{group.icon&&<span className="portal-nav-icon"><PortalIcon name={group.icon}/></span>}<span>{group.label}</span><span className="portal-nav-chevron"><PortalIcon name="down"/></span></button>:showLabel?<h2 id={id}>{group.label}</h2>:null}<div id={itemsId} className="portal-nav-group-items" hidden={!isExpanded}>{group.items.map((item,index)=>{const current=item.href===activeHref;return <Link ref={index===0?firstItemRef:undefined} key={`${item.href}:${item.label}`} href={item.href} aria-current={current?'page':undefined} onClick={()=>onNavigate?.(groupKey)}>{!collapsible&&item.icon&&<span className="portal-nav-icon"><PortalIcon name={item.icon}/></span>}<span>{item.label}</span></Link>;})}</div></section>;
}
