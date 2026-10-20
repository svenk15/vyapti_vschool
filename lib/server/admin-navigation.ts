import 'server-only';
import type {AdminHome,Identity} from '../../shared/contracts/access';
import type {ModuleId} from '../../shared/contracts/modules';
import {moduleGateway} from './tenancy';
import type {PortalIconName} from '../../components/portal-navigation-group';
import {adminNavigationSections} from '../../components/workspace-navigation';
import {memoizeModuleCapability} from './navigation-eligibility';

export type AdminNavigationItem=Readonly<{label:string;href:string;icon:PortalIconName;matches?:readonly Readonly<{path:string;exact?:boolean}>[]}>;
export type AdminNavigationGroup=Readonly<{id:string;label:string;icon:PortalIconName;collapsible:boolean;showLabel?:boolean;sectionBreakBefore?:boolean;items:readonly AdminNavigationItem[]}>;
type Route={label:string;href:string;icon:PortalIconName;permission:string;modules?:readonly ModuleId[];institutionAdmin?:boolean};

const routes:readonly Route[]=[
 {label:'Today',href:'/admin',icon:'home',permission:'school.manage'},
 {label:'School settings',href:'/admin/setup',icon:'settings',permission:'school.manage'},
 {label:'School details',href:'/admin/school',icon:'school',permission:'school.manage'},
 {label:'Modules',href:'/admin/modules',icon:'modules',permission:'module.configure',institutionAdmin:true},
 {label:'Branding & appearance',href:'/admin/branding',icon:'branding',permission:'branding.manage'},
 {label:'Activity',href:'/admin/activity',icon:'activity',permission:'school.manage'},
 {label:'Staff access',href:'/admin/users',icon:'staff',permission:'user.manage'},
 {label:'Staff profiles',href:'/admin/teachers',icon:'people',permission:'class.manage',modules:['staff_core']},
 {label:'Students',href:'/admin/students',icon:'students',permission:'student.read',modules:['student_core']},
 {label:'Admissions',href:'/admin/admissions',icon:'students',permission:'admissions.manage',modules:['admissions','student_core']},
 {label:'Imports',href:'/admin/imports',icon:'import',permission:'student.manage',modules:['student_core','academic_core']},
 {label:'Classes & subjects',href:'/admin/academics',icon:'academics',permission:'class.manage',modules:['academic_core']},
 {label:'Assessments',href:'/admin/assessments',icon:'academics',permission:'school.manage',modules:['assessments','academic_core','student_core']},
 {label:'Timetable',href:'/admin/timetable',icon:'calendar',permission:'timetable.manage',modules:['timetable','academic_core','staff_core']},
 {label:'Cover coordination',href:'/admin/timetable/cover',icon:'people',permission:'timetable.manage',modules:['timetable','academic_core','staff_core','attendance']},
 {label:'Teacher assignments',href:'/admin/classes',icon:'classes',permission:'class.read',modules:['academic_core','staff_core']},
 {label:'Attendance',href:'/admin/attendance/sessions',icon:'attendance',permission:'attendance.read_school',modules:['attendance']},
 {label:'Corrections',href:'/admin/attendance/correction-requests',icon:'attendance',permission:'attendance.correct',modules:['attendance']},
 {label:'Notices',href:'/admin/communication',icon:'mail',permission:'communication.publish',modules:['communication']},
 {label:'Calendar & events',href:'/admin/events',icon:'calendar',permission:'communication.publish',modules:['communication','academic_core','student_core']},
 {label:'Attendance report',href:'/admin/reports/attendance',icon:'report',permission:'attendance.read_school',modules:['attendance']},
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
 return adminNavigationSections.map(section=>({id:section.id,label:section.label,icon:section.icon,collapsible:section.collapsible??true,showLabel:section.showLabel,sectionBreakBefore:section.sectionBreakBefore,items:section.hrefs.flatMap(href=>{const route=routeByHref.get(href);return route&&visible.has(href)?[{label:route.label,href:route.href,icon:route.icon}]:[];})}));
}
