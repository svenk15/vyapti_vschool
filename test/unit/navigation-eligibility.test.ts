import {describe,expect,it,vi} from 'vitest';
import {memoizeModuleCapability} from '../../lib/server/navigation-eligibility';

describe('navigation module eligibility memoization',()=>{
 it('keeps capability checks independent within the same module',async()=>{
  const check=vi.fn(async(_moduleId:string,permission:string)=>permission==='student.read');
  const canUse=memoizeModuleCapability(check);

  await expect(canUse('student_core','student.read')).resolves.toBe(true);
  await expect(canUse('student_core','student.manage')).resolves.toBe(false);
  await expect(canUse('student_core','student.read')).resolves.toBe(true);

  expect(check).toHaveBeenCalledTimes(2);
  expect(check).toHaveBeenNthCalledWith(1,'student_core','student.read');
  expect(check).toHaveBeenNthCalledWith(2,'student_core','student.manage');
 });
});
