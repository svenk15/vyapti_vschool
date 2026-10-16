import {describe,expect,it} from 'vitest';
import {civilDate,code,name,validateRange,validateTerms} from '../../backend/modules/academics/domain/setup';
import {capabilityReleaseManifest,releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {calendarExceptions,evaluateCalendar,weekdays} from '../../backend/modules/academics/domain/calendar';
import {createAcademicSetupUseCases,type AcademicSetupRepository} from '../../backend/modules/academics/application/setup';
import {randomUUID} from 'node:crypto';

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

describe('academic calendar policy',()=>{
 const year={startsOn:'2026-04-01',endsOn:'2027-04-01'},campus='00000000-0000-4000-8000-000000000001';
 it('applies campus, school and weekly precedence and keeps civil date boundaries',()=>{
  const exceptions=calendarExceptions([{date:'2026-10-02',campusId:null,isTeachingDay:false,label:'School holiday'},{date:'2026-10-02',campusId:campus,isTeachingDay:true,label:'Campus event'}],year),base={year,revisionId:'rev',revisionNumber:1,teachingWeekdays:[1,2,3,4,5],exceptions};
  expect(evaluateCalendar({...base,date:'2026-10-02',campusId:campus})).toMatchObject({isTeachingDay:true,source:'CAMPUS_EXCEPTION',label:'Campus event'});
  expect(evaluateCalendar({...base,date:'2026-10-02',campusId:null})).toMatchObject({isTeachingDay:false,source:'SCHOOL_EXCEPTION'});
  expect(evaluateCalendar({...base,date:'2026-10-05',campusId:null})).toMatchObject({isTeachingDay:true,source:'WEEKLY_RULE'});
  expect(()=>evaluateCalendar({...base,date:'2027-04-01',campusId:null})).toThrow();
 });
 it('requires unique weekdays and unique in-year exception scope',()=>{
  expect(weekdays([5,1,2])).toEqual([1,2,5]);expect(()=>weekdays([])).toThrow();expect(()=>weekdays([1,1])).toThrow();
  expect(()=>calendarExceptions([{date:'2026-10-02',campusId:null,isTeachingDay:false,label:'One'},{date:'2026-10-02',campusId:null,isTeachingDay:false,label:'Two'}],year)).toThrow();
  expect(()=>calendarExceptions([{date:'2027-04-01',campusId:null,isTeachingDay:false,label:'Out of year'}],year)).toThrow();
 });
});

describe('trusted module release configuration',()=>{
 it('defaults deny-all and accepts only explicit server module IDs',()=>{
  expect(Object.values(capabilityReleaseManifest()).some(Boolean)).toBe(false);expect(capabilityReleaseManifest(releasedModuleIds('academic_core')).academic_core).toBe(true);expect(capabilityReleaseManifest(releasedModuleIds('academic_core')).attendance).toBe(false);
  expect(()=>releasedModuleIds('unknown')).toThrow('INVALID_RELEASE_MANIFEST');expect(()=>releasedModuleIds('academic_core,academic_core')).toThrow('INVALID_RELEASE_MANIFEST');
 });
});

describe('academic catalog retirement input',()=>{
 it('validates type, identity, version and reason before delegating the normalized command',async()=>{
  const accountId=randomUUID(),organizationId=randomUUID(),schoolId=randomUUID(),id=randomUUID(),key=randomUUID(),calls:unknown[]=[];
  const repository={retireCatalogItem:async(...args:unknown[])=>{calls.push(args);return {id,type:'subject' as const,version:2,active:false,retiredSections:0,retiredOfferings:0,replayed:false};}} as unknown as AcademicSetupRepository;
  const useCases=createAcademicSetupUseCases(repository),identity={accountId,tokenVersion:1};
  await expect(useCases.retireCatalogItem(identity,organizationId,schoolId,'subject',id,{expectedVersion:1,key,reason:'  Retire unused subject  '})).resolves.toMatchObject({id,active:false});
  expect(calls[0]).toEqual([identity,organizationId,schoolId,'subject',id,{expectedVersion:1,key,reason:'Retire unused subject'}]);
  expect(()=>useCases.retireCatalogItem(identity,organizationId,schoolId,'course',id,{expectedVersion:1,key,reason:'Valid reason'})).toThrow();
  expect(()=>useCases.retireCatalogItem(identity,organizationId,schoolId,'subject',id,{expectedVersion:0,key,reason:'Valid reason'})).toThrow();
  expect(()=>useCases.retireCatalogItem(identity,organizationId,schoolId,'subject',id,{expectedVersion:1,key,reason:'no'})).toThrow();
 });
});
