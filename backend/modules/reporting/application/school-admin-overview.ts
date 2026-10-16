import type {Identity} from '../../../../shared/contracts/access';
import type {SchoolAdminOverview} from '../../../../shared/contracts/reporting';
import {AccessError,uuidPattern} from '../../access/contracts/index';

export interface SchoolAdminOverviewRepository {
 get(actor:Identity,organizationId:string,schoolId:string):Promise<SchoolAdminOverview>;
}

export function createSchoolAdminOverviewUseCases(repository:SchoolAdminOverviewRepository){
 return {schoolAdminOverview(actor:Identity|null,organizationId:unknown,schoolId:unknown){
  if(!actor||!uuidPattern.test(actor.accountId)||!Number.isSafeInteger(actor.tokenVersion))throw new AccessError('UNAUTHENTICATED');
  if(typeof organizationId!=='string'||!uuidPattern.test(organizationId)||typeof schoolId!=='string'||!uuidPattern.test(schoolId))throw new AccessError('VALIDATION');
  return repository.get(actor,organizationId,schoolId);
 }};
}
