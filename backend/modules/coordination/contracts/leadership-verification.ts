import type {Identity} from '../../../../shared/contracts/access';
import type {CoordinationCommandStatus,CoordinationMutationResult,CoordinationQueue,CoordinationRequest} from '../../../../shared/contracts/coordination';

export interface CoordinationVerificationFacade {
 list(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationQueue>;
 get(actor:Identity,organizationId:unknown,schoolId:unknown,requestId:unknown):Promise<CoordinationRequest>;
 verify(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationMutationResult>;
 returnResolution(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationMutationResult>;
 decisionStatus(actor:Identity,organizationId:unknown,schoolId:unknown,input:unknown):Promise<CoordinationCommandStatus>;
}
