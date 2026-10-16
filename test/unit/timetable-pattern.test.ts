import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {createTimetablePatternUseCases,type TimetablePatternRepository} from '../../backend/modules/academics/application/timetable';

const identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID(),academicYearId=randomUUID();
const base={academicYearId,expectedVersion:0,name:' Weekly timetable ',teachingDays:[5,1,3,2,4],periods:[{periodKey:randomUUID(),label:' Period 1 ',kind:'LESSON' as const,startLocal:'09:00',endLocal:'09:40',position:1}],key:randomUUID(),reason:' Save initial pattern '};

describe('TT-01 timetable pattern use cases',()=>{
 it('normalizes a valid weekly pattern before invoking its port',async()=>{let received:unknown;const repository={save:async(...args:unknown[])=>{received=args;return {id:randomUUID(),academicYearId,name:'Weekly timetable',teachingDays:[1,2,3,4,5],state:'DRAFT' as const,version:1,periods:[],replayed:false};}} as unknown as TimetablePatternRepository;await createTimetablePatternUseCases(repository).save(identity,organizationId,schoolId,base);expect(received).toEqual([identity,organizationId,schoolId,{...base,name:'Weekly timetable',teachingDays:[1,2,3,4,5],reason:'Save initial pattern',periods:[{...base.periods[0],label:'Period 1'}]}]);});
 it('rejects overlaps, noncontiguous positions, empty teaching days and invalid keys',()=>{const repository={} as TimetablePatternRepository,useCases=createTimetablePatternUseCases(repository);expect(()=>useCases.save(identity,organizationId,schoolId,{...base,periods:[base.periods[0]!,{periodKey:randomUUID(),label:'Period 2',kind:'LESSON',startLocal:'09:30',endLocal:'10:00',position:2}]})).toThrow('PERIOD_OVERLAP');expect(()=>useCases.save(identity,organizationId,schoolId,{...base,periods:[{...base.periods[0]!,position:2}]})).toThrow('VALIDATION');expect(()=>useCases.save(identity,organizationId,schoolId,{...base,teachingDays:[]})).toThrow('VALIDATION');expect(()=>useCases.save(identity,organizationId,schoolId,{...base,key:'short'})).toThrow('VALIDATION');});
});
