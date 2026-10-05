'use client';
import Link from 'next/link';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import type {AdminHome} from '@/shared/contracts/access';
import type {AdminNavigationGroup} from '@/lib/server/admin-navigation';
import {BranchSwitcher} from '@/components/institution-context';
import {AccessSignOut} from '@/components/access-login';

export function AdminPortalFrame({home,groups,children}:{home:AdminHome;groups:readonly AdminNavigationGroup[];children:ReactNode}){
 const pathname=usePathname(),[openOnPath,setOpenOnPath]=useState<string|null>(null),toggle=useRef<HTMLButtonElement>(null),firstItem=useRef<HTMLAnchorElement>(null),open=openOnPath===pathname;
 useEffect(()=>{if(!open)return;const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpenOnPath(null);toggle.current?.focus();}};document.addEventListener('keydown',onKeyDown);return()=>document.removeEventListener('keydown',onKeyDown);},[open]);
 useEffect(()=>{if(open)firstItem.current?.focus();},[open]);
 return <div className="portal-shell">
  <header className="portal-topbar">
   <button ref={toggle} type="button" className="portal-menu-toggle" aria-controls="admin-navigation" aria-expanded={open} onClick={()=>setOpenOnPath(open?null:pathname)}><span aria-hidden="true">{open?'×':'☰'}</span><span className="sr-only">{open?'Close navigation':'Open navigation'}</span></button>
   <Link className="portal-mobile-brand" href="/admin"><span className="portal-brand-mark" aria-hidden="true">v</span>VSchool</Link>
   <div className="portal-top-context"><BranchSwitcher home={home}/></div>
   <div className="portal-account"><AccessSignOut/></div>
  </header>
  <aside id="admin-navigation" className={`portal-sidebar${open?' portal-sidebar-open':''}`}>
   <Link className="portal-brand" href="/admin" aria-label="VSchool school administration"><span className="portal-brand-mark" aria-hidden="true">v</span><span>VSchool</span></Link>
   <nav aria-label="School administration">
    {groups.map(group=><section className="portal-nav-group" key={group.label} aria-labelledby={`nav-${group.label.replaceAll(' ','-').toLowerCase()}`}>
     <h2 id={`nav-${group.label.replaceAll(' ','-').toLowerCase()}`}>{group.label}</h2>
     {group.items.map((item,index)=>{const current=item.href==='/admin'?pathname==='/admin':pathname===item.href||pathname.startsWith(`${item.href}/`);return <Link ref={groups[0]===group&&index===0?firstItem:undefined} key={item.href} href={item.href} aria-current={current?'page':undefined} onClick={()=>setOpenOnPath(null)}>{item.label}</Link>;})}
    </section>)}
   </nav>
  </aside>
  <div className="portal-page-content">{children}</div>
 </div>;
}
