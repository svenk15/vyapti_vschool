import {describe,expect,it,vi} from 'vitest';
import {availabilityInput,availabilityState} from '../../backend/modules/people/domain/availability';
import {createPeopleAvailabilityUseCases,type PeopleAvailabilityRepository} from '../../backend/modules/people/application/availability';

const ids=['00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000005'];
describe('operational availability rules',()=>{
 it('normalizes an authoritative bounded interval without accepting unknown or a private narrative field',()=>{
  expect(availabilityInput({employeeId:ids[3],expectedVersion:0,state:'UNAVAILABLE',startsAt:'2026-10-18T03:00:00Z',endsAt:'2026-10-18T07:00:00Z',timezone:' Asia/Kolkata ',sourceKind:'OPERATIONAL',sourceReference:'  roster desk confirmation  ',key:ids[4]})).toMatchObject({timezone:'Asia/Kolkata',sourceReference:'roster desk confirmation'});
  expect(()=>availabilityInput({employeeId:ids[3],expectedVersion:0,state:'UNKNOWN' as never,startsAt:'2026-10-18T03:00:00Z',endsAt:'2026-10-18T07:00:00Z',timezone:'Asia/Kolkata',sourceKind:'OPERATIONAL',sourceReference:'reference',key:ids[4]})).toThrow('VALIDATION');
  expect(()=>availabilityInput({employeeId:ids[3],expectedVersion:0,state:'AVAILABLE',startsAt:'2026-10-18T03:00:00Z',endsAt:'2026-12-18T07:00:00Z',timezone:'Asia/Kolkata',sourceKind:'OPERATIONAL',sourceReference:'reference',key:ids[4]})).toThrow('VALIDATION');
 });
 it('uses unavailable precedence and never treats missing evidence as free',()=>{expect(availabilityState([])).toBe('UNKNOWN');expect(availabilityState([{state:'AVAILABLE'}])).toBe('AVAILABLE');expect(availabilityState([{state:'AVAILABLE'},{state:'UNAVAILABLE'}])).toBe('UNAVAILABLE');});
 it('requires an interval id exactly for revisions',()=>{const repository={record:vi.fn()} as unknown as PeopleAvailabilityRepository,service=createPeopleAvailabilityUseCases(repository),identity={accountId:ids[0],tokenVersion:1},base={employeeId:ids[3],state:'AVAILABLE',startsAt:'2026-10-18T03:00:00Z',endsAt:'2026-10-18T07:00:00Z',timezone:'Asia/Kolkata',sourceKind:'OPERATIONAL',sourceReference:'reference',key:ids[4]};expect(()=>service.record(identity,ids[1],ids[2],{...base,expectedVersion:1})).toThrow('VALIDATION');expect(()=>service.record(identity,ids[1],ids[2],{...base,intervalId:ids[4],expectedVersion:0})).toThrow('VALIDATION');});
 it('rejects a calendar-normalized school date',()=>{const repository={leadership:vi.fn()} as unknown as PeopleAvailabilityRepository,service=createPeopleAvailabilityUseCases(repository),identity={accountId:ids[0],tokenVersion:1};expect(()=>service.leadership(identity,ids[1],ids[2],'2026-02-31')).toThrow('VALIDATION');});
});
