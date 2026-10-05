import type {Identity} from '../../../../shared/contracts/access';
import type {CourseOfferingRecord} from '../../../../shared/contracts/academics';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {code,identifier,positiveVersion} from '../domain/setup';
type OfferingInput={yearId:string;sectionId:string;subjectId:string;code:string;key:string;reason:string};
type AssignmentInput={offeringId:string;teacherId:string;validFrom:string;validTo:string;key:string;reason:string};
export interface AcademicOfferingRepository {
 list(actor:Identity,organizationId:string,schoolId:string,yearId:string):Promise<CourseOfferingRecord[]>;
 create(actor:Identity,organizationId:string,schoolId:string,input:OfferingInput):Promise<{id:string;version:number;code:string;replayed:boolean}>;
 assign(actor:Identity,organizationId:string,schoolId:string,input:AssignmentInput):Promise<{assignmentId:string;version:number;teacherId:string;offeringId:string;validFrom:string;validTo:string;replayed:boolean}>;
 end(actor:Identity,organizationId:string,schoolId:string,assignmentId:string,input:{expectedVersion:number;endDate:string;key:string;reason:string}):Promise<{assignmentId:string;version:number;validTo:string;replayed:boolean}>;
}
export type AssignmentImpactPort={hasFutureSessions(input:{organizationId:string;schoolId:string;assignmentId:string;onOrAfter:string}):Promise<boolean>};
export const NO_ASSIGNMENT_SESSIONS:AssignmentImpactPort={async hasFutureSessions(){return false;}};
function actor(value:Identity|null):Identity{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;}
function civil(value:unknown){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(`${value}T00:00:00Z`))||new Date(`${value}T00:00:00Z`).toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return value;}
function reason(value:unknown){if(typeof value!=='string'||value.trim().length<5||value.trim().length>500)throw new AccessError('VALIDATION');return value.normalize('NFC').trim();}
export function createAcademicOfferingUseCases(repo:AcademicOfferingRepository){
 const scope=(raw:Identity|null,org:unknown,school:unknown)=>({actor:actor(raw),organizationId:identifier(org),schoolId:identifier(school)});
 return {
  list(raw:Identity|null,org:unknown,school:unknown,year:unknown){const s=scope(raw,org,school);return repo.list(s.actor,s.organizationId,s.schoolId,identifier(year));},
  create(raw:Identity|null,org:unknown,school:unknown,input:{yearId:unknown;sectionId:unknown;subjectId:unknown;code:unknown;key:unknown;reason:unknown}){const s=scope(raw,org,school);return repo.create(s.actor,s.organizationId,s.schoolId,{yearId:identifier(input.yearId),sectionId:identifier(input.sectionId),subjectId:identifier(input.subjectId),code:code(input.code),key:identifier(input.key),reason:reason(input.reason)});},
  assign(raw:Identity|null,org:unknown,school:unknown,input:{offeringId:unknown;teacherId:unknown;validFrom:unknown;validTo:unknown;key:unknown;reason:unknown}){const s=scope(raw,org,school),validFrom=civil(input.validFrom),validTo=civil(input.validTo);if(validFrom>=validTo)throw new AccessError('VALIDATION');return repo.assign(s.actor,s.organizationId,s.schoolId,{offeringId:identifier(input.offeringId),teacherId:identifier(input.teacherId),validFrom,validTo,key:identifier(input.key),reason:reason(input.reason)});},
  end(raw:Identity|null,org:unknown,school:unknown,id:unknown,input:{expectedVersion:unknown;endDate:unknown;key:unknown;reason:unknown}){const s=scope(raw,org,school);return repo.end(s.actor,s.organizationId,s.schoolId,identifier(id),{expectedVersion:positiveVersion(input.expectedVersion),endDate:civil(input.endDate),key:identifier(input.key),reason:reason(input.reason)});},
 };
}
export type AcademicOfferingFacade=ReturnType<typeof createAcademicOfferingUseCases>;
