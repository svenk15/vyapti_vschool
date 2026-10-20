import Link from 'next/link';
import type {ReactNode} from 'react';

export type AdminLocalNavigationItem=Readonly<{label:string;href:string}>;

export function AdminLocalNavigation({label,current,items,action}:{label:string;current:string;items:readonly AdminLocalNavigationItem[];action?:ReactNode}){
 if(items.length<2&&!action)return null;
 return <div className="admin-local-navigation-row">
  {items.length>1?<nav className="workspace-tabs admin-local-navigation" aria-label={label}>{items.map(item=><Link key={item.href} href={item.href} aria-current={item.href===current?'page':undefined}>{item.label}</Link>)}</nav>:<span className="admin-local-destination">{items[0]?.label}</span>}
  {action?<div className="admin-local-action">{action}</div>:null}
 </div>;
}
