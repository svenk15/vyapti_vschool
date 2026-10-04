import {describe,expect,it} from 'vitest';
import {civilDate,code,name,validateRange,validateTerms} from '../../backend/modules/academics/domain/setup';
import {capabilityReleaseManifest,releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';

describe('academic setup domain',()=>{
 it('validates real Gregorian civil dates without local timezone conversion',()=>{
  expect(civilDate('2028-02-29')).toBe('2028-02-29');expect(()=>civilDate('2027-02-29')).toThrow();expect(()=>validateRange('2026-04-01','2026-04-01')).toThrow();
 });
 it('normalizes bounded codes and names at the API boundary',()=>{
  expect(code('  t1 ')).toBe('T1');expect(name('  Grade 8  ')).toBe('Grade 8');expect(()=>code('grade 8')).toThrow();expect(()=>name('x\nunsafe')).toThrow();
 });
 it('accepts adjacent half-open terms, rejects overlap and limits terms to 24',()=>{
  const year={startsOn:'2026-04-01',endsOn:'2027-04-01'},adjacent=[{code:'T1',name:'Term 1',startsOn:'2026-04-01',endsOn:'2026-10-01'},{code:'T2',name:'Term 2',startsOn:'2026-10-01',endsOn:'2027-04-01'}];
  expect(validateTerms(adjacent,year)).toHaveLength(2);expect(()=>validateTerms([{...adjacent[0]!,endsOn:'2026-10-02'},adjacent[1]!],year)).toThrow();expect(()=>validateTerms(Array.from({length:25},(_,i)=>({code:`T${i}`,name:`Term ${i}`,startsOn:'2026-04-01',endsOn:'2026-05-01'})),year)).toThrow();
 });
});

describe('trusted module release configuration',()=>{
 it('defaults deny-all and accepts only explicit server module IDs',()=>{
  expect(Object.values(capabilityReleaseManifest()).some(Boolean)).toBe(false);expect(capabilityReleaseManifest(releasedModuleIds('academic_core')).academic_core).toBe(true);expect(capabilityReleaseManifest(releasedModuleIds('academic_core')).attendance).toBe(false);
  expect(()=>releasedModuleIds('unknown')).toThrow('INVALID_RELEASE_MANIFEST');expect(()=>releasedModuleIds('academic_core,academic_core')).toThrow('INVALID_RELEASE_MANIFEST');
 });
});
