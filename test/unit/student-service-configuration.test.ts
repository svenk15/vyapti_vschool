import {afterEach,beforeEach,describe,expect,it} from 'vitest';
import {validateStudentsServiceConfiguration} from '../../backend/composition/students';

describe('students composition configuration',()=>{
 const previousSecret=process.env.NEXTAUTH_SECRET,previousModules=process.env.VSCHOOL_RELEASED_MODULES;
 beforeEach(()=>{process.env.NEXTAUTH_SECRET='environment-secret-must-not-be-used';process.env.VSCHOOL_RELEASED_MODULES='attendance';});
 afterEach(()=>{if(previousSecret===undefined)delete process.env.NEXTAUTH_SECRET;else process.env.NEXTAUTH_SECRET=previousSecret;if(previousModules===undefined)delete process.env.VSCHOOL_RELEASED_MODULES;else process.env.VSCHOOL_RELEASED_MODULES=previousModules;});

 it('uses only the explicitly injected secret, release manifest and clock',()=>{
  const now=()=>new Date('2026-10-09T00:00:00.000Z'),config={databaseUrl:'postgresql://local.invalid/vschool',cursorSecret:'explicit-student-cursor-secret-32-bytes',releasedModules:['student_core'] as const,now};
  expect(validateStudentsServiceConfiguration(config)).toBe(config);
  expect(config.releasedModules).toEqual(['student_core']);
  expect(config.cursorSecret).toBe('explicit-student-cursor-secret-32-bytes');
  expect(config.now()).toEqual(new Date('2026-10-09T00:00:00.000Z'));
 });

 it.each(['','short','                                '])('fails closed for an unusable cursor secret',cursorSecret=>{
  expect(()=>validateStudentsServiceConfiguration({databaseUrl:'postgresql://local.invalid/vschool',cursorSecret,releasedModules:['student_core']})).toThrow(expect.objectContaining({code:'UNAVAILABLE'}));
 });

 it('fails closed when the hosting layer supplies no database URL',()=>{
  expect(()=>validateStudentsServiceConfiguration({databaseUrl:'',cursorSecret:'explicit-student-cursor-secret-32-bytes',releasedModules:['student_core']})).toThrow(expect.objectContaining({code:'UNAVAILABLE'}));
 });

 it('fails closed for a runtime-invalid release manifest',()=>{
  expect(()=>validateStudentsServiceConfiguration({databaseUrl:'postgresql://local.invalid/vschool',cursorSecret:'explicit-student-cursor-secret-32-bytes',releasedModules:['not-a-module'] as never})).toThrow(expect.objectContaining({code:'UNAVAILABLE'}));
 });
});
