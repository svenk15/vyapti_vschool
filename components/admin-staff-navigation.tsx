import {AdminLocalNavigation} from './admin-local-navigation';
import {ButtonLink} from './ui/primitives';

type StaffView='profiles'|'access'|'availability';

const PlusIcon=()=> <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>;

export function AdminStaffNavigation({current,profiles,access,availability,actionHref,actionLabel}:{current:StaffView;profiles:boolean;access:boolean;availability:boolean;actionHref?:string;actionLabel?:string}){
 void access;void availability;
 const items=profiles?[{label:'Profiles',href:'/admin/teachers'}]:[];
 const primaryAction=actionHref&&actionLabel?<ButtonLink href={actionHref}><PlusIcon/>{actionLabel}</ButtonLink>:null;
 return <AdminLocalNavigation label="Staff area" current={current==='profiles'?'/admin/teachers':current==='access'?'/admin/users':'/admin/teachers/availability'} items={items} action={primaryAction??undefined}/>;
}
