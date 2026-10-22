import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherEligibilityPreview,TeacherEligibilityResult} from '../../../../shared/contracts/academics';
import {AccessError,uuidPattern} from '../../access/contracts/index';

export type TeacherEligibilityInput=Readonly<{expectedTeacherVersion:number;validFrom:string;validTo:string|null;reason:string;reviewDigest:string;key:string}>;
export interface TeacherEligibilityRepository {
 preview(actor:Identity,organizationId:string,schoolId:string,employeeId:string,input:{expectedTeacherVersion:number;validFrom:string;validTo:string|null}):Promise<TeacherEligibilityPreview>;
 set(actor:Identity,organizationId:string,schoolId:string,employeeId:string,input:TeacherEligibilityInput):Promise<TeacherEligibilityResult>;
}
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();};
const civil=(value:unknown)=>{if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(`${value}T00:00:00Z`).toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return value;};
const version=(value:unknown)=>{if(!Number.isSafeInteger(value)||Number(value)<0)throw new AccessError('VALIDATION');return Number(value);};
const reason=(value:unknown)=>{if(typeof value!=='string'||value.trim().length<5||value.trim().length>500)throw new AccessError('VALIDATION');return value.normalize('NFC').trim();};
const digest=(value:unknown)=>{if(typeof value!=='string'||!/^[a-f0-9]{64}$/.test(value))throw new AccessError('VALIDATION');return value;};
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
function bounds(from:unknown,to:unknown){const validFrom=civil(from),validTo=to===null?null:civil(to);if(validTo!==null&&validFrom>=validTo)throw new AccessError('VALIDATION');return {validFrom,validTo};}
export function createTeacherEligibilityUseCases(repository:TeacherEligibilityRepository){return {
 preview(raw:Identity|null,organization:unknown,school:unknown,employee:unknown,input:{expectedTeacherVersion:unknown;validFrom:unknown;validTo:unknown}){const range=bounds(input.validFrom,input.validTo);return repository.preview(actor(raw),id(organization),id(school),id(employee),{expectedTeacherVersion:version(input.expectedTeacherVersion),...range});},
 set(raw:Identity|null,organization:unknown,school:unknown,employee:unknown,input:{expectedTeacherVersion:unknown;validFrom:unknown;validTo:unknown;reason:unknown;reviewDigest:unknown;key:unknown}){const range=bounds(input.validFrom,input.validTo);return repository.set(actor(raw),id(organization),id(school),id(employee),{expectedTeacherVersion:version(input.expectedTeacherVersion),...range,reason:reason(input.reason),reviewDigest:digest(input.reviewDigest),key:id(input.key)});},
};}
