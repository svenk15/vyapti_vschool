import type {Identity} from '../../../../shared/contracts/access';
import type {TimetableCoverContext,TimetableCoverDetail,TimetableCoverInbox} from '../../../../shared/contracts/timetable-cover';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {closeCoverInput,decideCoverInput,proposeCoverInput,respondCoverInput} from '../domain/timetable-cover';
export interface TimetableCoverRepository{
 available(actor:Identity,organizationId:string,schoolId:string):Promise<boolean>;
 context(actor:Identity,organizationId:string,schoolId:string,occurrenceId:string):Promise<TimetableCoverContext>;
 inbox(actor:Identity,organizationId:string,schoolId:string):Promise<TimetableCoverInbox>;
 detail(actor:Identity,organizationId:string,schoolId:string,coverId:string):Promise<TimetableCoverDetail>;
 propose(actor:Identity,organizationId:string,schoolId:string,input:ReturnType<typeof proposeCoverInput>):Promise<TimetableCoverDetail>;
 decide(actor:Identity,organizationId:string,schoolId:string,coverId:string,input:ReturnType<typeof decideCoverInput>):Promise<TimetableCoverDetail>;
 respond(actor:Identity,organizationId:string,schoolId:string,coverId:string,input:ReturnType<typeof respondCoverInput>):Promise<TimetableCoverDetail>;
 close(actor:Identity,organizationId:string,schoolId:string,coverId:string,input:ReturnType<typeof closeCoverInput>):Promise<TimetableCoverDetail>;
}
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();};
export function createTimetableCoverUseCases(repository:TimetableCoverRepository){const scope=(identity:Identity|null,organizationId:unknown,schoolId:unknown)=>({actor:actor(identity),organizationId:id(organizationId),schoolId:id(schoolId)});return {
 coverContext(identity:Identity|null,organizationId:unknown,schoolId:unknown,occurrenceId:unknown){const s=scope(identity,organizationId,schoolId);return repository.context(s.actor,s.organizationId,s.schoolId,id(occurrenceId));},
 coverAvailable(identity:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(identity,organizationId,schoolId);return repository.available(s.actor,s.organizationId,s.schoolId);},
 coverInbox(identity:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(identity,organizationId,schoolId);return repository.inbox(s.actor,s.organizationId,s.schoolId);},
 coverDetail(identity:Identity|null,organizationId:unknown,schoolId:unknown,coverId:unknown){const s=scope(identity,organizationId,schoolId);return repository.detail(s.actor,s.organizationId,s.schoolId,id(coverId));},
 proposeCover(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>){const s=scope(identity,organizationId,schoolId);return repository.propose(s.actor,s.organizationId,s.schoolId,proposeCoverInput(input));},
 decideCover(identity:Identity|null,organizationId:unknown,schoolId:unknown,coverId:unknown,input:Record<string,unknown>){const s=scope(identity,organizationId,schoolId);return repository.decide(s.actor,s.organizationId,s.schoolId,id(coverId),decideCoverInput(input));},
 respondCover(identity:Identity|null,organizationId:unknown,schoolId:unknown,coverId:unknown,input:Record<string,unknown>){const s=scope(identity,organizationId,schoolId);return repository.respond(s.actor,s.organizationId,s.schoolId,id(coverId),respondCoverInput(input));},
 closeCover(identity:Identity|null,organizationId:unknown,schoolId:unknown,coverId:unknown,input:Record<string,unknown>){const s=scope(identity,organizationId,schoolId);return repository.close(s.actor,s.organizationId,s.schoolId,id(coverId),closeCoverInput(input));},
};}
