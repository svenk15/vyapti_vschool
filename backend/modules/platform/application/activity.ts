import type {Identity} from '../../../../shared/contracts/access';
import type {ActivityDetail,ActivityPage} from '../../../../shared/contracts/activity';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {activityQuery,type ActivityQuery} from '../domain/activity';
export interface ActivityRepository{list(actor:Identity,organizationId:string,schoolId:string,query:ActivityQuery):Promise<ActivityPage>;detail(actor:Identity,organizationId:string,schoolId:string,eventId:string):Promise<ActivityDetail>}
function actor(value:Identity|null){if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;}
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
export function createActivityUseCases(repository:ActivityRepository,today:()=>string){return{
 list(identity:Identity|null,organizationId:unknown,schoolId:unknown,query:{category?:unknown;from?:unknown;to?:unknown;cursor?:unknown;limit?:unknown}={}){return repository.list(actor(identity),id(organizationId),id(schoolId),activityQuery(query,today()));},
 detail(identity:Identity|null,organizationId:unknown,schoolId:unknown,eventId:unknown){return repository.detail(actor(identity),id(organizationId),id(schoolId),id(eventId));},
};}
export type ActivityFacade=ReturnType<typeof createActivityUseCases>;
