import type {Identity} from '../../../../shared/contracts/access';
import type {LeadershipTimetableOverview} from '../../../../shared/contracts/timetable';
import {AccessError,uuidPattern} from '../../access/contracts/index';

export interface LeadershipTimetableRepository { overview(actor:Identity,organizationId:string,schoolId:string,input:{cursor:string|null;limit:number}):Promise<LeadershipTimetableOverview> }
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
export function createLeadershipTimetableUseCases(repository:LeadershipTimetableRepository){return {leadershipTimetableOverview(raw:Identity|null,organizationId:unknown,schoolId:unknown,input:{cursor?:unknown;limit?:unknown}={}){const cursor=input.cursor===undefined||input.cursor===null||input.cursor===''?null:id(input.cursor),limit=input.limit===undefined?25:input.limit;if(typeof limit!=='number'||!Number.isInteger(limit)||limit<1||limit>50)throw new AccessError('VALIDATION');return repository.overview(actor(raw),id(organizationId),id(schoolId),{cursor,limit});}};}
