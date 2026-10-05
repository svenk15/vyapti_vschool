import Link from 'next/link';
import type {ReactNode} from 'react';
import type {AdminHome} from '@/shared/contracts/access';
import {BranchSwitcher} from '@/components/institution-context';
import {AccessSignOut} from '@/components/access-login';

export function TeacherPortalFrame({home,children}:{home:AdminHome;children:ReactNode}){
 return <div className="teacher-portal-shell">
  <header className="teacher-portal-header">
   <Link className="portal-brand" href="/teacher/today" aria-label="VSchool teaching day"><span className="portal-brand-mark" aria-hidden="true">v</span><span>VSchool</span></Link>
   <div className="teacher-context"><span>Teaching workspace</span><BranchSwitcher home={home}/></div>
   <nav aria-label="Teaching navigation"><Link href="/teacher/today" aria-current="page">My teaching day</Link></nav>
   <div className="portal-account"><AccessSignOut/></div>
  </header>
  <div className="teacher-portal-content">{children}</div>
 </div>;
}
