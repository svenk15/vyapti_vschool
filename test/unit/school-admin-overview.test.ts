import {describe,expect,it,vi} from 'vitest';
import {createSchoolAdminOverviewUseCases} from '../../backend/modules/reporting/application/school-admin-overview';
import type {SchoolAdminOverviewRepository} from '../../backend/modules/reporting/application/school-admin-overview';

const identity={accountId:'10000000-0000-4000-8000-000000000001',tokenVersion:1};
const organizationId='20000000-0000-4000-8000-000000000002',schoolId='30000000-0000-4000-8000-000000000003';
describe('SA-COMP-01 school administrator overview use case',()=>{
 it('validates the verified scope and delegates without changing the read model',async()=>{const value={asOf:'2026-10-10T00:00:00.000Z',readiness:[],exceptions:[],completeCount:0,totalCount:0} as const,repository={get:vi.fn().mockResolvedValue(value)} satisfies SchoolAdminOverviewRepository,useCases=createSchoolAdminOverviewUseCases(repository);await expect(useCases.schoolAdminOverview(identity,organizationId,schoolId)).resolves.toBe(value);expect(repository.get).toHaveBeenCalledWith(identity,organizationId,schoolId);});
 it('rejects absent identity and malformed scope before repository access',()=>{const repository={get:vi.fn()} satisfies SchoolAdminOverviewRepository,useCases=createSchoolAdminOverviewUseCases(repository);expect(()=>useCases.schoolAdminOverview(null,organizationId,schoolId)).toThrow(expect.objectContaining({code:'UNAUTHENTICATED'}));expect(()=>useCases.schoolAdminOverview(identity,'foreign',schoolId)).toThrow(expect.objectContaining({code:'VALIDATION'}));expect(repository.get).not.toHaveBeenCalled();});
});
