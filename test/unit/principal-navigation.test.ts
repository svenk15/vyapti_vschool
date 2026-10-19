import {describe,expect,it} from 'vitest';
import type {AdminHome} from '../../shared/contracts/access';
import {principalNavigationGroups} from '../../components/principal-navigation';
import {portalItemMatchSpecificity} from '../../components/portal-navigation-group';

const home:AdminHome={accountId:'10000000-0000-4000-8000-000000000001',membershipId:'10000000-0000-4000-8000-000000000002',scope:{organizationId:'10000000-0000-4000-8000-000000000003',schoolId:'10000000-0000-4000-8000-000000000004'},institutionName:'Synthetic Trust',schoolName:'Synthetic School',schoolCode:'MAIN',timezone:'Asia/Kolkata',capabilities:['leadership.read']};
const frame=(input:Record<string,boolean>={})=>principalNavigationGroups({home,...input});
const labels=(groups:ReturnType<typeof frame>)=>groups.map(group=>[group.label,...group.items.map(item=>item.label)]);
const active=(groups:ReturnType<typeof frame>,pathname:string)=>groups.flatMap(group=>group.items).map(item=>({label:item.label,specificity:portalItemMatchSpecificity(pathname,item)})).filter(item=>item.specificity>=0).sort((a,b)=>b.specificity-a.specificity)[0]?.label;

describe('Principal navigation catalogue',()=>{
 it('hides empty groups and preserves the small authorized utility set',()=>{
  expect(labels(frame())).toEqual([['Principal home','My day'],['Account & access','My account']]);
 });

 it('groups the fully authorized catalogue and points area entries at the first authorized child',()=>{
  const groups=frame({canUseAttendance:true,canUsePupilAttendance:true,canUseExplanations:true,canUseCorrectionRequests:true,canUseAvailability:true,canUseStaffRequests:true,canUseFamilyConcerns:true,canUseMeetings:true,canUseSupport:true,canUseFacilities:true,canUseFinance:true,canUseAssistant:true,canUseCoordination:true,canUseHandover:true,canUseHistory:true,canUseDecisions:true,canUseTimetable:true,canUseCover:true,canUseLearning:true,canUseLearningEvidence:true,canUseAssessmentReadiness:true,canUseAssessmentPublication:true,canUseCommunication:true,canReviewNotices:true,canUseReports:true});
  expect(labels(groups)).toEqual([
   ['Principal home','My day'],
   ['Attendance','Register coverage','Pupil attendance','Explanations','Correction requests'],
   ['Teaching & staff','Timetable & cover','Staff availability','Staff requests','Learning','Assessments'],
   ['Communication','Notice coverage','Notice reviews','Family concerns','Meetings'],
   ['My work','My decisions','Follow-ups','Handover'],
   ['Reports & insights','Reports','Decision history','Evidence assistant'],
   ['School operations','Financial exceptions','Facilities incidents','Restricted support'],
   ['Account & access','My account'],
  ]);
  expect(groups.find(group=>group.label==='Teaching & staff')?.items.find(item=>item.label==='Timetable & cover')?.href).toBe('/leadership/timetable');
  expect(groups.find(group=>group.label==='Teaching & staff')?.items.find(item=>item.label==='Assessments')?.href).toBe('/leadership/assessments');
 });

 it('uses the first authorized alternate when an area overview is unavailable',()=>{
  const teaching=frame({canUseCover:true,canUseAssessmentPublication:true}).find(group=>group.label==='Teaching & staff');
  expect(teaching?.items).toMatchObject([{label:'Timetable & cover',href:'/leadership/cover'},{label:'Assessments',href:'/leadership/assessments/publications'}]);
 });

 it('assigns child routes to the most specific approved area',()=>{
  const groups=frame({canUseAttendance:true,canUsePupilAttendance:true,canUseExplanations:true,canUseCorrectionRequests:true,canUseCoordination:true,canUseDecisions:true,canUseLearning:true,canUseReports:true});
  expect(active(groups,'/leadership/attendance/pupils/example')).toBe('Pupil attendance');
  expect(active(groups,'/leadership/attendance/explanations/example')).toBe('Explanations');
  expect(active(groups,'/leadership/attendance/sessions/example')).toBe('Register coverage');
  expect(active(groups,'/leadership/learning/feedback/follow-up/new')).toBe('Learning');
  expect(active(groups,'/leadership/briefs/example/edit')).toBe('Reports');
  expect(active(groups,'/leadership/coordination/example')).toBe('Follow-ups');
  expect(active(groups,'/leadership/decisions/finance/example')).toBe('My decisions');
 });
});
