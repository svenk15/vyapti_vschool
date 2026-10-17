import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AssessmentModerationCommandStatus,AssessmentModerationResponseResult,AssessmentModerationSubmissionResult,AssessmentModerationWorkspace} from '../../../../shared/contracts/assessments';
import type {DecisionCommand,DecisionInformationCommand,DecisionRecusalCommand,ValidDecisionListInput} from '../../leadership/contracts/decisions';
import type {DecisionCommandStatus,DecisionDetail,DecisionInformationResult,DecisionRecusalResult,DecisionResult,DecisionReviewer,DecisionSummary} from '../../../../shared/contracts/decisions';
import {AssessmentsError,uuid} from '../domain/readiness';
import {respondModerationInput,submitModerationInput} from '../domain/moderation';
type Scope={organizationId:string;schoolId:string};
export interface AssessmentsModerationRepository{
 workspace(actor:Identity,scope:Scope):Promise<AssessmentModerationWorkspace>;
 submit(actor:Identity,scope:Scope,input:ReturnType<typeof submitModerationInput>):Promise<AssessmentModerationSubmissionResult>;
 respond(actor:Identity,scope:Scope,input:ReturnType<typeof respondModerationInput>):Promise<AssessmentModerationResponseResult>;
 teacherStatus(actor:Identity,scope:Scope,command:'SubmitAssessmentMarksForModeration'|'RespondAssessmentModerationInformation',key:string):Promise<AssessmentModerationCommandStatus>;
 list(actor:Identity,scope:Scope,input:ValidDecisionListInput):Promise<{items:readonly DecisionSummary[];nextCursor:string|null;timezone:string}>;
 get(actor:Identity,scope:Scope,id:string):Promise<DecisionDetail>;
 decide(actor:Identity,scope:Scope,id:string,input:DecisionCommand):Promise<DecisionResult>;
 decisionStatus(actor:Identity,scope:Scope,id:string,input:DecisionCommand):Promise<DecisionCommandStatus>;
 requestInformation(actor:Identity,scope:Scope,id:string,input:DecisionInformationCommand):Promise<DecisionInformationResult>;
 reviewers(actor:Identity,scope:Scope,id:string):Promise<readonly DecisionReviewer[]>;
 recuse(actor:Identity,scope:Scope,id:string,input:DecisionRecusalCommand):Promise<DecisionRecusalResult>;
 grantModeration(operator:OperatorPrincipal,input:Scope&{accountId:string}):Promise<void>;
}
export function createAssessmentsModerationUseCases(repository:AssessmentsModerationRepository){const actor=(value:Identity|null)=>{if(!value)throw new AssessmentsError('UNAUTHENTICATED');return value;},scope=(organizationId:unknown,schoolId:unknown)=>({organizationId:uuid(organizationId),schoolId:uuid(schoolId)});return {
 workspace(identity:Identity|null,organizationId:unknown,schoolId:unknown){return repository.workspace(actor(identity),scope(organizationId,schoolId));},
 submit(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){return repository.submit(actor(identity),scope(organizationId,schoolId),submitModerationInput(input));},
 respond(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){return repository.respond(actor(identity),scope(organizationId,schoolId),respondModerationInput(input));},
 teacherStatus(identity:Identity|null,organizationId:unknown,schoolId:unknown,command:unknown,key:unknown){if(command!=='SubmitAssessmentMarksForModeration'&&command!=='RespondAssessmentModerationInformation')throw new AssessmentsError('VALIDATION');return repository.teacherStatus(actor(identity),scope(organizationId,schoolId),command,uuid(key));},
 list(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:ValidDecisionListInput){return repository.list(actor(identity),scope(organizationId,schoolId),input);},
 get(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown){return repository.get(actor(identity),scope(organizationId,schoolId),uuid(id));},
 decide(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:DecisionCommand){return repository.decide(actor(identity),scope(organizationId,schoolId),uuid(id),input);},
 decisionStatus(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:DecisionCommand){return repository.decisionStatus(actor(identity),scope(organizationId,schoolId),uuid(id),input);},
 requestInformation(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:DecisionInformationCommand){return repository.requestInformation(actor(identity),scope(organizationId,schoolId),uuid(id),input);},
 reviewers(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown){return repository.reviewers(actor(identity),scope(organizationId,schoolId),uuid(id));},
 recuse(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:DecisionRecusalCommand){return repository.recuse(actor(identity),scope(organizationId,schoolId),uuid(id),input);},
 grantModeration(operator:OperatorPrincipal,input:Scope&{accountId:string}){return repository.grantModeration(operator,{organizationId:uuid(input.organizationId),schoolId:uuid(input.schoolId),accountId:uuid(input.accountId)});}
};}
export type AssessmentsModerationFacade=ReturnType<typeof createAssessmentsModerationUseCases>;
