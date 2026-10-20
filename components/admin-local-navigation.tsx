'use client';

import Link from 'next/link';
import type {ReactNode} from 'react';
import {useAdminNavigationDestinations} from './admin-navigation-context';

export type AdminLocalNavigationItem=Readonly<{label:string;href:string}>;

const areaOrder:Readonly<Record<string,readonly string[]>>={
 attendance:['/admin/attendance/sessions?view=monitor','/admin/attendance/explanations','/admin/attendance/correction-requests','/admin/reports/attendance'],
 academics:['/admin/timetable','/admin/academics','/admin/classes','/admin/assessments','/admin/timetable/cover'],
 communication:['/admin/communication','/admin/events'],
 settings:['/admin/setup','/admin/school','/admin/modules','/admin/branding','/admin/activity'],
};

export function AdminLocalNavigation({label,current,items,area,action}:{label:string;current:string;items?:readonly AdminLocalNavigationItem[];area?:string;action?:ReactNode}){
 const destinations=useAdminNavigationDestinations(),order=area?areaOrder[area]??[]:[];
 const resolved=items??destinations.filter(item=>item.area===area).map(item=>({label:item.label,href:item.href})).sort((left,right)=>order.indexOf(left.href)-order.indexOf(right.href));
 if(resolved.length<2&&!action)return null;
 return <div className="admin-local-navigation-row">
  {resolved.length>1?<nav className="workspace-tabs admin-local-navigation" aria-label={label}>{resolved.map(item=><Link key={item.href} href={item.href} aria-current={item.href===current?'page':undefined}>{item.label}</Link>)}</nav>:<span className="admin-local-destination">{resolved[0]?.label}</span>}
  {action?<div className="admin-local-action">{action}</div>:null}
 </div>;
}
