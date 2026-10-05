import Link from 'next/link';
import type {Ref} from 'react';
export type PortalNavigationItem=Readonly<{href:string;label:string}>;
export type PortalNavigationGroupData=Readonly<{label:string;items:readonly PortalNavigationItem[]}>;
export function PortalNavigationGroup({group,pathname,onNavigate,firstItemRef}:{group:PortalNavigationGroupData;pathname:string;onNavigate?:()=>void;firstItemRef?:Ref<HTMLAnchorElement>}){
 const id=`nav-${group.label.replaceAll(' ','-').toLowerCase()}`;
 return <section className="portal-nav-group" aria-labelledby={id}><h2 id={id}>{group.label}</h2>{group.items.map((item,index)=>{const current=item.href==='/admin'?pathname==='/admin':pathname===item.href||pathname.startsWith(`${item.href}/`);return <Link ref={index===0?firstItemRef:undefined} key={item.href} href={item.href} aria-current={current?'page':undefined} onClick={onNavigate}>{item.label}</Link>;})}</section>;
}
