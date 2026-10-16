import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AdminNoticeSummary,LeadershipNoticeCoverage,NoticeAcknowledgementResult,NoticeDetail,NoticePublicationResult,NoticeSummary,NoticeWithdrawalResult} from '../../../../shared/contracts/communication';
import {AccessError} from '../../access/contracts/index';
import {communicationId,publishNoticeInput,withdrawNoticeInput} from '../domain/notices';
export interface CommunicationRepository{
 grantPublisher(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string}):Promise<{grantId:string;version:number}>;
 publish(actor:Identity,input:{organizationId:string;schoolId:string;sectionId:string;title:string;body:string;requiresAcknowledgement:boolean;key:string;requestId:string}):Promise<NoticePublicationResult>;
 listAdmin(actor:Identity,input:{organizationId:string;schoolId:string}):Promise<readonly AdminNoticeSummary[]>;
 listLeadership(actor:Identity,input:{organizationId:string;schoolId:string;limit:number}):Promise<LeadershipNoticeCoverage>;
 listParent(actor:Identity,input:{studentId:string}):Promise<readonly NoticeSummary[]>;
 detailParent(actor:Identity,input:{studentId:string;noticeId:string}):Promise<NoticeDetail>;
 markRead(actor:Identity,input:{studentId:string;noticeId:string;versionId:string}):Promise<{readAt:string}>;
 acknowledge(actor:Identity,input:{studentId:string;noticeId:string;versionId:string;key:string;requestId:string}):Promise<NoticeAcknowledgementResult>;
 listStudent(actor:Identity,input:{studentId:string}):Promise<readonly NoticeSummary[]>;
 detailStudent(actor:Identity,input:{studentId:string;noticeId:string}):Promise<NoticeDetail>;
 markStudentRead(actor:Identity,input:{studentId:string;noticeId:string;versionId:string}):Promise<{readAt:string}>;
 acknowledgeStudent(actor:Identity,input:{studentId:string;noticeId:string;versionId:string;key:string;requestId:string}):Promise<NoticeAcknowledgementResult>;
 withdraw(actor:Identity,input:{organizationId:string;schoolId:string;noticeId:string;expectedRevision:number;reason:string;key:string;requestId:string}):Promise<NoticeWithdrawalResult>;
}
export function createCommunicationUseCases(repository:CommunicationRepository){const actor=(identity:Identity|null)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');return identity;};return {
 grantPublisher:(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown})=>repository.grantPublisher(operator,{organizationId:communicationId(input.organizationId),schoolId:communicationId(input.schoolId),accountId:communicationId(input.accountId)}),
 publish:(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown,requestId:string)=>repository.publish(actor(identity),{organizationId:communicationId(organizationId),schoolId:communicationId(schoolId),...publishNoticeInput(input),requestId:communicationId(requestId)}),
 listAdmin:(identity:Identity|null,organizationId:unknown,schoolId:unknown)=>repository.listAdmin(actor(identity),{organizationId:communicationId(organizationId),schoolId:communicationId(schoolId)}),
 listLeadership:(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Readonly<{limit?:unknown}>={})=>repository.listLeadership(actor(identity),{organizationId:communicationId(organizationId),schoolId:communicationId(schoolId),limit:input.limit===undefined?100:Number.isSafeInteger(input.limit)&&Number(input.limit)>=1&&Number(input.limit)<=100?Number(input.limit):(()=>{throw new AccessError('VALIDATION');})()}),
 listParent:(identity:Identity|null,studentId:unknown)=>repository.listParent(actor(identity),{studentId:communicationId(studentId)}),
 detailParent:(identity:Identity|null,studentId:unknown,noticeId:unknown)=>repository.detailParent(actor(identity),{studentId:communicationId(studentId),noticeId:communicationId(noticeId)}),
 markRead:(identity:Identity|null,input:{studentId:unknown;noticeId:unknown;versionId:unknown})=>repository.markRead(actor(identity),{studentId:communicationId(input.studentId),noticeId:communicationId(input.noticeId),versionId:communicationId(input.versionId)}),
 acknowledge:(identity:Identity|null,input:{studentId:unknown;noticeId:unknown;versionId:unknown;key:unknown},requestId:string)=>repository.acknowledge(actor(identity),{studentId:communicationId(input.studentId),noticeId:communicationId(input.noticeId),versionId:communicationId(input.versionId),key:communicationId(input.key),requestId:communicationId(requestId)}),
 listStudent:(identity:Identity|null,studentId:unknown)=>repository.listStudent(actor(identity),{studentId:communicationId(studentId)}),
 detailStudent:(identity:Identity|null,studentId:unknown,noticeId:unknown)=>repository.detailStudent(actor(identity),{studentId:communicationId(studentId),noticeId:communicationId(noticeId)}),
 markStudentRead:(identity:Identity|null,input:{studentId:unknown;noticeId:unknown;versionId:unknown})=>repository.markStudentRead(actor(identity),{studentId:communicationId(input.studentId),noticeId:communicationId(input.noticeId),versionId:communicationId(input.versionId)}),
 acknowledgeStudent:(identity:Identity|null,input:{studentId:unknown;noticeId:unknown;versionId:unknown;key:unknown},requestId:string)=>repository.acknowledgeStudent(actor(identity),{studentId:communicationId(input.studentId),noticeId:communicationId(input.noticeId),versionId:communicationId(input.versionId),key:communicationId(input.key),requestId:communicationId(requestId)}),
 withdraw:(identity:Identity|null,organizationId:unknown,schoolId:unknown,noticeId:unknown,input:unknown,requestId:string)=>repository.withdraw(actor(identity),{organizationId:communicationId(organizationId),schoolId:communicationId(schoolId),noticeId:communicationId(noticeId),...withdrawNoticeInput(input),requestId:communicationId(requestId)}),
};}
export type CommunicationFacade=ReturnType<typeof createCommunicationUseCases>;
