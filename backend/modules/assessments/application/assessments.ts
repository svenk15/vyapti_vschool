import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AssessmentReadiness} from '../../../../shared/contracts/assessments';
import {AssessmentsError,uuid} from '../domain/readiness';
export interface AssessmentsRepository{leadershipReadiness(actor:Identity,scope:{organizationId:string;schoolId:string},cycleId:string|null):Promise<AssessmentReadiness>;grantOversight(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string}):Promise<void>;}
export function createAssessmentsUseCases(repository:AssessmentsRepository){return {
 leadershipReadiness(actor:Identity|null,organizationId:unknown,schoolId:unknown,cycleId?:unknown){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.leadershipReadiness(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},cycleId===undefined||cycleId===null?null:uuid(cycleId));},
 grantOversight(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string}){return repository.grantOversight(operator,{organizationId:uuid(input.organizationId),schoolId:uuid(input.schoolId),accountId:uuid(input.accountId)});},
};}
export type AssessmentsFacade=ReturnType<typeof createAssessmentsUseCases>;
