import type {Identity} from '../../../../shared/contracts/access';
import type {LearningStudentDraft,LearningStudentWork,LearningSubmissionReceipt,LearningTeacherSubmissionDetail,LearningTeacherSubmissionSummary} from '../../../../shared/contracts/learning';
import {AccessError} from '../../access/contracts/index';
import {learningId} from '../domain/assignments';
import {saveStudentDraftInput,submitStudentWorkInput} from '../domain/submissions';

export interface LearningSubmissionRepository{
  studentWork(actor:Identity,input:{studentId:string;assignmentId:string}):Promise<LearningStudentWork>;
  saveStudentDraft(actor:Identity,input:{studentId:string;assignmentId:string;expectedVersion:number;text:string;key:string;requestId:string}):Promise<LearningStudentDraft&{replayed:boolean}>;
  submitStudentWork(actor:Identity,input:{studentId:string;assignmentId:string;reviewedAssignmentVersion:number;expectedDraftVersion:number;key:string;requestId:string}):Promise<LearningSubmissionReceipt>;
  teacherSubmissions(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string}):Promise<LearningTeacherSubmissionSummary[]>;
  teacherSubmission(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string;submissionId:string}):Promise<LearningTeacherSubmissionDetail>;
}
export function createLearningSubmissionUseCases(repository:LearningSubmissionRepository){const actor=(value:Identity|null)=>{if(!value)throw new AccessError('UNAUTHENTICATED');return value;};return {
  studentWork:(identity:Identity|null,studentId:unknown,assignmentId:unknown)=>repository.studentWork(actor(identity),{studentId:learningId(studentId),assignmentId:learningId(assignmentId)}),
  saveStudentDraft:(identity:Identity|null,assignmentId:unknown,value:unknown,requestId:string)=>repository.saveStudentDraft(actor(identity),{assignmentId:learningId(assignmentId),...saveStudentDraftInput(value),requestId:learningId(requestId)}),
  submitStudentWork:(identity:Identity|null,assignmentId:unknown,value:unknown,requestId:string)=>repository.submitStudentWork(actor(identity),{assignmentId:learningId(assignmentId),...submitStudentWorkInput(value),requestId:learningId(requestId)}),
  teacherSubmissions:(identity:Identity|null,organizationId:string,schoolId:string,assignmentId:unknown)=>repository.teacherSubmissions(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId),assignmentId:learningId(assignmentId)}),
  teacherSubmission:(identity:Identity|null,organizationId:string,schoolId:string,assignmentId:unknown,submissionId:unknown)=>repository.teacherSubmission(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId),assignmentId:learningId(assignmentId),submissionId:learningId(submissionId)}),
};}
