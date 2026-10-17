import {AssessmentsError,uuid} from './readiness';
import type {AssessmentReportAudience} from '../../../../shared/contracts/assessment-publications';

export const reportAudience=(value:unknown):AssessmentReportAudience=>{if(value!=='STUDENT'&&value!=='GUARDIANS'&&value!=='BOTH')throw new AssessmentsError('VALIDATION');return value;};
export const positiveVersion=(value:unknown)=>{if(typeof value!=='number'||!Number.isInteger(value)||value<1)throw new AssessmentsError('VALIDATION');return value;};
export const reportReason=(value:unknown)=>{if(typeof value!=='string')throw new AssessmentsError('VALIDATION');const text=value.normalize('NFC').trim();if(text.length<5||text.length>500||/[\u0000-\u001f\u007f]/.test(text))throw new AssessmentsError('VALIDATION');return text;};
export const reportKey=(value:unknown)=>uuid(value);
export type AssignReportInput=Readonly<{reportRevisionId:string;templateId:string;audience:AssessmentReportAudience;publisherAccountId:string;key:string}>;
export type PublishReportInput=Readonly<{handoffId:string;expectedVersion:number;documentVersionId:string;documentGrantId:string;key:string}>;
export type WithdrawReportInput=Readonly<{handoffId:string;publicationId:string;expectedVersion:number;reason:string;key:string}>;
export function assignReportInput(input:Record<string,unknown>):AssignReportInput{return {reportRevisionId:uuid(input.reportRevisionId),templateId:uuid(input.templateId),audience:reportAudience(input.audience),publisherAccountId:uuid(input.publisherAccountId),key:reportKey(input.key)};}
export function publishReportInput(input:Record<string,unknown>):PublishReportInput{return {handoffId:uuid(input.handoffId),expectedVersion:positiveVersion(input.expectedVersion),documentVersionId:uuid(input.documentVersionId),documentGrantId:uuid(input.documentGrantId),key:reportKey(input.key)};}
export function withdrawReportInput(input:Record<string,unknown>):WithdrawReportInput{return {handoffId:uuid(input.handoffId),publicationId:uuid(input.publicationId),expectedVersion:positiveVersion(input.expectedVersion),reason:reportReason(input.reason),key:reportKey(input.key)};}
