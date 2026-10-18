import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AssessmentCycleResult,AssessmentFreezeResult,AssessmentMarkCommandStatus,AssessmentMarkResult,AssessmentMarkWorkspace,AssessmentPlanningCommandStatus,AssessmentPlanningWorkspace,AssessmentReadiness,AssessmentScaleResult} from '../../../../shared/contracts/assessments';
import {AssessmentsError,uuid} from '../domain/readiness';
import {commandStatusInput,cycleInput,freezeInput,scaleInput,type CreateCycleInput,type CreateScaleInput,type FreezeCohortInput} from '../domain/planning';
import {markInput,type SaveMarkInput} from '../domain/marks';
type Scope={organizationId:string;schoolId:string};
export interface AssessmentsRepository{
 leadershipReadinessAvailable(actor:Identity,scope:Scope):Promise<boolean>;
 leadershipReadiness(actor:Identity,scope:Scope,cycleId:string|null):Promise<AssessmentReadiness>;
 planningWorkspace(actor:Identity,scope:Scope):Promise<AssessmentPlanningWorkspace>;
 createScale(actor:Identity,scope:Scope,input:CreateScaleInput):Promise<AssessmentScaleResult>;
 createCycle(actor:Identity,scope:Scope,input:CreateCycleInput):Promise<AssessmentCycleResult>;
 freezeCohort(actor:Identity,scope:Scope,input:FreezeCohortInput):Promise<AssessmentFreezeResult>;
 commandStatus(actor:Identity,scope:Scope,input:{command:'CreateAssessmentScale'|'CreateAssessmentCyclePlan'|'FreezeAssessmentCohort';key:string}):Promise<AssessmentPlanningCommandStatus>;
 markWorkspace(actor:Identity,scope:Scope):Promise<AssessmentMarkWorkspace>;
 saveMark(actor:Identity,scope:Scope,input:SaveMarkInput):Promise<AssessmentMarkResult>;
 markStatus(actor:Identity,scope:Scope,key:string):Promise<AssessmentMarkCommandStatus>;
 grantOversight(operator:OperatorPrincipal,input:Scope&{accountId:string}):Promise<void>;
 grantPlanning(operator:OperatorPrincipal,input:Scope&{accountId:string}):Promise<void>;
}
export function createAssessmentsUseCases(repository:AssessmentsRepository){return {
 leadershipReadinessAvailable(actor:Identity|null,organizationId:unknown,schoolId:unknown){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.leadershipReadinessAvailable(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)});},
 leadershipReadiness(actor:Identity|null,organizationId:unknown,schoolId:unknown,cycleId?:unknown){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.leadershipReadiness(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},cycleId===undefined||cycleId===null?null:uuid(cycleId));},
 planningWorkspace(actor:Identity|null,organizationId:unknown,schoolId:unknown){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.planningWorkspace(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)});},
 createScale(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.createScale(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},scaleInput(input));},
 createCycle(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.createCycle(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},cycleInput(input));},
 freezeCohort(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.freezeCohort(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},freezeInput(input));},
 commandStatus(actor:Identity|null,organizationId:unknown,schoolId:unknown,command:unknown,key:unknown){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.commandStatus(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},commandStatusInput(command,key));},
 markWorkspace(actor:Identity|null,organizationId:unknown,schoolId:unknown){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.markWorkspace(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)});},
 saveMark(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.saveMark(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},markInput(input));},
 markStatus(actor:Identity|null,organizationId:unknown,schoolId:unknown,key:unknown){if(!actor)throw new AssessmentsError('UNAUTHENTICATED');return repository.markStatus(actor,{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},uuid(key));},
 grantOversight(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string}){return repository.grantOversight(operator,{organizationId:uuid(input.organizationId),schoolId:uuid(input.schoolId),accountId:uuid(input.accountId)});},
 grantPlanning(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string}){return repository.grantPlanning(operator,{organizationId:uuid(input.organizationId),schoolId:uuid(input.schoolId),accountId:uuid(input.accountId)});},
};}
export type AssessmentsFacade=ReturnType<typeof createAssessmentsUseCases>;
