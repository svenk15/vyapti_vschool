import {describe,expect,it,vi} from 'vitest';
import {randomUUID} from 'node:crypto';
import {buildBranchComparison} from '../../backend/modules/reporting/domain/branch-comparison';
import {createLeadershipBranchComparisonUseCases,type LeadershipBranchComparisonRepository} from '../../backend/modules/reporting/application/branch-comparison';

describe('leadership branch comparison',()=>{
 it('weights compatible branch ratios from underlying counts',()=>{
  const left=randomUUID(),right=randomUUID(),built=buildBranchComparison([{id:left,name:'North',timezone:'Asia/Kolkata'},{id:right,name:'South',timezone:'Asia/Kolkata'}],[
   {branchId:left,branchName:'North',timezone:'Asia/Kolkata',schoolDate:'2026-10-17',definitionVersion:'register-coverage.v1',duePolicy:'SESSION_END_NO_GRACE',sourceAsOf:'2026-10-17T10:00:00.000Z',counts:{due:2,received:1,awaiting:1}},
   {branchId:right,branchName:'South',timezone:'Asia/Kolkata',schoolDate:'2026-10-17',definitionVersion:'register-coverage.v1',duePolicy:'SESSION_END_NO_GRACE',sourceAsOf:'2026-10-17T10:05:00.000Z',counts:{due:10,received:9,awaiting:1}}
  ]);expect(built.combined).toEqual({includedBranchCount:2,numerator:10,denominator:12,value:10/12});expect(built.rows.every(row=>row.status==='COMPARABLE')).toBe(true);
 });
 it('does not combine different date coverage and keeps empty branches explicit',()=>{
  const left=randomUUID(),right=randomUUID(),empty=randomUUID(),built=buildBranchComparison([{id:left,name:'North',timezone:'Asia/Kolkata'},{id:right,name:'South',timezone:'Asia/Kolkata'},{id:empty,name:'East',timezone:'Asia/Kolkata'}],[
   {branchId:left,branchName:'North',timezone:'Asia/Kolkata',schoolDate:'2026-10-17',definitionVersion:'register-coverage.v1',duePolicy:'SESSION_END_NO_GRACE',sourceAsOf:'2026-10-17T10:00:00.000Z',counts:{due:2,received:1,awaiting:1}},
   {branchId:right,branchName:'South',timezone:'Asia/Kolkata',schoolDate:'2026-10-18',definitionVersion:'register-coverage.v1',duePolicy:'SESSION_END_NO_GRACE',sourceAsOf:'2026-10-18T10:00:00.000Z',counts:{due:4,received:4,awaiting:0}}
  ]);expect(built.combined).toEqual({includedBranchCount:0,numerator:0,denominator:0,value:null});expect(built.rows.map(row=>row.reason)).toEqual(['DATE_COVERAGE_DIFFERS','DATE_COVERAGE_DIFFERS','NO_SNAPSHOTS']);
 });
 it('validates unique branch and bounded date input before delegation',async()=>{
  const repository={availability:vi.fn(),compare:vi.fn(),grant:vi.fn(),revoke:vi.fn()} as unknown as LeadershipBranchComparisonRepository,facade=createLeadershipBranchComparisonUseCases(repository),identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID(),branchId=randomUUID();
  expect(()=>facade.compareLeadershipBranches(identity,organizationId,schoolId,{branchIds:[branchId,branchId],fromDate:'2026-10-01',toDate:'2026-10-02'})).toThrowError(expect.objectContaining({code:'VALIDATION'}));
  expect(()=>facade.compareLeadershipBranches(identity,organizationId,schoolId,{branchIds:[branchId],fromDate:'2026-10-01',toDate:'2026-11-01'})).toThrowError(expect.objectContaining({code:'VALIDATION'}));
  expect(repository.compare).not.toHaveBeenCalled();
 });
});
