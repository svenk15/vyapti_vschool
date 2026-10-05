import 'server-only';
import type {AdminHome,Identity} from '../../shared/contracts/access';
import type {ModuleId} from '../../shared/contracts/modules';
import {moduleGateway} from './tenancy';

export type AdminNavigationItem=Readonly<{label:string;href:string}>;
export type AdminNavigationGroup=Readonly<{label:string;items:readonly AdminNavigationItem[]}>;
type Route={label:string;href:string;permission:string;modules?:readonly ModuleId[];institutionAdmin?:boolean};

const routes:readonly Route[]=[
 {label:'School overview',href:'/admin',permission:'school.manage'},
 {label:'School setup',href:'/admin/setup',permission:'school.manage'},
 {label:'School settings',href:'/admin/school',permission:'school.manage'},
 {label:'Branch module access',href:'/admin/modules',permission:'module.configure',institutionAdmin:true},
 {label:'Sign-in branding',href:'/admin/branding',permission:'branding.manage'},
 {label:'Staff access',href:'/admin/users',permission:'user.manage'},
 {label:'Staff profiles',href:'/admin/teachers',permission:'class.manage',modules:['staff_core']},
 {label:'Students',href:'/admin/students',permission:'student.read',modules:['student_core']},
 {label:'Roster preview',href:'/admin/imports',permission:'student.manage',modules:['student_core','academic_core']},
 {label:'Academic setup',href:'/admin/academics',permission:'class.manage',modules:['academic_core']},
 {label:'Classes and teachers',href:'/admin/classes',permission:'class.read',modules:['academic_core','staff_core']},
 {label:'Schedule sessions',href:'/admin/attendance/sessions',permission:'attendance.read_school',modules:['attendance']},
 {label:'Attendance report',href:'/admin/reports/attendance',permission:'attendance.read_school',modules:['attendance']},
];
const sections:readonly Readonly<{label:string;hrefs:readonly string[]}>[]=[
 {label:'Overview',hrefs:['/admin']},
 {label:'School',hrefs:['/admin/setup','/admin/school','/admin/modules','/admin/branding']},
 {label:'People and students',hrefs:['/admin/users','/admin/teachers','/admin/students','/admin/imports']},
 {label:'Academics',hrefs:['/admin/academics','/admin/classes']},
 {label:'Attendance',hrefs:['/admin/attendance/sessions','/admin/reports/attendance']},
];

export async function getAdminNavigation(identity:Identity,home:AdminHome):Promise<AdminNavigationGroup[]>{
 const capabilities=new Set(home.capabilities);
 const checks=await Promise.all(routes.map(async route=>{
  if(!capabilities.has(route.permission))return [route.href,false] as const;
  if(route.institutionAdmin){try{await moduleGateway.getCurrent(identity);return [route.href,true] as const;}catch{return [route.href,false] as const;}}
  if(!route.modules)return [route.href,true] as const;
  for(const moduleId of route.modules)if(!await moduleGateway.canUseCurrent(identity,moduleId,route.permission))return [route.href,false] as const;
  return [route.href,true] as const;
 }));
 const visible=new Set(checks.filter(([,allowed])=>allowed).map(([href])=>href));
 return sections.map(section=>({label:section.label,items:routes.filter(route=>section.hrefs.includes(route.href)&&visible.has(route.href)).map(({label,href})=>({label,href}))})).filter(group=>group.items.length>0);
}
