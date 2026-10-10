import {describe,expect,it} from 'vitest';
import {responsibleRoleForSetup,setupResponsibleRoleLabel} from '../../backend/modules/reporting/domain/setup-responsibility';
import type {SchoolReadinessItemId} from '../../shared/contracts/reporting';

describe('Phase 1 setup responsibility',()=>{
 it('maps every supported setup operation from accepted authority',()=>{
  const operations:SchoolReadinessItemId[]=['school','academics','staff','students','attendance'];
  expect(operations.map(responsibleRoleForSetup)).toEqual(operations.map(()=>'SCHOOL_ADMIN'));
 });
 it('labels an undefined operation honestly and never invents a person',()=>{
  expect(responsibleRoleForSetup('future' as SchoolReadinessItemId)).toBeNull();
  expect(setupResponsibleRoleLabel(null)).toBe('No responsible role defined');
 });
});
