import type {PortalIconName,PortalNavigationGroupData} from './portal-navigation-group';

export type WorkspaceNavigationItem=readonly [label:string,href:string,icon:PortalIconName];

export const adminNavigationSections:readonly Readonly<{id:string;label:string;icon:PortalIconName;hrefs:readonly string[];collapsible?:boolean;showLabel?:boolean;sectionBreakBefore?:boolean}>[]=[
 {id:'admin-primary',label:'Today',icon:'home',hrefs:['/admin'],collapsible:false,showLabel:false},
 {id:'people',label:'People',icon:'people',hrefs:['/admin/students','/admin/teachers','/admin/users','/admin/admissions'],sectionBreakBefore:true},
 {id:'teaching',label:'Teaching',icon:'academics',hrefs:['/admin/academics','/admin/classes','/admin/timetable','/admin/assessments','/admin/timetable/cover']},
 {id:'attendance',label:'Attendance',icon:'attendance',hrefs:['/admin/attendance/sessions','/admin/attendance/correction-requests','/admin/attendance/explanations']},
 {id:'communication',label:'Communication',icon:'mail',hrefs:['/admin/communication','/admin/events']},
 {id:'my-work',label:'My work',icon:'activity',hrefs:[]},
 {id:'reports',label:'Reports',icon:'report',hrefs:['/admin/reports/attendance']},
 {id:'school-administration',label:'School administration',icon:'settings',hrefs:['/admin/setup','/admin/school','/admin/modules','/admin/branding','/admin/imports','/admin/activity'],sectionBreakBefore:true},
 {id:'additional-services',label:'Additional services',icon:'school',hrefs:[]},
];

export const studentNavigationCatalogue:readonly WorkspaceNavigationItem[]=[
 ['My day','/student','home'],['My profile','/student/profile','students'],['My classes','/student/classes','academics'],['My timetable','/student/timetable','calendar'],['School calendar','/student/calendar','calendar'],['Assignments','/student/assignments','academics'],['Results','/student/results','report'],['Attendance','/student/attendance','attendance'],['Notices','/student/notices','mail'],['My account','/student/account','account'],
];

export const studentNavigationRouteGroups={
 learning:new Set(['/student/classes','/student/assignments','/student/results']),
 schoolLife:new Set(['/student/timetable','/student/calendar','/student/attendance','/student/notices']),
 personal:new Set(['/student/profile','/student/account']),
} as const;

export const familyNavigationCatalogue:readonly WorkspaceNavigationItem[]=[
 ['Home','/family','home'],['My children','/family/children','students'],['Assignments','/family/learning','academics'],['Results','/family/results','report'],['Attendance','/family/attendance','attendance'],["Child's timetable",'/family/timetable','calendar'],['School calendar','/family/calendar','calendar'],['Notices','/family/notices','mail'],['Concerns','/family/concerns','mail'],['Meetings','/family/meetings','calendar'],['My account','/family/account','account'],
];

export const familyNavigationRouteGroups={
 learning:new Set(['/family/learning','/family/results']),
 schoolDay:new Set(['/family/attendance','/family/timetable','/family/calendar']),
 communication:new Set(['/family/notices','/family/concerns','/family/meetings']),
} as const;

export type TeacherNavigationOptions={canUseClasses:boolean;canUseTimetable:boolean;canUseCover:boolean;canUseMeetings:boolean;canUseSupport:boolean;canUseHistory:boolean;canUseLearning:boolean;canUseAssessments:boolean};

export function teacherNavigationGroups({canUseClasses,canUseTimetable,canUseCover,canUseMeetings,canUseSupport,canUseHistory,canUseLearning,canUseAssessments}:TeacherNavigationOptions):PortalNavigationGroupData[]{
 const groups:PortalNavigationGroupData[]=[
  {id:'teacher-primary',label:'My day',showLabel:false,collapsible:false,items:[{label:'My day',href:'/teacher/today',icon:'home'}]},
  {id:'teacher-teaching',label:'Teaching',collapsible:false,sectionBreakBefore:true,items:[...(canUseClasses?[{label:'My classes',href:'/teacher/classes',icon:'classes' as const}]:[]),...(canUseTimetable?[{label:'My timetable',href:'/teacher/timetable',icon:'calendar' as const}]:[]),...(canUseHistory?[{label:'Attendance history',href:'/teacher/history',icon:'attendance' as const}]:[])]},
  {id:'teacher-learning',label:'Learning',collapsible:false,sectionBreakBefore:true,items:[...(canUseLearning?[{label:'Assignments',href:'/teacher/learning',icon:'academics' as const}]:[]),...(canUseAssessments?[{label:'Assessment marks',href:'/teacher/assessments',icon:'report' as const}]:[])]},
  {id:'teacher-work',label:'My work',collapsible:false,sectionBreakBefore:true,items:[...(canUseCover?[{label:'Cover requests',href:'/teacher/cover',icon:'people' as const}]:[]),...(canUseMeetings?[{label:'Meetings',href:'/teacher/meetings',icon:'calendar' as const}]:[]),...(canUseSupport?[{label:'Specialist support',href:'/teacher/support',icon:'people' as const}]:[])]},
  {id:'teacher-account',label:'Account',collapsible:false,sectionBreakBefore:true,items:[{label:'My account',href:'/account',icon:'account'}]},
 ];
 return groups.filter(group=>group.items.length>0);
}
