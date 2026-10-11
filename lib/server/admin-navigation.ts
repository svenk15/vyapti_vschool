import 'server-only';
import type {AdminHome,Identity} from '../../shared/contracts/access';
import type {ModuleId} from '../../shared/contracts/modules';
import {moduleGateway} from './tenancy';
import type {PortalIconName} from '../../components/portal-navigation-group';
import {memoizeModuleCapability} from './navigation-eligibility';

export type AdminNavigationItem=Readonly<{label:string;href:string;icon:PortalIconName}>;
export type AdminNavigationGroup=Readonly<{label:string;items:readonly AdminNavigationItem[]}>;
type Route={label:string;href:string;icon:PortalIconName;permission:string;modules?:readonly ModuleId[];institutionAdmin?:boolean};

const routes:readonly Route[]=[
 {label:'Today',href:'/admin',icon:'home',permission:'school.manage'},
 {label:'School setup',href:'/admin/setup',icon:'school',permission:'school.manage'},
 {label:'School settings',href:'/admin/school',icon:'school',permission:'school.manage'},
 {label:'Branch module access',href:'/admin/modules',icon:'modules',permission:'module.configure',institutionAdmin:true},
 {label:'Sign-in branding',href:'/admin/branding',icon:'branding',permission:'branding.manage'},
 {label:'Branch activity',href:'/admin/activity',icon:'activity',permission:'school.manage'},
 {label:'Staff & access',href:'/admin/users',icon:'staff',permission:'user.manage'},
 {label:'Staff profiles',href:'/admin/teachers',icon:'people',permission:'class.manage',modules:['staff_core']},
 {label:'Students',href:'/admin/students',icon:'students',permission:'student.read',modules:['student_core']},
 {label:'Roster preview',href:'/admin/imports',icon:'import',permission:'student.manage',modules:['student_core','academic_core']},
 {label:'Academics',href:'/admin/academics',icon:'academics',permission:'class.manage',modules:['academic_core']},
 {label:'Classes and teachers',href:'/admin/classes',icon:'classes',permission:'class.read',modules:['academic_core','staff_core']},
 {label:'Attendance',href:'/admin/attendance/sessions',icon:'attendance',permission:'attendance.read_school',modules:['attendance']},
 {label:'Reports',href:'/admin/reports/attendance',icon:'report',permission:'attendance.read_school',modules:['attendance']},
];
const sections:readonly Readonly<{label:string;hrefs:readonly string[]}>[]=[
 {label:'Operations',hrefs:['/admin','/admin/attendance/sessions','/admin/students','/admin/users','/admin/academics','/admin/reports/attendance']},
 {label:'Management',hrefs:['/admin/teachers','/admin/imports','/admin/classes','/admin/setup','/admin/school','/admin/modules','/admin/branding','/admin/activity']},
];

export async function getAdminNavigation(identity:Identity,home:AdminHome):Promise<AdminNavigationGroup[]>{
 const capabilities=new Set(home.capabilities);
 // A user's current membership capabilities are already resolved in `home`.
 // Check enabled/released state once per module for navigation; each linked
 // page/API still performs its own full live resource authorization.
 const canUse=memoizeModuleCapability((moduleId,permission)=>moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,moduleId,permission));
 const checks=await Promise.all(routes.map(async route=>{
  if(!capabilities.has(route.permission))return [route.href,false] as const;
  if(route.institutionAdmin){try{await moduleGateway.getCurrent(identity);return [route.href,true] as const;}catch{return [route.href,false] as const;}}
  if(!route.modules)return [route.href,true] as const;
  for(const moduleId of route.modules)if(!await canUse(moduleId,route.permission))return [route.href,false] as const;
  return [route.href,true] as const;
 }));
 const visible=new Set(checks.filter(([,allowed])=>allowed).map(([href])=>href));
 const routeByHref=new Map(routes.map(route=>[route.href,route]));
 return sections.map(section=>({label:section.label,items:section.hrefs.flatMap(href=>{const route=routeByHref.get(href);return route&&visible.has(href)?[{label:route.label,href:route.href,icon:route.icon}]:[];})})).filter(group=>group.items.length>0);
}
