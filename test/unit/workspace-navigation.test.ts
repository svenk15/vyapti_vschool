import {describe,expect,it} from 'vitest';
import {familyNavigationCatalogue,familyNavigationRouteGroups,studentNavigationCatalogue,studentNavigationRouteGroups,teacherNavigationGroups} from '../../components/workspace-navigation';

const labels=(catalogue:readonly (readonly [string,string,unknown])[],routes:Set<string>)=>catalogue.filter(([,href])=>routes.has(href)).map(([label])=>label);

describe('workspace navigation grouping',()=>{
 it('uses static Teacher groups and preserves every authorized destination',()=>{
  const groups=teacherNavigationGroups({canUseClasses:true,canUseTimetable:true,canUseCover:true,canUseMeetings:true,canUseSupport:true,canUseHistory:true,canUseLearning:true,canUseAssessments:true});
  expect(groups.map(group=>group.label)).toEqual(['My day','Teaching','Learning','My work','Account']);
  expect(groups.every(group=>group.collapsible===false)).toBe(true);
  expect(groups.map(group=>group.sectionBreakBefore??false)).toEqual([false,true,true,true,true]);
  expect(groups.flatMap(group=>group.items.map(item=>item.href))).toEqual(['/teacher/today','/teacher/classes','/teacher/timetable','/teacher/history','/teacher/learning','/teacher/assessments','/teacher/cover','/teacher/meetings','/teacher/support','/account']);
 });

 it('maps Student and Parent destinations without changing route identity',()=>{
  expect(labels(studentNavigationCatalogue,studentNavigationRouteGroups.learning)).toEqual(['My classes','Assignments','Results']);
  expect(labels(studentNavigationCatalogue,studentNavigationRouteGroups.schoolLife)).toEqual(['My timetable','School calendar','Attendance','Notices']);
  expect(labels(studentNavigationCatalogue,studentNavigationRouteGroups.personal)).toEqual(['My profile','My account']);
  expect(labels(familyNavigationCatalogue,familyNavigationRouteGroups.learning)).toEqual(['Assignments','Results']);
  expect(labels(familyNavigationCatalogue,familyNavigationRouteGroups.schoolDay)).toEqual(['Attendance',"Child's timetable",'School calendar']);
  expect(labels(familyNavigationCatalogue,familyNavigationRouteGroups.communication)).toEqual(['Notices','Concerns','Meetings']);
 });
});
