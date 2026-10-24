import type {AttendanceReviewQuery,AttendanceReviewPage} from '../../../../shared/contracts/attendance-review';
import {reviewQuery} from './review-query';
import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AttendanceCorrectionGrantPurpose,AttendanceCorrectionRequestItem,AttendanceCorrectionRequestResult} from '../../../../shared/contracts/attendance-correction-requests';
import {AttendanceCorrectionRequestError,attendanceStatus,lateMinutes,narrative,positiveVersion,requesterKind,requiredUuid} from '../domain/correction-requests';
export interface AttendanceCorrectionRequestRepository{
 reviewPage(actor:Identity,input:{organizationId:string;schoolId:string;query:AttendanceReviewQuery}):Promise<AttendanceReviewPage<AttendanceCorrectionRequestItem>>;
 routingAvailable(actor:Identity,input:{organizationId:string;schoolId:string}):Promise<boolean>;
 grant(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;purpose:AttendanceCorrectionGrantPurpose}):Promise<{grantId:string;version:number}>;
 submit(actor:Identity,input:{kind:'GUARDIAN'|'STUDENT'|'TEACHER';studentId:string;sessionId:string;sourceRevision:number;status:ReturnType<typeof attendanceStatus>;lateMinutes:number|null;reason:string;key:string;requestId:string}):Promise<AttendanceCorrectionRequestResult>;
 listOwn(actor:Identity,input:{kind:'GUARDIAN'|'STUDENT'|'TEACHER';studentId?:string}):Promise<readonly AttendanceCorrectionRequestItem[]>;
 getOwn(actor:Identity,input:{kind:'GUARDIAN'|'STUDENT'|'TEACHER';id:string;studentId?:string}):Promise<AttendanceCorrectionRequestItem>;
 withdraw(actor:Identity,input:{kind:'GUARDIAN'|'STUDENT'|'TEACHER';id:string;studentId?:string;expectedVersion:number;key:string;requestId:string}):Promise<AttendanceCorrectionRequestResult>;
 listRouting(actor:Identity,input:{organizationId:string;schoolId:string}):Promise<readonly AttendanceCorrectionRequestItem[]>;
 listReviewers(actor:Identity,input:{organizationId:string;schoolId:string}):Promise<readonly {grantId:string;accountId:string;displayName:string}[]>;
 route(actor:Identity,input:{organizationId:string;schoolId:string;id:string;expectedVersion:number;reviewerGrantId:string;key:string;requestId:string}):Promise<AttendanceCorrectionRequestResult>;
 listReview(actor:Identity,input:{organizationId:string;schoolId:string}):Promise<readonly AttendanceCorrectionRequestItem[]>;
 getReview(actor:Identity,input:{organizationId:string;schoolId:string;id:string}):Promise<AttendanceCorrectionRequestItem>;
 decide(actor:Identity,input:{organizationId:string;schoolId:string;id:string;expectedVersion:number;decision:'APPLY'|'DECLINE';note:string;key:string;correctionKey:string;requestId:string}):Promise<AttendanceCorrectionRequestResult>;
}
export function createAttendanceCorrectionRequestUseCases(repository:AttendanceCorrectionRequestRepository){return {
 reviewPage:(actor:Identity,organizationId:unknown,schoolId:unknown,query:Partial<AttendanceReviewQuery>={})=>repository.reviewPage(actor,{organizationId:requiredUuid(organizationId),schoolId:requiredUuid(schoolId),query:reviewQuery(query)}),
 routingAvailable:(actor:Identity,organizationId:unknown,schoolId:unknown)=>repository.routingAvailable(actor,{organizationId:requiredUuid(organizationId),schoolId:requiredUuid(schoolId)}),
 grant:(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown;purpose:AttendanceCorrectionGrantPurpose})=>repository.grant(operator,{organizationId:requiredUuid(input.organizationId),schoolId:requiredUuid(input.schoolId),accountId:requiredUuid(input.accountId),purpose:input.purpose}),
 submit:(actor:Identity,input:{kind:unknown;studentId:unknown;sessionId:unknown;sourceRevision:unknown;status:unknown;lateMinutes?:unknown;reason:unknown;key:unknown;requestId:unknown})=>{const status=attendanceStatus(input.status);return repository.submit(actor,{kind:requesterKind(input.kind),studentId:requiredUuid(input.studentId),sessionId:requiredUuid(input.sessionId),sourceRevision:positiveVersion(input.sourceRevision),status,lateMinutes:lateMinutes(status,input.lateMinutes),reason:narrative(input.reason),key:requiredUuid(input.key),requestId:requiredUuid(input.requestId)});},
 listOwn:(actor:Identity,kind:unknown,studentId?:unknown)=>repository.listOwn(actor,{kind:requesterKind(kind),...(studentId?{studentId:requiredUuid(studentId)}:{})}),
 getOwn:(actor:Identity,kind:unknown,id:unknown,studentId?:unknown)=>repository.getOwn(actor,{kind:requesterKind(kind),id:requiredUuid(id),...(studentId?{studentId:requiredUuid(studentId)}:{})}),
 withdraw:(actor:Identity,input:{kind:unknown;id:unknown;studentId?:unknown;expectedVersion:unknown;key:unknown;requestId:unknown})=>repository.withdraw(actor,{kind:requesterKind(input.kind),id:requiredUuid(input.id),...(input.studentId?{studentId:requiredUuid(input.studentId)}:{}),expectedVersion:positiveVersion(input.expectedVersion),key:requiredUuid(input.key),requestId:requiredUuid(input.requestId)}),
 listRouting:(actor:Identity,organizationId:unknown,schoolId:unknown)=>repository.listRouting(actor,{organizationId:requiredUuid(organizationId),schoolId:requiredUuid(schoolId)}),
 listReviewers:(actor:Identity,organizationId:unknown,schoolId:unknown)=>repository.listReviewers(actor,{organizationId:requiredUuid(organizationId),schoolId:requiredUuid(schoolId)}),
 route:(actor:Identity,input:{organizationId:unknown;schoolId:unknown;id:unknown;expectedVersion:unknown;reviewerGrantId:unknown;key:unknown;requestId:unknown})=>repository.route(actor,{organizationId:requiredUuid(input.organizationId),schoolId:requiredUuid(input.schoolId),id:requiredUuid(input.id),expectedVersion:positiveVersion(input.expectedVersion),reviewerGrantId:requiredUuid(input.reviewerGrantId),key:requiredUuid(input.key),requestId:requiredUuid(input.requestId)}),
 listReview:(actor:Identity,organizationId:unknown,schoolId:unknown)=>repository.listReview(actor,{organizationId:requiredUuid(organizationId),schoolId:requiredUuid(schoolId)}),
 getReview:(actor:Identity,organizationId:unknown,schoolId:unknown,id:unknown)=>repository.getReview(actor,{organizationId:requiredUuid(organizationId),schoolId:requiredUuid(schoolId),id:requiredUuid(id)}),
 decide:(actor:Identity,input:{organizationId:unknown;schoolId:unknown;id:unknown;expectedVersion:unknown;decision:unknown;note:unknown;key:unknown;correctionKey:unknown;requestId:unknown})=>repository.decide(actor,{organizationId:requiredUuid(input.organizationId),schoolId:requiredUuid(input.schoolId),id:requiredUuid(input.id),expectedVersion:positiveVersion(input.expectedVersion),decision:input.decision==='APPLY'?'APPLY':input.decision==='DECLINE'?'DECLINE':(()=>{throw new AttendanceCorrectionRequestError('VALIDATION');})(),note:narrative(input.note),key:requiredUuid(input.key),correctionKey:requiredUuid(input.correctionKey),requestId:requiredUuid(input.requestId)})
};}
