import {describe,expect,it} from 'vitest';
import {FAMILY_PURPOSES} from '../../backend/modules/guardians/domain/policy';
import {BASE_STUDENT_PORTAL_PURPOSES} from '../../backend/modules/students/domain/portal-policy';

describe('attendance correction request purpose provisioning',()=>{
 it('keeps correction authority outside default Guardian and Student access bundles',()=>{
  expect(FAMILY_PURPOSES).toEqual(['child.summary.read','attendance.read_child','timetable.read_child']);
  expect(FAMILY_PURPOSES).not.toContain('attendance.correction.request_child');
  expect(BASE_STUDENT_PORTAL_PURPOSES).toEqual(['profile.read_self','attendance.read_self','timetable.read_self']);
  expect(BASE_STUDENT_PORTAL_PURPOSES).not.toContain('attendance.correction.request_self');
 });
});
