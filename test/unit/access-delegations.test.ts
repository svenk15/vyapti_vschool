import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {leadershipDelegationActions,normalizeDelegationIssue,normalizeDelegationRevoke} from '../../backend/modules/access/domain/delegations';

describe('leadership delegation policy',()=>{
  it('accepts an exact bounded allowlisted window',()=>{
    const value=normalizeDelegationIssue({organizationId:randomUUID(),schoolId:randomUUID(),employeeId:randomUUID(),startsAt:'2026-10-18T03:00:00.000Z',endsAt:'2026-10-20T03:00:00.000Z',actions:['communication.read_leadership','leadership.read','communication.read_leadership'],reason:'Acting cover for the fictional branch',key:randomUUID()});
    expect(value.actions).toEqual(['communication.read_leadership','leadership.read']);
    expect(leadershipDelegationActions).not.toContain('*');
  });
  it.each([
    {startsAt:'2026-10-18T03:00:00.000Z',endsAt:'2026-10-18T03:00:00.000Z',actions:['leadership.read']},
    {startsAt:'2026-10-18T03:00:00.000Z',endsAt:'2026-11-18T03:00:00.001Z',actions:['leadership.read']},
    {startsAt:'2026-10-18T03:00:00.000Z',endsAt:'2026-10-19T03:00:00.000Z',actions:['communication.read_leadership']},
    {startsAt:'2026-10-18T03:00:00.000Z',endsAt:'2026-10-19T03:00:00.000Z',actions:['*']},
  ])('rejects invalid, overlong, implicit-workspace or wildcard authority',sample=>{
    expect(()=>normalizeDelegationIssue({...sample,organizationId:randomUUID(),schoolId:randomUUID(),employeeId:randomUUID(),reason:'Synthetic acting cover',key:randomUUID()})).toThrow('VALIDATION');
  });
  it('requires versioned reasoned revocation',()=>{
    expect(normalizeDelegationRevoke({organizationId:randomUUID(),schoolId:randomUUID(),delegationId:randomUUID(),expectedVersion:1,reason:'End the temporary acting cover',key:randomUUID()})).toMatchObject({expectedVersion:1});
    expect(()=>normalizeDelegationRevoke({organizationId:randomUUID(),schoolId:randomUUID(),delegationId:randomUUID(),expectedVersion:0,reason:'End cover',key:randomUUID()})).toThrow('VALIDATION');
  });
});
