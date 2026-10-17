import type {Identity} from '../../../../shared/contracts/access';
import type {LeadershipAvailability,RecorderAvailability,RecordAvailabilityInput,RecordAvailabilityResult} from '../../../../shared/contracts/people-availability';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {availabilityInput} from '../domain/availability';

export interface PeopleAvailabilityRepository{
 leadership(actor:Identity,organizationId:string,schoolId:string,date:string):Promise<LeadershipAvailability>;
 recorder(actor:Identity,organizationId:string,schoolId:string,date:string):Promise<RecorderAvailability>;
 record(actor:Identity,organizationId:string,schoolId:string,input:RecordAvailabilityInput):Promise<RecordAvailabilityResult>;
}
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();};
const date=(value:unknown)=>{if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(`${value}T00:00:00Z`))||new Date(`${value}T00:00:00Z`).toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return value;};
export function createPeopleAvailabilityUseCases(repository:PeopleAvailabilityRepository){return {
 leadership(identity:Identity|null,organization:unknown,school:unknown,schoolDate:unknown){return repository.leadership(actor(identity),id(organization),id(school),date(schoolDate));},
 recorder(identity:Identity|null,organization:unknown,school:unknown,schoolDate:unknown){return repository.recorder(actor(identity),id(organization),id(school),date(schoolDate));},
 record(identity:Identity|null,organization:unknown,school:unknown,input:Record<string,unknown>){const normalized=availabilityInput({employeeId:id(input.employeeId),intervalId:input.intervalId===undefined?undefined:id(input.intervalId),expectedVersion:Number(input.expectedVersion),state:input.state as RecordAvailabilityInput['state'],startsAt:String(input.startsAt),endsAt:String(input.endsAt),timezone:String(input.timezone),sourceKind:input.sourceKind as RecordAvailabilityInput['sourceKind'],sourceReference:String(input.sourceReference),key:id(input.key)});if(normalized.expectedVersion===0&&normalized.intervalId||normalized.expectedVersion>0&&!normalized.intervalId)throw new AccessError('VALIDATION');return repository.record(actor(identity),id(organization),id(school),normalized);},
};}
