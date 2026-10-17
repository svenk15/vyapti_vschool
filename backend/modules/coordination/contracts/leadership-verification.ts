import type {Identity} from '../../../../shared/contracts/access';
import type {CoordinationAssignee,CoordinationCommandStatus,CoordinationDecisionRecusalResult,CoordinationInformationResult,CoordinationMutationResult,CoordinationQueue,CoordinationRequest} from '../../../../shared/contracts/coordination';

export interface CoordinationVerificationFacade {
 list(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationQueue>;
 get(actor:Identity,organizationId:unknown,schoolId:unknown,requestId:unknown):Promise<CoordinationRequest>;
 verify(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationMutationResult>;
 returnResolution(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationMutationResult>;
 decisionStatus(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationCommandStatus>;
 requestInformation(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationInformationResult>;
 decisionReviewers(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<readonly CoordinationAssignee[]>;
 recuseDecision(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationDecisionRecusalResult>;
}
