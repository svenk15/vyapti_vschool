import type {Identity} from '../../../../shared/contracts/access';
import type {LearningFeedbackDraftResult,LearningFeedbackPublicationReceipt,LearningPublishedFeedback,LearningTeacherFeedback} from '../../../../shared/contracts/learning';
import {AccessError} from '../../access/contracts/index';
import {learningId} from '../domain/assignments';
import {publishFeedbackInput,saveFeedbackInput} from '../domain/feedback';

export interface LearningFeedbackRepository{
 teacherFeedback(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string;submissionId:string}):Promise<LearningTeacherFeedback>;
 saveFeedbackDraft(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string;submissionId:string;expectedRevision:number;strength:string;nextStep:string;key:string;requestId:string}):Promise<LearningFeedbackDraftResult>;
 publishFeedback(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string;submissionId:string;expectedRevision:number;reviewedSubmissionId:string;key:string;requestId:string}):Promise<LearningFeedbackPublicationReceipt>;
 studentFeedback(actor:Identity,input:{studentId:string;assignmentId:string}):Promise<LearningPublishedFeedback|null>;
}
export function createLearningFeedbackUseCases(repository:LearningFeedbackRepository){const actor=(value:Identity|null)=>{if(!value)throw new AccessError('UNAUTHENTICATED');return value;};return {
 teacherFeedback:(identity:Identity|null,organizationId:unknown,schoolId:unknown,assignmentId:unknown,submissionId:unknown)=>repository.teacherFeedback(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId),assignmentId:learningId(assignmentId),submissionId:learningId(submissionId)}),
 saveFeedbackDraft:(identity:Identity|null,organizationId:unknown,schoolId:unknown,assignmentId:unknown,submissionId:unknown,value:unknown,requestId:string)=>repository.saveFeedbackDraft(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId),assignmentId:learningId(assignmentId),submissionId:learningId(submissionId),...saveFeedbackInput(value),requestId:learningId(requestId)}),
 publishFeedback:(identity:Identity|null,organizationId:unknown,schoolId:unknown,assignmentId:unknown,submissionId:unknown,value:unknown,requestId:string)=>repository.publishFeedback(actor(identity),{organizationId:learningId(organizationId),schoolId:learningId(schoolId),assignmentId:learningId(assignmentId),submissionId:learningId(submissionId),...publishFeedbackInput(value),requestId:learningId(requestId)}),
 studentFeedback:(identity:Identity|null,studentId:unknown,assignmentId:unknown)=>repository.studentFeedback(actor(identity),{studentId:learningId(studentId),assignmentId:learningId(assignmentId)}),
};}
