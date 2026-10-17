import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {CoordinationAssignee,CoordinationAvailability,CoordinationBatchPreview,CoordinationBatchReceipt,CoordinationCapability,CoordinationHandoverReceipt,CoordinationHistory,CoordinationMutationResult,CoordinationQueue,CoordinationRequest} from '../../../../shared/contracts/coordination';
import {AccessError} from '../../access/contracts/index';
import {assignInput,batchInput,batchPreviewInput,createInput,handoverInput,historyInput,id,reasonTransitionInput,resolutionInput,sourceAssigneeInput,transitionInput} from '../domain/requests';

export type CoordinationListInput=Readonly<{status?:unknown;kind?:unknown;assignment?:unknown;cursor?:unknown;limit?:unknown}>;
export interface CoordinationRepository {
 availability(actor:Identity,organizationId:string,schoolId:string):Promise<CoordinationAvailability>;
 list(actor:Identity,organizationId:string,schoolId:string,input:CoordinationListInput):Promise<CoordinationQueue>;
 get(actor:Identity,organizationId:string,schoolId:string,requestId:string):Promise<CoordinationRequest>;
 eligibleAssignees(actor:Identity,organizationId:string,schoolId:string,requestId:string):Promise<readonly CoordinationAssignee[]>;
 sourceAssignees(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof sourceAssigneeInput>):Promise<readonly CoordinationAssignee[]>;
 previewBatch(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof batchPreviewInput>):Promise<CoordinationBatchPreview>;
 submitBatch(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof batchInput>):Promise<CoordinationBatchReceipt>;
 getBatch(actor:Identity,organizationId:string,schoolId:string,batchId:string):Promise<CoordinationBatchReceipt>;
 handover(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof handoverInput>):Promise<CoordinationHandoverReceipt>;
 getHandover(actor:Identity,organizationId:string,schoolId:string,handoverId:string):Promise<CoordinationHandoverReceipt>;
 history(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof historyInput>):Promise<CoordinationHistory>;
 create(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof createInput>):Promise<CoordinationMutationResult>;
 assign(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof assignInput>):Promise<CoordinationMutationResult>;
 start(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof transitionInput>):Promise<CoordinationMutationResult>;
 submit(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof resolutionInput>):Promise<CoordinationMutationResult>;
 verify(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof transitionInput>):Promise<CoordinationMutationResult>;
 returnResolution(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof reasonTransitionInput>):Promise<CoordinationMutationResult>;
 withdraw(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof reasonTransitionInput>):Promise<CoordinationMutationResult>;
 reopen(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof reasonTransitionInput>):Promise<CoordinationMutationResult>;
 grant(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;capability:CoordinationCapability}):Promise<{grantId:string;version:number}>;
 revoke(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;capability:CoordinationCapability}):Promise<{grantId:string;version:number}>;
}
const scope=(actor:Identity|null,organizationId:unknown,schoolId:unknown)=>{if(!actor)throw new AccessError('UNAUTHENTICATED');return {actor,organizationId:id(organizationId),schoolId:id(schoolId)};};
const record=(value:unknown)=>{if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');return value as Record<string,unknown>;};
export function createCoordinationUseCases(repository:CoordinationRepository){return {
 availability(actorValue:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.availability(s.actor,s.organizationId,s.schoolId);},
 list(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:CoordinationListInput={}){const s=scope(actorValue,organizationId,schoolId);return repository.list(s.actor,s.organizationId,s.schoolId,input);},
 get(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,requestId:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.get(s.actor,s.organizationId,s.schoolId,id(requestId));},
 eligibleAssignees(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,requestId:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.eligibleAssignees(s.actor,s.organizationId,s.schoolId,id(requestId));},
 sourceAssignees(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.sourceAssignees(s.actor,s.organizationId,s.schoolId,sourceAssigneeInput(record(input)));},
 previewBatch(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.previewBatch(s.actor,s.organizationId,s.schoolId,batchPreviewInput(record(input)));},
 submitBatch(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.submitBatch(s.actor,s.organizationId,s.schoolId,batchInput(record(input)));},
 getBatch(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,batchId:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.getBatch(s.actor,s.organizationId,s.schoolId,id(batchId));},
 handover(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.handover(s.actor,s.organizationId,s.schoolId,handoverInput(record(input)));},
 getHandover(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,handoverId:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.getHandover(s.actor,s.organizationId,s.schoolId,id(handoverId));},
 history(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.history(s.actor,s.organizationId,s.schoolId,historyInput(record(input)));},
 create(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.create(s.actor,s.organizationId,s.schoolId,createInput(record(input)));},
 assign(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.assign(s.actor,s.organizationId,s.schoolId,assignInput(record(input)));},
 start(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.start(s.actor,s.organizationId,s.schoolId,transitionInput(record(input)));},
 submit(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.submit(s.actor,s.organizationId,s.schoolId,resolutionInput(record(input)));},
 verify(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.verify(s.actor,s.organizationId,s.schoolId,transitionInput(record(input)));},
 returnResolution(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.returnResolution(s.actor,s.organizationId,s.schoolId,reasonTransitionInput(record(input)));},
 withdraw(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.withdraw(s.actor,s.organizationId,s.schoolId,reasonTransitionInput(record(input)));},
 reopen(actorValue:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actorValue,organizationId,schoolId);return repository.reopen(s.actor,s.organizationId,s.schoolId,reasonTransitionInput(record(input)));},
 grant(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;capability:CoordinationCapability}){return repository.grant(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId),capability:input.capability});},
 revoke(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;capability:CoordinationCapability}){return repository.revoke(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId),capability:input.capability});},
};}
export type CoordinationFacade=ReturnType<typeof createCoordinationUseCases>;
