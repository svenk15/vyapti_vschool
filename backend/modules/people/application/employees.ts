import type {Identity} from '../../../../shared/contracts/access';
import type {EmployeeProfile,PeopleWorkspace} from '../../../../shared/contracts/people';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {employeeInput,type EmployeeInput} from '../domain/employee';

export interface PeopleRepository {
 listEmployees(actor:Identity,organizationId:string,schoolId:string,query:{search:string;cursor:string|null;limit:number}):Promise<PeopleWorkspace>;
 createEmployee(actor:Identity,organizationId:string,schoolId:string,input:EmployeeInput&{key:string}):Promise<EmployeeProfile&{replayed:boolean}>;
}
export type PeopleFacade=ReturnType<typeof createPeopleUseCases>;
function currentActor(value:Identity|null):Identity{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;}
function identifier(value:unknown):string{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
function scope(actorValue:Identity|null,organization:unknown,school:unknown){return {actor:currentActor(actorValue),organizationId:identifier(organization),schoolId:identifier(school)};}
function listQuery(raw:{search?:unknown;cursor?:unknown;limit?:unknown}){if(raw.search!==undefined&&typeof raw.search!=='string')throw new AccessError('VALIDATION');const search=typeof raw.search==='string'?raw.search.normalize('NFC').trim():'';if(search.length>100||/[\u0000-\u001f]/.test(search))throw new AccessError('VALIDATION');const limit=raw.limit===undefined?50:Number(raw.limit);if(!Number.isInteger(limit)||limit<1||limit>100)throw new AccessError('VALIDATION');const cursor=raw.cursor==null||raw.cursor===''?null:raw.cursor;if(cursor!==null&&(typeof cursor!=='string'||cursor.length>2048))throw new AccessError('INVALID_CURSOR');return {search,cursor:cursor as string|null,limit};}
export function createPeopleUseCases(repository:PeopleRepository){return {
 workspace(identity:Identity|null,organization:unknown,school:unknown,query:{search?:unknown;cursor?:unknown;limit?:unknown}={}){const s=scope(identity,organization,school);return repository.listEmployees(s.actor,s.organizationId,s.schoolId,listQuery(query));},
 createEmployee(identity:Identity|null,organization:unknown,school:unknown,input:{firstName:unknown;lastName?:unknown;contactEmail?:unknown;staffNumber:unknown;employedFrom:unknown;key:unknown}){const s=scope(identity,organization,school),normalized=employeeInput(input),key=identifier(input.key);return repository.createEmployee(s.actor,s.organizationId,s.schoolId,{...normalized,key});},
};}
