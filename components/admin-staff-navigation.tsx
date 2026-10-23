import {AdminLocalNavigation} from './admin-local-navigation';
import {ButtonLink} from './ui/primitives';

type StaffView='profiles'|'access'|'availability';

const PlusIcon=()=> <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>;
const AccessIcon=()=> <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-3.8 2.4-5.7 5.5-5.7s4.9 1.9 5.5 5.7M18 8v6M15 11h6"/></svg>;

export function AdminStaffNavigation({current,profiles,access,availability,actionHref,actionLabel}:{current:StaffView;profiles:boolean;access:boolean;availability:boolean;actionHref?:string;actionLabel?:string}){
 void availability;
 const items=profiles?[{label:'Profiles',href:'/admin/teachers'}]:[];
 const primaryAction=actionHref&&actionLabel?<ButtonLink href={actionHref}><PlusIcon/>{actionLabel}</ButtonLink>:null;
 const accessAction=current==='profiles'&&access?<ButtonLink href="/admin/users" variant="secondary"><AccessIcon/>Access administration</ButtonLink>:null;
 const actions=primaryAction||accessAction?<div className="staff-navigation-actions">{accessAction}{primaryAction}</div>:undefined;
 return <AdminLocalNavigation label="Staff area" current={current==='profiles'?'/admin/teachers':current==='access'?'/admin/users':'/admin/teachers/availability'} items={items} action={actions}/>;
}
