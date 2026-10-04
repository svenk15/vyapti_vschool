import {describe,expect,it,vi} from 'vitest';
import {employeeInput,displayName} from '../../backend/modules/people/domain/employee';
import {createPeopleUseCases,type PeopleRepository} from '../../backend/modules/people/application/employees';

describe('employee profile rules',()=>{
 it('normalizes bounded names and validates optional contact and civil dates',()=>{
  expect(employeeInput({firstName:'  Áda ',lastName:' Lovelace ',contactEmail:' ada@example.org ',staffNumber:' P-104 ',employedFrom:'2028-02-29'})).toEqual({firstName:'Áda',lastName:'Lovelace',contactEmail:'ada@example.org',staffNumber:'P-104',employedFrom:'2028-02-29'});
  expect(displayName('Grace','')).toBe('Grace');expect(()=>employeeInput({firstName:'',staffNumber:'1',employedFrom:'2026-01-01'})).toThrow();expect(()=>employeeInput({firstName:'Grace',staffNumber:'1',employedFrom:'2027-02-29'})).toThrow();expect(()=>employeeInput({firstName:'Grace',contactEmail:'not-an-email',staffNumber:'1',employedFrom:'2026-01-01'})).toThrow();
 });
 it('bounds employee search pagination and preserves an opaque cursor',async()=>{
  const listEmployees=vi.fn(async()=>({employees:[],nextCursor:null})),repository={listEmployees,createEmployee:vi.fn()} as unknown as PeopleRepository,service=createPeopleUseCases(repository),identity={accountId:'00000000-0000-4000-8000-000000000001',tokenVersion:1},organization='00000000-0000-4000-8000-000000000002',school='00000000-0000-4000-8000-000000000003';
  await service.workspace(identity,organization,school,{search:' Ada ',limit:'25',cursor:'signed-token'});expect(listEmployees).toHaveBeenCalledWith(identity,organization,school,{search:'Ada',limit:25,cursor:'signed-token'});
  expect(()=>service.workspace(identity,organization,school,{limit:101})).toThrow('VALIDATION');expect(()=>service.workspace(identity,organization,school,{cursor:'x'.repeat(2049)})).toThrow('INVALID_CURSOR');
 });
});
