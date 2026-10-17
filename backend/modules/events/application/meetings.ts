import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {MeetingCommandResult,MeetingCommandStatus,MeetingDetail,MeetingParticipantCandidate,MeetingSummary} from '../../../../shared/contracts/meetings';
import {AccessError} from '../../access/contracts/index';
import {cancelInput,completionInput,meetingFields,meetingId,meetingKey,meetingVersion,participantChangeInput,participantIds,rescheduleInput,responseInput} from '../domain/meetings';

export interface MeetingsRepository{
 grantManager(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string}):Promise<{grantId:string;version:number}>;
 candidates(actor:Identity,organizationId:string,schoolId:string):Promise<readonly MeetingParticipantCandidate[]>;
 list(actor:Identity,organizationId:string,schoolId:string):Promise<readonly MeetingSummary[]>;
 get(actor:Identity,organizationId:string,schoolId:string,id:string):Promise<MeetingDetail>;
 saveDraft(actor:Identity,input:{organizationId:string;schoolId:string;meetingId:string|null;expectedVersion:number;purpose:string;agenda:string;startsAt:Date;endsAt:Date;key:string;requestId:string}):Promise<MeetingCommandResult>;
 propose(actor:Identity,input:{organizationId:string;schoolId:string;meetingId:string;expectedVersion:number;participantIds:readonly string[];key:string;requestId:string}):Promise<MeetingCommandResult>;
 respond(actor:Identity,input:{organizationId:string;schoolId:string;meetingId:string;expectedMeetingVersion:number;expectedParticipantVersion:number;response:'ACCEPTED'|'DECLINED';key:string;requestId:string}):Promise<MeetingCommandResult>;
 reschedule(actor:Identity,input:{organizationId:string;schoolId:string;meetingId:string;expectedVersion:number;startsAt:Date;endsAt:Date;key:string;requestId:string}):Promise<MeetingCommandResult>;
 removeParticipant(actor:Identity,input:{organizationId:string;schoolId:string;meetingId:string;participantId:string;expectedVersion:number;expectedParticipantVersion:number;key:string;requestId:string}):Promise<MeetingCommandResult>;
 confirm(actor:Identity,input:{organizationId:string;schoolId:string;meetingId:string;expectedVersion:number;key:string;requestId:string}):Promise<MeetingCommandResult>;
 complete(actor:Identity,input:{organizationId:string;schoolId:string;meetingId:string;expectedVersion:number;summary:string;attendance:readonly {participantId:string;status:'ATTENDED'|'ABSENT'}[];actions:readonly {ownerAccountId:string;description:string;dueAt:Date}[];key:string;requestId:string}):Promise<MeetingCommandResult>;
 cancel(actor:Identity,input:{organizationId:string;schoolId:string;meetingId:string;expectedVersion:number;key:string;requestId:string}):Promise<MeetingCommandResult>;
 status(actor:Identity,organizationId:string,schoolId:string,key:string):Promise<MeetingCommandStatus>;
}
const scope=(actor:Identity|null,organizationId:unknown,schoolId:unknown)=>{if(!actor)throw new AccessError('UNAUTHENTICATED');return {actor,organizationId:meetingId(organizationId),schoolId:meetingId(schoolId)};};
export function createMeetingUseCases(repository:MeetingsRepository){return {
 grantManager:(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string})=>repository.grantManager(operator,{organizationId:meetingId(input.organizationId),schoolId:meetingId(input.schoolId),accountId:meetingId(input.accountId)}),
 candidates(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(actor,organizationId,schoolId);return repository.candidates(s.actor,s.organizationId,s.schoolId);},
 list(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(actor,organizationId,schoolId);return repository.list(s.actor,s.organizationId,s.schoolId);},
 get(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown){const s=scope(actor,organizationId,schoolId);return repository.get(s.actor,s.organizationId,s.schoolId,meetingId(id));},
 saveDraft(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown,requestId:string){const s=scope(actor,organizationId,schoolId),v=input as Record<string,unknown>,fields=meetingFields(v);return repository.saveDraft(s.actor,{...s,...fields,meetingId:v.meetingId?meetingId(v.meetingId):null,expectedVersion:v.meetingId?meetingVersion(v.expectedVersion):0,key:meetingKey(v.key),requestId});},
 propose(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scope(actor,organizationId,schoolId),v=input as Record<string,unknown>;return repository.propose(s.actor,{...s,meetingId:meetingId(id),expectedVersion:meetingVersion(v.expectedVersion),participantIds:participantIds(v.participantIds),key:meetingKey(v.key),requestId});},
 respond(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scope(actor,organizationId,schoolId);return repository.respond(s.actor,{...s,meetingId:meetingId(id),...responseInput(input),requestId});},
 reschedule(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scope(actor,organizationId,schoolId);return repository.reschedule(s.actor,{...s,meetingId:meetingId(id),...rescheduleInput(input),requestId});},
 removeParticipant(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scope(actor,organizationId,schoolId);return repository.removeParticipant(s.actor,{...s,meetingId:meetingId(id),...participantChangeInput(input),requestId});},
 confirm(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scope(actor,organizationId,schoolId),v=input as Record<string,unknown>;return repository.confirm(s.actor,{...s,meetingId:meetingId(id),expectedVersion:meetingVersion(v.expectedVersion),key:meetingKey(v.key),requestId});},
 complete(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scope(actor,organizationId,schoolId);return repository.complete(s.actor,{...s,meetingId:meetingId(id),...completionInput(input),requestId});},
 cancel(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scope(actor,organizationId,schoolId);return repository.cancel(s.actor,{...s,meetingId:meetingId(id),...cancelInput(input),requestId});},
 status(actor:Identity|null,organizationId:unknown,schoolId:unknown,key:unknown){const s=scope(actor,organizationId,schoolId);return repository.status(s.actor,s.organizationId,s.schoolId,meetingKey(key));},
};}
export type MeetingsFacade=ReturnType<typeof createMeetingUseCases>;
