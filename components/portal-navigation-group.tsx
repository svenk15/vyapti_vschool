import Link from 'next/link';
import type {Ref} from 'react';
export type PortalIconName='home'|'school'|'settings'|'modules'|'branding'|'staff'|'people'|'students'|'import'|'academics'|'classes'|'attendance'|'calendar'|'report'|'activity';
export type PortalNavigationItem=Readonly<{href:string;label:string;icon?:PortalIconName}>;
export type PortalNavigationGroupData=Readonly<{label:string;items:readonly PortalNavigationItem[]}>;
function PortalIcon({name='home'}:{name?:PortalIconName}){
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
 if(name==='attendance')return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>;
 if(name==='report')return <svg {...common}><path d="M4 3v18h17 M8 17v-5m5 5V7m5 10V9"/></svg>;
 if(name==='activity')return <svg {...common}><path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2"/></svg>;
 return null;
}
export function PortalNavigationGroup({group,pathname,onNavigate,firstItemRef}:{group:PortalNavigationGroupData;pathname:string;onNavigate?:()=>void;firstItemRef?:Ref<HTMLAnchorElement>}){
 const id=`nav-${group.label.replaceAll(' ','-').toLowerCase()}`;
 return <section className="portal-nav-group" aria-labelledby={id}><h2 id={id}>{group.label}</h2>{group.items.map((item,index)=>{const current=item.href==='/admin'?pathname==='/admin':pathname===item.href||pathname.startsWith(`${item.href}/`);return <Link ref={index===0?firstItemRef:undefined} key={item.href} href={item.href} aria-current={current?'page':undefined} onClick={onNavigate}><span className="portal-nav-icon"><PortalIcon name={item.icon}/></span><span>{item.label}</span></Link>;})}</section>;
}
