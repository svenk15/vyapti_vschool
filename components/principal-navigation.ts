import type {AdminHome} from '../shared/contracts/access';
import type {PortalNavigationGroupData,PortalRouteMatch} from './portal-navigation-group';

export type PrincipalNavigationOptions={
 home:AdminHome;
 canUseAttendance?:boolean;canUsePupilAttendance?:boolean;canUseExplanations?:boolean;canUseCorrectionRequests?:boolean;
 canUseAvailability?:boolean;canUseStaffRequests?:boolean;canUseFamilyConcerns?:boolean;canUseMeetings?:boolean;
 canUseSupport?:boolean;canUseFacilities?:boolean;canUseFinance?:boolean;canUseAssistant?:boolean;
 canUseCoordination?:boolean;canUseHandover?:boolean;canUseHistory?:boolean;canUseDecisions?:boolean;
 canUseTimetable?:boolean;canUseCover?:boolean;canUseLearning?:boolean;canUseLearningEvidence?:boolean;
 canUseAssessmentReadiness?:boolean;canUseAssessmentPublication?:boolean;canUseCommunication?:boolean;
 canReviewNotices?:boolean;canUseReports?:boolean;
};

const route=(path:string,exact=false):PortalRouteMatch=>({path,exact});

export function principalNavigationGroups({home,canUseAttendance=false,canUsePupilAttendance=false,canUseExplanations=false,canUseCorrectionRequests=false,canUseAvailability=false,canUseStaffRequests=false,canUseFamilyConcerns=false,canUseMeetings=false,canUseSupport=false,canUseFacilities=false,canUseFinance=false,canUseAssistant=false,canUseCoordination=false,canUseHandover=false,canUseHistory=false,canUseDecisions=false,canUseTimetable=false,canUseCover=false,canUseLearning=false,canUseLearningEvidence=false,canUseAssessmentReadiness=false,canUseAssessmentPublication=false,canUseCommunication=false,canReviewNotices=false,canUseReports=false}:PrincipalNavigationOptions){
 const timetableHref=canUseTimetable?'/leadership/timetable':'/leadership/cover',learningHref=canUseLearning?'/leadership/learning':'/leadership/learning/evidence',assessmentHref=canUseAssessmentReadiness?'/leadership/assessments':'/leadership/assessments/publications';
 const groups:readonly PortalNavigationGroupData[]=[
  {id:'principal-primary',label:'Principal home',showLabel:false,items:[{label:'My day',href:'/leadership',icon:'home',matches:[route('/leadership',true)]}]},
  {id:'principal-attendance',label:'Attendance',icon:'attendance',collapsible:true,items:[
   ...(canUseAttendance?[{label:'Register coverage',href:'/leadership/attendance',matches:[route('/leadership/attendance',true),route('/leadership/attendance/sessions')]}]:[]),
   ...(canUsePupilAttendance?[{label:'Pupil attendance',href:'/leadership/attendance/pupils',matches:[route('/leadership/attendance/pupils')]}]:[]),
   ...(canUseExplanations?[{label:'Explanations',href:'/leadership/attendance/explanations',matches:[route('/leadership/attendance/explanations')]}]:[]),
   ...(canUseCorrectionRequests?[{label:'Correction requests',href:'/leadership/attendance/correction-requests',matches:[route('/leadership/attendance/correction-requests')]}]:[]),
  ]},
  {id:'principal-teaching',label:'Teaching & staff',icon:'academics',collapsible:true,items:[
   ...(canUseTimetable||canUseCover?[{label:'Timetable & cover',href:timetableHref,matches:[...(canUseTimetable?[route('/leadership/timetable')]:[]),...(canUseCover?[route('/leadership/cover')]:[])]}]:[]),
   ...(canUseAvailability?[{label:'Staff availability',href:'/leadership/staff/availability'}]:[]),
   ...(canUseStaffRequests?[{label:'Staff requests',href:'/leadership/staff/requests'}]:[]),
   ...(canUseLearning||canUseLearningEvidence?[{label:'Learning',href:learningHref,matches:[...(canUseLearning?[route('/leadership/learning')]:[]),...(canUseLearningEvidence?[route('/leadership/learning/evidence')]:[])]}]:[]),
   ...(canUseAssessmentReadiness||canUseAssessmentPublication?[{label:'Assessments',href:assessmentHref,matches:[...(canUseAssessmentReadiness?[route('/leadership/assessments')]:[]),...(canUseAssessmentPublication?[route('/leadership/assessments/publications')]:[])]}]:[]),
  ]},
  {id:'principal-communication',label:'Communication',icon:'mail',collapsible:true,items:[
   ...(canUseCommunication?[{label:'Notice coverage',href:'/leadership/communication'}]:[]),
   ...(canReviewNotices?[{label:'Notice reviews',href:'/leadership/notices/review'}]:[]),
   ...(canUseFamilyConcerns?[{label:'Family concerns',href:'/leadership/concerns'}]:[]),
   ...(canUseMeetings?[{label:'Meetings',href:'/leadership/meetings'}]:[]),
  ]},
  {id:'principal-work',label:'My work',icon:'activity',collapsible:true,items:[
   ...(canUseDecisions?[{label:'My decisions',href:'/leadership/decisions',matches:[route('/leadership/decisions')]}]:[]),
   ...(canUseCoordination?[{label:'Follow-ups',href:'/leadership/coordination',matches:[route('/leadership/coordination')]}]:[]),
   ...(canUseHandover?[{label:'Handover',href:'/leadership/handover'}]:[]),
  ]},
  {id:'principal-reports',label:'Reports & insights',icon:'report',collapsible:true,items:[
   ...(canUseReports?[{label:'Reports',href:'/leadership/reports',matches:[route('/leadership/reports'),route('/leadership/briefs'),route('/leadership/reviews')]}]:[]),
   ...(canUseHistory?[{label:'Decision history',href:'/leadership/history'}]:[]),
   ...(canUseAssistant?[{label:'Evidence assistant',href:'/leadership/assistant'}]:[]),
  ]},
  {id:'principal-conditional',label:'Conditional areas',showLabel:false,items:[
   ...(canUseFinance?[{label:'Financial exceptions',href:'/leadership/finance/exceptions',icon:'report' as const}]:[]),
   ...(canUseFacilities?[{label:'Facilities incidents',href:'/leadership/services/incidents',icon:'activity' as const}]:[]),
   ...(canUseSupport?[{label:'Restricted support',href:'/leadership/support',icon:'people' as const}]:[]),
  ]},
  {id:'principal-utilities',label:'Utilities',items:[...(home.actingDelegation?[{label:'My acting access',href:'/leadership/delegations',icon:'activity' as const}]:[]),{label:'My account',href:'/leadership/account',icon:'account'}]},
 ];
 return groups.filter(group=>group.items.length>0);
}
