import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {RequestAcknowledgeInput,RequestAppealInput,RequestCaseDetail,RequestCreateInput,RequestDecisionInput,RequestMutationResult,RequestQueue,RequestResponseInput,RequestReviewAvailability,RequestWithdrawInput} from '../../../../shared/contracts/requests';
import {AccessError} from '../../access/contracts/index';
import {acknowledgeInput,appealInput,createInput,decisionInput,id,responseInput,withdrawInput} from '../domain/requests';

export interface RequestsRepository {
 reviewAvailability(actor:Identity,organizationId:string,schoolId:string):Promise<RequestReviewAvailability>;
 list(actor:Identity,organizationId:string,schoolId:string):Promise<RequestQueue>;
 get(actor:Identity,organizationId:string,schoolId:string,caseId:string):Promise<RequestCaseDetail>;
 create(actor:Identity,organizationId:string,schoolId:string,input:RequestCreateInput):Promise<RequestMutationResult>;
 acknowledge(actor:Identity,organizationId:string,schoolId:string,caseId:string,input:RequestAcknowledgeInput):Promise<RequestMutationResult>;
 appeal(actor:Identity,organizationId:string,schoolId:string,caseId:string,input:RequestAppealInput):Promise<RequestMutationResult>;
 decide(actor:Identity,organizationId:string,schoolId:string,caseId:string,input:RequestDecisionInput):Promise<RequestMutationResult>;
 respond(actor:Identity,organizationId:string,schoolId:string,caseId:string,input:RequestResponseInput):Promise<RequestMutationResult>;
 withdraw(actor:Identity,organizationId:string,schoolId:string,caseId:string,input:RequestWithdrawInput):Promise<RequestMutationResult>;
 configure(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;reviewerAccountId:string;stewardAccountId:string;appealReviewerAccountId?:string|null}):Promise<void>;
}
const scope=(actor:Identity|null,organizationId:unknown,schoolId:unknown)=>{if(!actor)throw new AccessError('UNAUTHENTICATED');return {actor,organizationId:id(organizationId),schoolId:id(schoolId)};};
const record=(value:unknown)=>{if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');return value as Record<string,unknown>;};
export function createRequestsUseCases(repository:RequestsRepository){return {
 reviewAvailability(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(actor,organizationId,schoolId);return repository.reviewAvailability(s.actor,s.organizationId,s.schoolId);},
 list(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(actor,organizationId,schoolId);return repository.list(s.actor,s.organizationId,s.schoolId);},
 get(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown){const s=scope(actor,organizationId,schoolId);return repository.get(s.actor,s.organizationId,s.schoolId,id(caseId));},
 create(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.create(s.actor,s.organizationId,s.schoolId,createInput(record(input)));},
 acknowledge(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.acknowledge(s.actor,s.organizationId,s.schoolId,id(caseId),acknowledgeInput(record(input)));},
 appeal(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.appeal(s.actor,s.organizationId,s.schoolId,id(caseId),appealInput(record(input)));},
 decide(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.decide(s.actor,s.organizationId,s.schoolId,id(caseId),decisionInput(record(input)));},
 respond(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.respond(s.actor,s.organizationId,s.schoolId,id(caseId),responseInput(record(input)));},
 withdraw(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.withdraw(s.actor,s.organizationId,s.schoolId,id(caseId),withdrawInput(record(input)));},
 configure(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;reviewerAccountId:string;stewardAccountId:string;appealReviewerAccountId?:string|null}){return repository.configure(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),reviewerAccountId:id(input.reviewerAccountId),stewardAccountId:id(input.stewardAccountId),appealReviewerAccountId:input.appealReviewerAccountId?id(input.appealReviewerAccountId):null});},
};}
export type RequestsFacade=ReturnType<typeof createRequestsUseCases>;
