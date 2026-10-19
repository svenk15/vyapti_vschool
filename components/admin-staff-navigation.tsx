import Link from 'next/link';

type StaffView='profiles'|'access'|'availability';

export function AdminStaffNavigation({current,profiles,access,availability}:{current:StaffView;profiles:boolean;access:boolean;availability:boolean}){
 const items=[...(profiles?[{id:'profiles' as const,label:'Profiles',href:'/admin/teachers'}]:[]),...(access?[{id:'access' as const,label:'Access',href:'/admin/users'}]:[]),...(availability?[{id:'availability' as const,label:'Availability',href:'/admin/teachers/availability'}]:[])];
 if(items.length<2)return null;
 return <nav className="workspace-tabs staff-workspace-tabs" aria-label="Staff area">{items.map(item=><Link key={item.id} href={item.href} aria-current={current===item.id?'page':undefined}>{item.label}</Link>)}</nav>;
}
