import type {Identity} from '../../../../shared/contracts/access';
import type {LearningAssignmentPage,LearningAssignmentSummary,LearningCommandResult,LearningTeacherWorkspace} from '../../../../shared/contracts/learning';
import {AccessError} from '../../access/contracts/index';
import {createLearningInput,learningAssignmentQuery,learningId,publishLearningInput,updateLearningInput} from '../domain/assignments';

export interface LearningRepository{
 teacherWorkspace(actor:Identity,input:{organizationId:string;schoolId:string}):Promise<LearningTeacherWorkspace>;
 createDraft(actor:Identity,input:{organizationId:string;schoolId:string;offeringId:string;title:string;instructions:string;dueAt:string;key:string;requestId:string}):Promise<LearningCommandResult>;
 updateDraft(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string;offeringId:string;title:string;instructions:string;dueAt:string;expectedRevision:number;key:string;requestId:string}):Promise<LearningCommandResult>;
 publish(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string;expectedRevision:number;key:string;requestId:string}):Promise<LearningCommandResult>;
 listParent(actor:Identity,input:{studentId:string}):Promise<LearningAssignmentSummary[]>;
 detailParent(actor:Identity,input:{studentId:string;assignmentId:string}):Promise<LearningAssignmentSummary>;
 listStudent(actor:Identity,input:{studentId:string}):Promise<LearningAssignmentSummary[]>;
 queryStudent(actor:Identity,input:{studentId:string;q:string;by:'title'|'subject';sort:'due'|'title'|'subject';order:'asc'|'desc';cursor:string|null;limit:number;status:'all'|'draft'|'submitted'|'feedback'|'to_do'|'actionable'}):Promise<LearningAssignmentPage>;
 detailStudent(actor:Identity,input:{studentId:string;assignmentId:string}):Promise<LearningAssignmentSummary>;
}
export function createLearningUseCases(repository:LearningRepository){const actor=(value:Identity|null)=>{if(!value)throw new AccessError('UNAUTHENTICATED');return value;};return {
 teacherWorkspace:(identity:Identity|null,organizationId:string,schoolId:string)=>repository.teacherWorkspace(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId)}),
 createDraft:(identity:Identity|null,organizationId:string,schoolId:string,value:unknown,requestId:string)=>repository.createDraft(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId),...createLearningInput(value),requestId:learningId(requestId)}),
 updateDraft:(identity:Identity|null,organizationId:string,schoolId:string,assignmentId:unknown,value:unknown,requestId:string)=>repository.updateDraft(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId),assignmentId:learningId(assignmentId),...updateLearningInput(value),requestId:learningId(requestId)}),
 publish:(identity:Identity|null,organizationId:string,schoolId:string,assignmentId:unknown,value:unknown,requestId:string)=>repository.publish(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId),assignmentId:learningId(assignmentId),...publishLearningInput(value),requestId:learningId(requestId)}),
 listParent:(identity:Identity|null,studentId:unknown)=>repository.listParent(actor(identity),{studentId:learningId(studentId)}),
 detailParent:(identity:Identity|null,studentId:unknown,assignmentId:unknown)=>repository.detailParent(actor(identity),{studentId:learningId(studentId),assignmentId:learningId(assignmentId)}),
 listStudent:(identity:Identity|null,studentId:unknown)=>repository.listStudent(actor(identity),{studentId:learningId(studentId)}),
 queryStudent:(identity:Identity|null,studentId:unknown,query:unknown)=>repository.queryStudent(actor(identity),{studentId:learningId(studentId),...learningAssignmentQuery(query)}),
 detailStudent:(identity:Identity|null,studentId:unknown,assignmentId:unknown)=>repository.detailStudent(actor(identity),{studentId:learningId(studentId),assignmentId:learningId(assignmentId)}),
};}
export type LearningFacade=ReturnType<typeof createLearningUseCases>;
