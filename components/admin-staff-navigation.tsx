import {AdminLocalNavigation} from './admin-local-navigation';

type StaffView='profiles'|'access'|'availability';

export function AdminStaffNavigation({current,profiles,access,availability}:{current:StaffView;profiles:boolean;access:boolean;availability:boolean}){
 void availability;
 const items=[...(profiles?[{id:'profiles' as const,label:'Profiles',href:'/admin/teachers'}]:[]),...(access?[{id:'access' as const,label:'Access',href:'/admin/users'}]:[])];
 return <AdminLocalNavigation label="Staff area" current={items.find(item=>item.id===current)?.href??''} items={items}/>;
}
