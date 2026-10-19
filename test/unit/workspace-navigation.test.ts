import {describe,expect,it} from 'vitest';
import {adminNavigationSections,familyNavigationCatalogue,familyNavigationRouteGroups,studentNavigationCatalogue,studentNavigationRouteGroups,teacherNavigationGroups} from '../../components/workspace-navigation';

const labels=(catalogue:readonly (readonly [string,string,unknown])[],routes:Set<string>)=>catalogue.filter(([,href])=>routes.has(href)).map(([label])=>label);

describe('workspace navigation grouping',()=>{
 it('keeps Administrator routes once in the approved presentation groups',()=>{
  const routes=adminNavigationSections.flatMap(group=>group.hrefs);
  expect(new Set(routes).size).toBe(routes.length);
  expect(adminNavigationSections.find(group=>group.id==='admin-primary')?.hrefs).toEqual(['/admin']);
  expect(adminNavigationSections.find(group=>group.id==='people')?.hrefs).toEqual(['/admin/students','/admin/teachers','/admin/users','/admin/admissions']);
  expect(adminNavigationSections.find(group=>group.id==='attendance')?.hrefs).toEqual(['/admin/attendance/sessions']);
  expect(adminNavigationSections.find(group=>group.id==='communication')?.hrefs).toContain('/admin/events');
  expect(adminNavigationSections.find(group=>group.id==='school-administration')?.hrefs).toEqual(['/admin/setup','/admin/school','/admin/modules','/admin/branding','/admin/imports','/admin/activity']);
 });

 it('uses static Teacher groups and preserves every authorized destination',()=>{
  const groups=teacherNavigationGroups({canUseClasses:true,canUseTimetable:true,canUseCover:true,canUseMeetings:true,canUseSupport:true,canUseHistory:true,canUseLearning:true,canUseAssessments:true});
  expect(groups.map(group=>group.label)).toEqual(['My day','Teaching','Learning','My work','Account']);
  expect(groups.every(group=>group.collapsible===false)).toBe(true);
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
