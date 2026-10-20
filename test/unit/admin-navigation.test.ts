import {describe,expect,it,vi} from 'vitest';
vi.mock('server-only',()=>({}));
import {composeAdminNavigation,type AdminNavigationItem} from '../../lib/server/admin-navigation';
import {portalItemMatchSpecificity} from '../../components/portal-navigation-group';

const item=(value:Partial<AdminNavigationItem>&Pick<AdminNavigationItem,'label'|'href'|'area'>):AdminNavigationItem=>({icon:'home',...value});

describe('Administrator navigation composition',()=>{
 it('uses each area preferred authorized destination and keeps nested routes active',()=>{
  const groups=composeAdminNavigation([
   item({label:'Imports',href:'/admin/imports',area:'students'}),
   item({label:'Directory',href:'/admin/students',area:'students'}),
   item({label:'Access',href:'/admin/users',area:'staff'}),
   item({label:'Profiles',href:'/admin/teachers',area:'staff'}),
   item({label:'Report',href:'/admin/reports/attendance',area:'attendance'}),
   item({label:'Registers',href:'/admin/attendance/sessions?view=monitor',area:'attendance',matches:[{path:'/admin/attendance/sessions'}]}),
  ]);
  const primary=groups.find(group=>group.id==='admin-primary')!;
  expect(primary.items.map(entry=>[entry.label,entry.href])).toEqual([
   ['Students','/admin/students'],
   ['Staff','/admin/teachers'],
   ['Attendance','/admin/attendance/sessions?view=monitor'],
  ]);
  expect(portalItemMatchSpecificity('/admin/students/register',primary.items[0])).toBeGreaterThan(-1);
  expect(portalItemMatchSpecificity('/admin/attendance/sessions/one',primary.items[2])).toBeGreaterThan(-1);
 });

 it('falls back, omits empty areas and suppresses empty conditional groups',()=>{
  const groups=composeAdminNavigation([
   item({label:'Imports',href:'/admin/imports',area:'students'}),
   item({label:'Classes & subjects',href:'/admin/academics',area:'academics'}),
   item({label:'School details',href:'/admin/school',area:'settings'}),
  ]);
  expect(groups.map(group=>group.id)).toEqual(['admin-primary','admin-utility']);
  expect(groups[0].items.map(entry=>[entry.label,entry.href])).toEqual([
   ['Students','/admin/imports'],
   ['Academics','/admin/academics'],
  ]);
  expect(groups[1].items[0].href).toBe('/admin/school');
 });

 it('keeps authorized conditional services separate from the six primary areas',()=>{
  const groups=composeAdminNavigation([
   item({label:'Today',href:'/admin',area:'today',matches:[{path:'/admin',exact:true}]}),
   item({label:'Facilities',href:'/admin/services/incidents',area:'services',icon:'activity'}),
  ]);
  expect(groups.find(group=>group.id==='admin-primary')?.items.map(entry=>entry.label)).toEqual(['Today']);
  expect(groups.find(group=>group.id==='admin-services')?.items.map(entry=>entry.label)).toEqual(['Facilities']);
 });

 it('selects the accepted preferred route for all six areas and the Settings utility',()=>{
  const groups=composeAdminNavigation([
   item({label:'Requests',href:'/admin/requests',area:'today'}),
   item({label:'Today',href:'/admin',area:'today',matches:[{path:'/admin',exact:true}]}),
   item({label:'Admissions',href:'/admin/admissions',area:'students'}),
   item({label:'Profiles',href:'/admin/teachers',area:'staff'}),
   item({label:'Access',href:'/admin/users',area:'staff'}),
   item({label:'Report',href:'/admin/reports/attendance',area:'attendance'}),
   item({label:'Registers',href:'/admin/attendance/sessions?view=monitor',area:'attendance',matches:[{path:'/admin/attendance/sessions'}]}),
   item({label:'Classes & subjects',href:'/admin/academics',area:'academics'}),
   item({label:'Timetable',href:'/admin/timetable',area:'academics'}),
   item({label:'Calendar',href:'/admin/events',area:'communication'}),
   item({label:'Notices',href:'/admin/communication',area:'communication'}),
   item({label:'School details',href:'/admin/school',area:'settings'}),
   item({label:'School setup',href:'/admin/setup',area:'settings'}),
  ]);
  expect(groups.find(group=>group.id==='admin-primary')?.items.map(entry=>[entry.label,entry.href])).toEqual([
   ['Today','/admin'],['Students','/admin/admissions'],['Staff','/admin/teachers'],['Attendance','/admin/attendance/sessions?view=monitor'],['Academics','/admin/timetable'],['Communication','/admin/communication'],
  ]);
  expect(groups.find(group=>group.id==='admin-utility')?.items[0].href).toBe('/admin/setup');
 });

 it('keeps profile-only Staff and academics-without-Timetable reachable by fallback',()=>{
  const groups=composeAdminNavigation([
   item({label:'Profiles',href:'/admin/teachers',area:'staff'}),
   item({label:'Classes & subjects',href:'/admin/academics',area:'academics'}),
  ]);
  expect(groups[0].items.map(entry=>[entry.label,entry.href])).toEqual([
   ['Staff','/admin/teachers'],['Academics','/admin/academics'],
  ]);
 });
});
