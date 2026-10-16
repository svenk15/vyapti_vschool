import {afterEach,beforeEach,describe,expect,it} from 'vitest';
import {validateAcademicServiceConfiguration} from '../../backend/composition/academics';

describe('academics composition configuration',()=>{
 const previous=process.env.VSCHOOL_RELEASED_MODULES;
 beforeEach(()=>{process.env.VSCHOOL_RELEASED_MODULES='attendance';});
 afterEach(()=>{if(previous===undefined)delete process.env.VSCHOOL_RELEASED_MODULES;else process.env.VSCHOOL_RELEASED_MODULES=previous;});

 it('uses the explicitly injected release manifest and clock',()=>{
  const now=()=>new Date('2026-10-10T00:00:00.000Z'),config={databaseUrl:'postgresql://local.invalid/vschool',releasedModules:['academic_core'] as const,now};
  expect(validateAcademicServiceConfiguration(config)).toBe(config);
  expect(config.releasedModules).toEqual(['academic_core']);
  expect(config.now()).toEqual(new Date('2026-10-10T00:00:00.000Z'));
 });

 it('fails closed without a database URL or with an invalid release manifest',()=>{
  expect(()=>validateAcademicServiceConfiguration({databaseUrl:'',releasedModules:['academic_core']})).toThrow(expect.objectContaining({code:'UNAVAILABLE'}));
  expect(()=>validateAcademicServiceConfiguration({databaseUrl:'postgresql://local.invalid/vschool',releasedModules:['not-a-module'] as never})).toThrow(expect.objectContaining({code:'UNAVAILABLE'}));
 });
});
