import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {RequestCaseDetail,RequestCreateInput,RequestDecisionInput,RequestMutationResult,RequestQueue,RequestResponseInput,RequestWithdrawInput} from '../../../../shared/contracts/requests';
import {AccessError} from '../../access/contracts/index';
import {createInput,decisionInput,id,responseInput,withdrawInput} from '../domain/requests';

export interface RequestsRepository {
 list(actor:Identity,organizationId:string,schoolId:string):Promise<RequestQueue>;
 get(actor:Identity,organizationId:string,schoolId:string,caseId:string):Promise<RequestCaseDetail>;
 create(actor:Identity,organizationId:string,schoolId:string,input:RequestCreateInput):Promise<RequestMutationResult>;
 decide(actor:Identity,organizationId:string,schoolId:string,caseId:string,input:RequestDecisionInput):Promise<RequestMutationResult>;
 respond(actor:Identity,organizationId:string,schoolId:string,caseId:string,input:RequestResponseInput):Promise<RequestMutationResult>;
 withdraw(actor:Identity,organizationId:string,schoolId:string,caseId:string,input:RequestWithdrawInput):Promise<RequestMutationResult>;
 configure(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;reviewerAccountId:string;stewardAccountId:string}):Promise<void>;
}
const scope=(actor:Identity|null,organizationId:unknown,schoolId:unknown)=>{if(!actor)throw new AccessError('UNAUTHENTICATED');return {actor,organizationId:id(organizationId),schoolId:id(schoolId)};};
const record=(value:unknown)=>{if(!value||typeof value!=='object'||Array.isArray(value))throw new AccessError('VALIDATION');return value as Record<string,unknown>;};
export function createRequestsUseCases(repository:RequestsRepository){return {
 list(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(actor,organizationId,schoolId);return repository.list(s.actor,s.organizationId,s.schoolId);},
 get(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown){const s=scope(actor,organizationId,schoolId);return repository.get(s.actor,s.organizationId,s.schoolId,id(caseId));},
 create(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.create(s.actor,s.organizationId,s.schoolId,createInput(record(input)));},
 decide(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.decide(s.actor,s.organizationId,s.schoolId,id(caseId),decisionInput(record(input)));},
 respond(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.respond(s.actor,s.organizationId,s.schoolId,id(caseId),responseInput(record(input)));},
 withdraw(actor:Identity|null,organizationId:unknown,schoolId:unknown,caseId:unknown,input:unknown){const s=scope(actor,organizationId,schoolId);return repository.withdraw(s.actor,s.organizationId,s.schoolId,id(caseId),withdrawInput(record(input)));},
 configure(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;reviewerAccountId:string;stewardAccountId:string}){return repository.configure(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),reviewerAccountId:id(input.reviewerAccountId),stewardAccountId:id(input.stewardAccountId)});},
};}
export type RequestsFacade=ReturnType<typeof createRequestsUseCases>;
