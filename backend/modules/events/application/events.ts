import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {EventCommandResult,EventDetail,EventSummary} from '../../../../shared/contracts/events';
import {AccessError} from '../../access/contracts/index';
import {createDraftInput,eventId,reviseInput,transitionInput,updateDraftInput} from '../domain/events';

type Scope={organizationId:string;schoolId:string};
export interface EventsRepository{
 grantPublisher(operator:OperatorPrincipal,input:Scope&{accountId:string}):Promise<{grantId:string;version:number}>;
 createDraft(actor:Identity,input:Scope&ReturnType<typeof createDraftInput>&{requestId:string}):Promise<EventCommandResult>;
 updateDraft(actor:Identity,input:Scope&{eventId:string}&ReturnType<typeof updateDraftInput>&{requestId:string}):Promise<EventCommandResult>;
 publish(actor:Identity,input:Scope&{eventId:string}&ReturnType<typeof transitionInput>&{requestId:string}):Promise<EventCommandResult>;
 revise(actor:Identity,input:Scope&{eventId:string}&ReturnType<typeof reviseInput>&{requestId:string}):Promise<EventCommandResult>;
 cancel(actor:Identity,input:Scope&{eventId:string}&ReturnType<typeof transitionInput>&{requestId:string}):Promise<EventCommandResult>;
 listAdmin(actor:Identity,input:Scope):Promise<readonly EventSummary[]>;
 detailAdmin(actor:Identity,input:Scope&{eventId:string}):Promise<EventDetail>;
 listParent(actor:Identity,input:{studentId:string}):Promise<readonly EventSummary[]>;
 detailParent(actor:Identity,input:{studentId:string;eventId:string}):Promise<EventDetail>;
 listStudent(actor:Identity,input:{studentId:string}):Promise<readonly EventSummary[]>;
 detailStudent(actor:Identity,input:{studentId:string;eventId:string}):Promise<EventDetail>;
}
const actor=(identity:Identity|null)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');return identity;};
export function createEventsUseCases(repository:EventsRepository){return {
 grantPublisher:(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown})=>repository.grantPublisher(operator,{organizationId:eventId(input.organizationId),schoolId:eventId(input.schoolId),accountId:eventId(input.accountId)}),
 createDraft:(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown,requestId:string)=>repository.createDraft(actor(identity),{organizationId:eventId(organizationId),schoolId:eventId(schoolId),...createDraftInput(input),requestId:eventId(requestId)}),
 updateDraft:(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string)=>repository.updateDraft(actor(identity),{organizationId:eventId(organizationId),schoolId:eventId(schoolId),eventId:eventId(id),...updateDraftInput(input),requestId:eventId(requestId)}),
 publish:(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string)=>repository.publish(actor(identity),{organizationId:eventId(organizationId),schoolId:eventId(schoolId),eventId:eventId(id),...transitionInput(input),requestId:eventId(requestId)}),
 revise:(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string)=>repository.revise(actor(identity),{organizationId:eventId(organizationId),schoolId:eventId(schoolId),eventId:eventId(id),...reviseInput(input),requestId:eventId(requestId)}),
 cancel:(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string)=>repository.cancel(actor(identity),{organizationId:eventId(organizationId),schoolId:eventId(schoolId),eventId:eventId(id),...transitionInput(input),requestId:eventId(requestId)}),
 listAdmin:(identity:Identity|null,organizationId:unknown,schoolId:unknown)=>repository.listAdmin(actor(identity),{organizationId:eventId(organizationId),schoolId:eventId(schoolId)}),
 detailAdmin:(identity:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown)=>repository.detailAdmin(actor(identity),{organizationId:eventId(organizationId),schoolId:eventId(schoolId),eventId:eventId(id)}),
 listParent:(identity:Identity|null,studentId:unknown)=>repository.listParent(actor(identity),{studentId:eventId(studentId)}),
 detailParent:(identity:Identity|null,studentId:unknown,id:unknown)=>repository.detailParent(actor(identity),{studentId:eventId(studentId),eventId:eventId(id)}),
 listStudent:(identity:Identity|null,studentId:unknown)=>repository.listStudent(actor(identity),{studentId:eventId(studentId)}),
 detailStudent:(identity:Identity|null,studentId:unknown,id:unknown)=>repository.detailStudent(actor(identity),{studentId:eventId(studentId),eventId:eventId(id)}),
};}
export type EventsFacade=ReturnType<typeof createEventsUseCases>;
