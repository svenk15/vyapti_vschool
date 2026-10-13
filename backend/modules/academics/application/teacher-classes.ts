import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherClassWorkspace} from '../../../../shared/contracts/teacher-classes';
import {AccessError,uuidPattern} from '../../access/contracts/index';

const civil=/^\d{4}-\d{2}-\d{2}$/;
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
const id=(value:unknown,optional=false)=>{if(optional&&(value===undefined||value===null||value===''))return null;if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const date=(value:unknown)=>{if(typeof value!=='string'||!civil.test(value)||new Date(`${value}T00:00:00.000Z`).toISOString().slice(0,10)!==value)throw new AccessError('VALIDATION');return value;};

export interface TeacherClassesRepository{workspace(actor:Identity,organizationId:string,schoolId:string,schoolDate:string,offeringId:string|null):Promise<TeacherClassWorkspace>}
export function createTeacherClassesUseCases(repository:TeacherClassesRepository){return {teacherClasses(raw:Identity|null,organizationId:unknown,schoolId:unknown,schoolDate:unknown,offeringId?:unknown){return repository.workspace(actor(raw),id(organizationId)!,id(schoolId)!,date(schoolDate),id(offeringId,true));}};}
export type TeacherClassesFacade=ReturnType<typeof createTeacherClassesUseCases>;
