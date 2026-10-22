import 'server-only';
import type {AdminHome,Identity} from '../../shared/contracts/access';
import type {ModuleId} from '../../shared/contracts/modules';
import {moduleGateway} from './tenancy';
import type {PortalIconName,PortalRouteMatch} from '../../components/portal-navigation-group';
import {memoizeModuleCapability} from './navigation-eligibility';

export type AdminNavigationArea='today'|'students'|'staff'|'attendance'|'academics'|'communication'|'settings'|'services';
export type AdminNavigationItem=Readonly<{label:string;href:string;icon:PortalIconName;area:AdminNavigationArea;matches?:readonly PortalRouteMatch[]}>;
export type AdminNavigationGroup=Readonly<{id:string;label:string;icon?:PortalIconName;collapsible:boolean;showLabel?:boolean;sectionBreakBefore?:boolean;items:readonly Omit<AdminNavigationItem,'area'>[]}>;
type Route=AdminNavigationItem&Readonly<{permission:string;modules?:readonly ModuleId[];institutionAdmin?:boolean}>;

const routes:readonly Route[]=[
 {label:'Today',href:'/admin',icon:'home',area:'today',permission:'school.manage',matches:[{path:'/admin',exact:true}]},
 {label:'School setup',href:'/admin/setup',icon:'settings',area:'settings',permission:'school.manage'},
 {label:'School details',href:'/admin/school',icon:'school',area:'settings',permission:'school.manage'},
 {label:'Modules',href:'/admin/modules',icon:'modules',area:'settings',permission:'module.configure',institutionAdmin:true},
 {label:'Appearance',href:'/admin/branding',icon:'branding',area:'settings',permission:'branding.manage'},
 {label:'Activity',href:'/admin/activity',icon:'activity',area:'settings',permission:'school.manage'},
 {label:'Profiles',href:'/admin/teachers',icon:'people',area:'staff',permission:'class.manage',modules:['staff_core']},
 {label:'Access',href:'/admin/users',icon:'staff',area:'staff',permission:'user.manage'},
 {label:'Directory',href:'/admin/students',icon:'students',area:'students',permission:'student.read',modules:['student_core']},
 {label:'Admissions',href:'/admin/admissions',icon:'students',area:'students',permission:'admissions.manage',modules:['admissions','student_core']},
 {label:'Imports',href:'/admin/imports',icon:'import',area:'students',permission:'student.manage',modules:['student_core','academic_core']},
 {label:'Timetable',href:'/admin/timetable',icon:'calendar',area:'academics',permission:'timetable.manage',modules:['timetable','academic_core','staff_core']},
 {label:'Classes & subjects',href:'/admin/academics',icon:'academics',area:'academics',permission:'class.manage',modules:['academic_core']},
 {label:'Cover',href:'/admin/timetable/cover',icon:'people',area:'academics',permission:'timetable.manage',modules:['timetable','academic_core','staff_core','attendance']},
 {label:'Teaching assignments',href:'/admin/classes',icon:'classes',area:'academics',permission:'class.read',modules:['academic_core','staff_core']},
 {label:'Assessments',href:'/admin/assessments',icon:'academics',area:'academics',permission:'school.manage',modules:['assessments','academic_core','student_core']},
 {label:'Registers',href:'/admin/attendance/sessions?view=monitor',icon:'attendance',area:'attendance',permission:'attendance.read_school',modules:['attendance'],matches:[{path:'/admin/attendance/sessions'}]},
 {label:'Corrections',href:'/admin/attendance/correction-requests',icon:'attendance',area:'attendance',permission:'attendance.correct',modules:['attendance']},
 {label:'Notices',href:'/admin/communication',icon:'mail',area:'communication',permission:'communication.publish',modules:['communication']},
 {label:'Calendar',href:'/admin/events',icon:'calendar',area:'communication',permission:'communication.publish',modules:['communication','academic_core','student_core']},
 {label:'Report',href:'/admin/reports/attendance',icon:'report',area:'attendance',permission:'attendance.read_school',modules:['attendance']},
];

const areas:readonly Readonly<{id:Exclude<AdminNavigationArea,'services'>;label:string;icon:PortalIconName}>[]=[
 {id:'today',label:'Today',icon:'home'},
 {id:'students',label:'Students',icon:'students'},
 {id:'staff',label:'Staff',icon:'people'},
 {id:'attendance',label:'Attendance',icon:'attendance'},
 {id:'academics',label:'Academics',icon:'academics'},
 {id:'communication',label:'Communication',icon:'mail'},
 {id:'settings',label:'Settings',icon:'settings'},
];
const preferredHrefs:Readonly<Record<Exclude<AdminNavigationArea,'services'>,readonly string[]>>={
 today:['/admin','/admin/coordination','/admin/requests'],
 students:['/admin/students','/admin/admissions','/admin/imports'],
 staff:['/admin/teachers','/admin/users','/admin/teachers/availability'],
 attendance:['/admin/attendance/sessions?view=monitor','/admin/attendance/correction-requests','/admin/attendance/explanations','/admin/reports/attendance'],
 academics:['/admin/timetable','/admin/academics','/admin/classes','/admin/assessments','/admin/timetable/cover'],
 communication:['/admin/communication','/admin/events'],
 settings:['/admin/setup','/admin/school','/admin/modules','/admin/branding','/admin/activity'],
};

function stripArea(item:AdminNavigationItem):Omit<AdminNavigationItem,'area'>{return {label:item.label,href:item.href,icon:item.icon,matches:item.matches};}

export function composeAdminNavigation(destinations:readonly AdminNavigationItem[]):AdminNavigationGroup[]{
 const primary:Omit<AdminNavigationItem,'area'>[]=[];
 for(const area of areas.filter(item=>item.id!=='settings')){
  const order=preferredHrefs[area.id],children=destinations.filter(item=>item.area===area.id).sort((left,right)=>order.indexOf(left.href)-order.indexOf(right.href));
  if(!children.length)continue;
  primary.push({label:area.label,href:children[0].href,icon:area.icon,matches:children.flatMap(child=>child.matches??[{path:child.href.split('?')[0]}])});
 }
 const settings=destinations.filter(item=>item.area==='settings').sort((left,right)=>preferredHrefs.settings.indexOf(left.href)-preferredHrefs.settings.indexOf(right.href));
 const services=destinations.filter(item=>item.area==='services');
 const groups:AdminNavigationGroup[]=[];
 if(primary.length)groups.push({id:'admin-primary',label:'Workspace',collapsible:false,showLabel:true,items:primary});
 if(services.length)groups.push({id:'admin-services',label:'School services',collapsible:false,showLabel:true,sectionBreakBefore:true,items:services.map(stripArea)});
 if(settings.length){const definition=areas.find(item=>item.id==='settings')!;groups.push({id:'admin-utility',label:'Settings',collapsible:false,showLabel:false,items:[{label:definition.label,href:settings[0].href,icon:definition.icon,matches:settings.flatMap(child=>child.matches??[{path:child.href.split('?')[0]}])}]});}
 return groups;
}

export async function getAdminNavigationDestinations(identity:Identity|null,home:AdminHome):Promise<AdminNavigationItem[]>{
 const capabilities=new Set(home.capabilities);
 // This projects menu availability only. Every destination repeats its live
 // institution, branch, module, capability and resource authorization.
 const canUse=memoizeModuleCapability((moduleId,permission)=>moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,moduleId,permission));
 const checks=await Promise.all(routes.map(async route=>{
  if(!capabilities.has(route.permission))return null;
  if(route.institutionAdmin){try{await moduleGateway.getCurrent(identity);}catch{return null;}}
  if(route.modules)for(const moduleId of route.modules)if(!await canUse(moduleId,route.permission))return null;
  return {label:route.label,href:route.href,icon:route.icon,area:route.area,matches:route.matches};
 }));
 return checks.filter((item):item is NonNullable<typeof item>=>item!==null);
}

export async function getAdminNavigation(identity:Identity|null,home:AdminHome):Promise<AdminNavigationGroup[]>{
 return composeAdminNavigation(await getAdminNavigationDestinations(identity,home));
}
