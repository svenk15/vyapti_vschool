import {describe,expect,it,vi} from 'vitest';
import {employeeInput,displayName} from '../../backend/modules/people/domain/employee';
import {createPeopleUseCases,type PeopleRepository} from '../../backend/modules/people/application/employees';
import {createPersonIdentityUseCases} from '../../backend/modules/people/application/person-identity';
import type {PersonIdentityRepository} from '../../backend/modules/people/contracts/person-identity';

describe('employee profile rules',()=>{
 it('normalizes bounded names and validates optional contact and civil dates',()=>{
  expect(employeeInput({firstName:'  Áda ',lastName:' Lovelace ',contactEmail:' ada@example.org ',staffNumber:' P-104 ',category:'TEACHING',employedFrom:'2028-02-29'})).toEqual({firstName:'Áda',lastName:'Lovelace',contactEmail:'ada@example.org',staffNumber:'P-104',category:'TEACHING',employedFrom:'2028-02-29'});
  expect(displayName('Grace','')).toBe('Grace');expect(()=>employeeInput({firstName:'',staffNumber:'1',category:'SUPPORT',employedFrom:'2026-01-01'})).toThrow();expect(()=>employeeInput({firstName:'Grace',staffNumber:'1',category:'SUPPORT',employedFrom:'2027-02-29'})).toThrow();expect(()=>employeeInput({firstName:'Grace',contactEmail:'not-an-email',staffNumber:'1',category:'SUPPORT',employedFrom:'2026-01-01'})).toThrow();expect(()=>employeeInput({firstName:'Grace',staffNumber:'1',category:'UNCLASSIFIED',employedFrom:'2026-01-01'})).toThrow();
 });
 it('bounds employee search pagination and preserves an opaque cursor',async()=>{
  const listEmployees=vi.fn(async()=>({employees:[],nextCursor:null})),repository={listEmployees,createEmployee:vi.fn()} as unknown as PeopleRepository,service=createPeopleUseCases(repository),identity={accountId:'00000000-0000-4000-8000-000000000001',tokenVersion:1},organization='00000000-0000-4000-8000-000000000002',school='00000000-0000-4000-8000-000000000003';
  await service.workspace(identity,organization,school,{search:' Ada ',by:'employeeCode',category:'SUPPORT',employment:'ACTIVE',sort:'employment',order:'desc',limit:'25',cursor:'signed-token'});expect(listEmployees).toHaveBeenCalledWith(identity,organization,school,{search:'Ada',by:'employeeCode',category:'SUPPORT',employment:'ACTIVE',categories:['SUPPORT'],employments:['ACTIVE'],sort:'employment',order:'desc',limit:25,cursor:'signed-token'});
  await service.workspace(identity,organization,school);expect(listEmployees).toHaveBeenLastCalledWith(identity,organization,school,{search:'',by:'name',category:'ANY',employment:'ANY',categories:[],employments:[],sort:'name',order:'asc',limit:50,cursor:null});
  expect(()=>service.workspace(identity,organization,school,{limit:101})).toThrow('VALIDATION');expect(()=>service.workspace(identity,organization,school,{cursor:'x'.repeat(2049)})).toThrow('INVALID_CURSOR');
  expect(()=>service.workspace(identity,organization,school,{sort:'teaching'})).toThrow('VALIDATION');expect(()=>service.workspace(identity,organization,school,{category:'OTHER'})).toThrow('VALIDATION');
 });
 it('validates category corrections before invoking persistence',async()=>{
  const updateCategory=vi.fn(async()=>({category:'SUPPORT'})),repository={updateCategory} as unknown as PeopleRepository,service=createPeopleUseCases(repository),identity={accountId:'00000000-0000-4000-8000-000000000001',tokenVersion:1},organization='00000000-0000-4000-8000-000000000002',school='00000000-0000-4000-8000-000000000003',employee='00000000-0000-4000-8000-000000000004',key='00000000-0000-4000-8000-000000000005';
  await service.updateCategory(identity,organization,school,employee,{expectedVersion:1,category:'SUPPORT',reason:' Correct category ',key});
  expect(updateCategory).toHaveBeenCalledWith(identity,organization,school,employee,{expectedVersion:1,category:'SUPPORT',reason:'Correct category',key});
  expect(()=>service.updateCategory(identity,organization,school,employee,{expectedVersion:1,category:'UNCLASSIFIED',reason:'Correct category',key})).toThrow('VALIDATION');
 });
});

describe('person name correction rules',()=>{
 it('normalizes the owned name and reason before invoking persistence',async()=>{
  const correctName=vi.fn(async()=>({personVersion:2,revisionId:'00000000-0000-4000-8000-000000000009'})),repository={correctName} as unknown as PersonIdentityRepository,service=createPersonIdentityUseCases(repository),transaction={};
  await service.correctName(transaction,{organizationId:'00000000-0000-4000-8000-000000000001',schoolId:'00000000-0000-4000-8000-000000000002',personId:'00000000-0000-4000-8000-000000000003',actorAccountId:'00000000-0000-4000-8000-000000000004',expectedVersion:1,firstName:'  Áda ',lastName:' Lovelace ',reason:'  Correct spelling  '});
  expect(correctName).toHaveBeenCalledWith(transaction,expect.objectContaining({firstName:'Áda',lastName:'Lovelace',reason:'Correct spelling',expectedVersion:1}));
  expect(()=>service.correctName(transaction,{organizationId:'bad',schoolId:'bad',personId:'bad',actorAccountId:'bad',expectedVersion:0,firstName:'',reason:'no'})).toThrow('VALIDATION');
 });
});
