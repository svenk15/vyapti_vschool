import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AttendanceExplanationClarificationResult,AttendanceExplanationItem,AttendanceExplanationResult} from '../../../../shared/contracts/attendance-explanations';
import {category,decision,narrative,positiveVersion,requiredUuid} from '../domain/explanations';
export interface AttendanceExplanationRepository{
 grantReviewer(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string}):Promise<{grantId:string;version:number}>;
 submit(actor:Identity,input:{studentId:string;sessionId:string;category:ReturnType<typeof category>;explanation:string;key:string;requestId:string}):Promise<AttendanceExplanationResult>;
 listParent(actor:Identity,input:{studentId:string}):Promise<readonly AttendanceExplanationItem[]>;
 getParent(actor:Identity,input:{studentId:string;id:string}):Promise<AttendanceExplanationItem>;
 withdraw(actor:Identity,input:{studentId:string;id:string;expectedVersion:number;key:string;requestId:string}):Promise<AttendanceExplanationResult>;
 listReviewer(actor:Identity,input:{organizationId:string;schoolId:string}):Promise<readonly AttendanceExplanationItem[]>;
 getReviewer(actor:Identity,input:{organizationId:string;schoolId:string;id:string}):Promise<AttendanceExplanationItem>;
 requestClarification(actor:Identity,input:{organizationId:string;schoolId:string;id:string;expectedVersion:number;question:string;key:string;requestId:string}):Promise<AttendanceExplanationClarificationResult>;
 respondClarification(actor:Identity,input:{studentId:string;id:string;clarificationId:string;expectedVersion:number;expectedClarificationVersion:number;answer:string;key:string;requestId:string}):Promise<AttendanceExplanationClarificationResult>;
 review(actor:Identity,input:{organizationId:string;schoolId:string;id:string;expectedVersion:number;decision:'ACCEPTED'|'DECLINED';response:string;key:string;requestId:string}):Promise<AttendanceExplanationResult>;
}
export function createAttendanceExplanationUseCases(repository:AttendanceExplanationRepository){return {
 grantReviewer:(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown})=>repository.grantReviewer(operator,{organizationId:requiredUuid(input.organizationId),schoolId:requiredUuid(input.schoolId),accountId:requiredUuid(input.accountId)}),
 submit:(actor:Identity,input:{studentId:unknown;sessionId:unknown;category:unknown;explanation:unknown;key:unknown;requestId:string})=>repository.submit(actor,{studentId:requiredUuid(input.studentId),sessionId:requiredUuid(input.sessionId),category:category(input.category),explanation:narrative(input.explanation),key:requiredUuid(input.key),requestId:requiredUuid(input.requestId)}),
 listParent:(actor:Identity,studentId:unknown)=>repository.listParent(actor,{studentId:requiredUuid(studentId)}),
 getParent:(actor:Identity,studentId:unknown,id:unknown)=>repository.getParent(actor,{studentId:requiredUuid(studentId),id:requiredUuid(id)}),
 withdraw:(actor:Identity,input:{studentId:unknown;id:unknown;expectedVersion:unknown;key:unknown;requestId:string})=>repository.withdraw(actor,{studentId:requiredUuid(input.studentId),id:requiredUuid(input.id),expectedVersion:positiveVersion(input.expectedVersion),key:requiredUuid(input.key),requestId:requiredUuid(input.requestId)}),
 listReviewer:(actor:Identity,organizationId:unknown,schoolId:unknown)=>repository.listReviewer(actor,{organizationId:requiredUuid(organizationId),schoolId:requiredUuid(schoolId)}),
 getReviewer:(actor:Identity,organizationId:unknown,schoolId:unknown,id:unknown)=>repository.getReviewer(actor,{organizationId:requiredUuid(organizationId),schoolId:requiredUuid(schoolId),id:requiredUuid(id)}),
 requestClarification:(actor:Identity,input:{organizationId:unknown;schoolId:unknown;id:unknown;expectedVersion:unknown;question:unknown;key:unknown;requestId:string})=>repository.requestClarification(actor,{organizationId:requiredUuid(input.organizationId),schoolId:requiredUuid(input.schoolId),id:requiredUuid(input.id),expectedVersion:positiveVersion(input.expectedVersion),question:narrative(input.question,5),key:requiredUuid(input.key),requestId:requiredUuid(input.requestId)}),
 respondClarification:(actor:Identity,input:{studentId:unknown;id:unknown;clarificationId:unknown;expectedVersion:unknown;expectedClarificationVersion:unknown;answer:unknown;key:unknown;requestId:string})=>repository.respondClarification(actor,{studentId:requiredUuid(input.studentId),id:requiredUuid(input.id),clarificationId:requiredUuid(input.clarificationId),expectedVersion:positiveVersion(input.expectedVersion),expectedClarificationVersion:positiveVersion(input.expectedClarificationVersion),answer:narrative(input.answer,5),key:requiredUuid(input.key),requestId:requiredUuid(input.requestId)}),
 review:(actor:Identity,input:{organizationId:unknown;schoolId:unknown;id:unknown;expectedVersion:unknown;decision:unknown;response:unknown;key:unknown;requestId:string})=>repository.review(actor,{organizationId:requiredUuid(input.organizationId),schoolId:requiredUuid(input.schoolId),id:requiredUuid(input.id),expectedVersion:positiveVersion(input.expectedVersion),decision:decision(input.decision),response:narrative(input.response,5),key:requiredUuid(input.key),requestId:requiredUuid(input.requestId)})
};}
