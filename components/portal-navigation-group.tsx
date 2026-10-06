import Link from 'next/link';
import type {Ref} from 'react';
export type PortalIconName='overview'|'setup'|'settings'|'modules'|'branding'|'staff'|'people'|'students'|'import'|'academics'|'classes'|'calendar'|'report';
export type PortalNavigationItem=Readonly<{href:string;label:string;icon?:PortalIconName}>;
export type PortalNavigationGroupData=Readonly<{label:string;items:readonly PortalNavigationItem[]}>;
function PortalIcon({name='overview'}:{name?:PortalIconName}){
 const common={viewBox:'0 0 24 24',focusable:false,'aria-hidden':true} as const;
 if(name==='overview')return <svg {...common}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>;
 if(name==='setup')return <svg {...common}><path d="M4 20V8l8-5 8 5v12M8 20v-7h8v7M3 20h18"/></svg>;
 if(name==='settings')return <svg {...common}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 12l2-1-2-4-2 .5L15.5 6 16 4h-5l-.5 2L9 7.5 7 7l-2 4 2 1v2l-2 1 2 4 2-.5 1.5 1.5-.5 2h5l.5-2 1.5-1.5 2 .5 2-4-2-1z"/></svg>;
 if(name==='modules')return <svg {...common}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>;
 if(name==='branding')return <svg {...common}><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a1.5 1.5 0 0 1 0-3h2a7 7 0 0 0-2-11ZM7.5 10h.01M9 6.5h.01M15 6.5h.01M17 10h.01"/></svg>;
 if(name==='staff'||name==='people')return <svg {...common}><path d="M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-2a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v2M16 4a3.5 3.5 0 0 1 0 7M21 21v-2a4.5 4.5 0 0 0-3.5-4.4"/></svg>;
 if(name==='students')return <svg {...common}><path d="m3 9 9-5 9 5-9 5zM7 12v5c3 2 7 2 10 0v-5M21 9v7"/></svg>;
 if(name==='import')return <svg {...common}><path d="M12 3v12M7 10l5 5 5-5M4 19h16"/></svg>;
 if(name==='academics')return <svg {...common}><path d="M5 4h14v16H5zM9 4v16M12 8h4M12 12h4"/></svg>;
 if(name==='classes')return <svg {...common}><path d="M4 5h16v14H4zM4 9h16M9 9v10"/></svg>;
 if(name==='calendar')return <svg {...common}><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"/></svg>;
 if(name==='report')return <svg {...common}><path d="M5 3h14v18H5zM8 16v-3M12 16V8M16 16v-6"/></svg>;
 return null;
}
export function PortalNavigationGroup({group,pathname,onNavigate,firstItemRef}:{group:PortalNavigationGroupData;pathname:string;onNavigate?:()=>void;firstItemRef?:Ref<HTMLAnchorElement>}){
 const id=`nav-${group.label.replaceAll(' ','-').toLowerCase()}`;
 return <section className="portal-nav-group" aria-labelledby={id}><h2 id={id}>{group.label}</h2>{group.items.map((item,index)=>{const current=item.href==='/admin'?pathname==='/admin':pathname===item.href||pathname.startsWith(`${item.href}/`);return <Link ref={index===0?firstItemRef:undefined} key={item.href} href={item.href} aria-current={current?'page':undefined} onClick={onNavigate}><span className="portal-nav-icon"><PortalIcon name={item.icon}/></span><span>{item.label}</span></Link>;})}</section>;
}
