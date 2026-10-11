import type {Identity} from '../../../../shared/contracts/access';
import type {AdmissionApplicationResult,AdmissionContext,StartAdmissionApplication} from '../../../../shared/contracts/admissions';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {startApplicationInput} from '../domain/application';
export interface AdmissionsRepository{context(actor:Identity,organizationId:string,schoolId:string):Promise<AdmissionContext>;start(actor:Identity,organizationId:string,schoolId:string,input:StartAdmissionApplication):Promise<AdmissionApplicationResult>}
const actor=(value:Identity|null):Identity=>{if(!value)throw new AccessError('UNAUTHENTICATED');return value;},id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
export function createAdmissionsUseCases(repository:AdmissionsRepository){return {context(identity:Identity|null,organizationId:unknown,schoolId:unknown){return repository.context(actor(identity),id(organizationId),id(schoolId));},start(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown){return repository.start(actor(identity),id(organizationId),id(schoolId),startApplicationInput(input));}};}
export type AdmissionsFacade=ReturnType<typeof createAdmissionsUseCases>;
