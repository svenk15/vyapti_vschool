import type {Identity} from '../../../../shared/contracts/access';
import type {LeadershipLearningOverview} from '../../../../shared/contracts/learning';
import {AccessError} from '../../access/contracts/index';
import {leadershipLearningInput,type LeadershipLearningInput} from '../domain/leadership';

export interface LeadershipLearningRepository{
 overview(actor:Identity,input:{organizationId:string;schoolId:string;query:LeadershipLearningInput}):Promise<LeadershipLearningOverview>;
}
export function createLeadershipLearningUseCases(repository:LeadershipLearningRepository){return {leadershipLearningOverview(identity:Identity|null,organizationId:string,schoolId:string,value:unknown){if(!identity)throw new AccessError('UNAUTHENTICATED');return repository.overview(identity,{organizationId,schoolId,query:leadershipLearningInput(value)});}};}
export type LeadershipLearningFacade=ReturnType<typeof createLeadershipLearningUseCases>;
