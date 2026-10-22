import {AdminLocalNavigation} from './admin-local-navigation';
import {ButtonLink} from './ui/primitives';

type StaffView='profiles'|'access'|'availability';

const PlusIcon=()=> <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>;

export function AdminStaffNavigation({current,profiles,access,availability,actionHref,actionLabel}:{current:StaffView;profiles:boolean;access:boolean;availability:boolean;actionHref?:string;actionLabel?:string}){
 void availability;
 const items=[...(profiles?[{id:'profiles' as const,label:'Profiles',href:'/admin/teachers'}]:[]),...(access?[{id:'access' as const,label:'Access',href:'/admin/users'}]:[])];
 return <AdminLocalNavigation label="Staff area" current={items.find(item=>item.id===current)?.href??''} items={items} action={actionHref&&actionLabel?<ButtonLink href={actionHref}><PlusIcon/>{actionLabel}</ButtonLink>:undefined}/>;
}
