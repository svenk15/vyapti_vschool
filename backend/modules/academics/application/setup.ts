import type {Identity} from '../../../../shared/contracts/access';
import type {AcademicCommandResult,AcademicsWorkspace} from '../../../../shared/contracts/academics';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {code,identifier,name,positiveVersion,validateRange} from '../domain/setup';

export type AcademicCapability='school.manage'|'class.manage';
export interface AcademicSetupRepository{
 workspace(actor:Identity,organizationId:string,schoolId:string):Promise<AcademicsWorkspace>;
 createYear(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;startsOn:string;endsOn:string;key:string;reason:string}):Promise<AcademicCommandResult & {calendarId:string;status:'DRAFT'}>;
 replaceTerms(actor:Identity,organizationId:string,schoolId:string,yearId:string,input:{expectedVersion:number;terms:{code:string;name:string;startsOn:string;endsOn:string}[];key:string;reason:string}):Promise<{yearId:string;version:number;terms:AcademicsWorkspace['years'][number]['terms'];replayed:boolean}>;
 createGrade(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;key:string;reason:string}):Promise<AcademicCommandResult>;
 createSubject(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;key:string;reason:string}):Promise<AcademicCommandResult>;
 createSection(actor:Identity,organizationId:string,schoolId:string,input:{yearId:string;gradeId:string;campusId:string|null;code:string;name:string;key:string;reason:string}):Promise<AcademicCommandResult & {yearId:string;gradeId:string;campusId:string|null}>;
}
export type AcademicSetupFacade=ReturnType<typeof createAcademicSetupUseCases>;
function actor(value:Identity|null):Identity{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;}
function key(value:unknown){return identifier(value);}
function reason(value:unknown){if(typeof value!=='string')throw new AccessError('VALIDATION');const v=value.normalize('NFC').trim();if(v.length<5||v.length>500||/[\u0000-\u001f]/.test(v))throw new AccessError('VALIDATION');return v;}
export function createAcademicSetupUseCases(repo:AcademicSetupRepository){
 const scope=(raw:Identity|null,organization:unknown,school:unknown)=>({actor:actor(raw),organizationId:identifier(organization),schoolId:identifier(school)});
 return {
  workspace(raw:Identity|null,organization:unknown,school:unknown){const s=scope(raw,organization,school);return repo.workspace(s.actor,s.organizationId,s.schoolId);},
  createYear(raw:Identity|null,organization:unknown,school:unknown,input:{code:unknown;name:unknown;startsOn:unknown;endsOn:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school),range=validateRange(input.startsOn,input.endsOn);return repo.createYear(s.actor,s.organizationId,s.schoolId,{...range,code:code(input.code),name:name(input.name),key:key(input.key),reason:reason(input.reason)});},
  replaceTerms(raw:Identity|null,organization:unknown,school:unknown,year:unknown,input:{expectedVersion:unknown;terms:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school),yearId=identifier(year),expectedVersion=positiveVersion(input.expectedVersion);if(!Array.isArray(input.terms))throw new AccessError('VALIDATION');const rawTerms=input.terms.map(x=>{if(!x||typeof x!=='object')throw new AccessError('VALIDATION');const v=x as Record<string,unknown>,range=validateRange(v.startsOn,v.endsOn);return {code:code(v.code),name:name(v.name),...range};});return repo.replaceTerms(s.actor,s.organizationId,s.schoolId,yearId,{expectedVersion,terms:rawTerms,key:key(input.key),reason:reason(input.reason)});},
  createGrade(raw:Identity|null,organization:unknown,school:unknown,input:{code:unknown;name:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school);return repo.createGrade(s.actor,s.organizationId,s.schoolId,{code:code(input.code),name:name(input.name),key:key(input.key),reason:reason(input.reason)});},
  createSubject(raw:Identity|null,organization:unknown,school:unknown,input:{code:unknown;name:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school);return repo.createSubject(s.actor,s.organizationId,s.schoolId,{code:code(input.code),name:name(input.name),key:key(input.key),reason:reason(input.reason)});},
  createSection(raw:Identity|null,organization:unknown,school:unknown,input:{yearId:unknown;gradeId:unknown;campusId?:unknown;code:unknown;name:unknown;key:unknown;reason:unknown}){const s=scope(raw,organization,school);return repo.createSection(s.actor,s.organizationId,s.schoolId,{yearId:identifier(input.yearId),gradeId:identifier(input.gradeId),campusId:input.campusId==null?null:identifier(input.campusId),code:code(input.code),name:name(input.name),key:key(input.key),reason:reason(input.reason)});},
 };
}
