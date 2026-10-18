import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {AssessmentReportCommandStatus,AssessmentReportHandoffResult,AssessmentReportPortal,AssessmentReportPublicationResult,AssessmentReportPublicationWorkspace,AssessmentReportSource,AssessmentReportWithdrawalResult} from '../../../../shared/contracts/assessment-publications';
import {AssessmentsError,uuid} from '../domain/readiness';
import {assignReportInput,publishReportInput,withdrawReportInput,type AssignReportInput,type PublishReportInput,type WithdrawReportInput} from '../domain/publication';
type Scope={organizationId:string;schoolId:string};
export interface AssessmentReportPublicationRepository{
 available(actor:Identity,scope:Scope):Promise<boolean>;
 workspace(actor:Identity,scope:Scope):Promise<AssessmentReportPublicationWorkspace>;
 assign(actor:Identity,scope:Scope,input:AssignReportInput):Promise<AssessmentReportHandoffResult>;
 source(actor:Identity,scope:Scope,handoffId:string):Promise<AssessmentReportSource>;
 publish(actor:Identity,scope:Scope,input:PublishReportInput):Promise<AssessmentReportPublicationResult>;
 withdraw(actor:Identity,scope:Scope,input:WithdrawReportInput):Promise<AssessmentReportWithdrawalResult>;
 status(actor:Identity,scope:Scope,input:{command:'AssignAssessmentReportPublisher'|'PublishAssessmentReport'|'WithdrawAssessmentReport';key:string;handoffId?:string;expectedVersion?:number}):Promise<AssessmentReportCommandStatus>;
 recipient(actor:Identity,kind:'GUARDIAN'|'STUDENT',studentId:string):Promise<AssessmentReportPortal>;
 grantCapability(operator:OperatorPrincipal,input:Scope&{accountId:string;capability:'PUBLISH'|'WITHDRAW'}):Promise<void>;
}
export function createAssessmentReportPublicationUseCases(repository:AssessmentReportPublicationRepository){const actor=(identity:Identity|null)=>{if(!identity)throw new AssessmentsError('UNAUTHENTICATED');return identity;};return {
 publicationAvailable:(identity:Identity|null,organizationId:unknown,schoolId:unknown)=>repository.available(actor(identity),{organizationId:uuid(organizationId),schoolId:uuid(schoolId)}),
 publicationWorkspace:(identity:Identity|null,organizationId:unknown,schoolId:unknown)=>repository.workspace(actor(identity),{organizationId:uuid(organizationId),schoolId:uuid(schoolId)}),
 assignReportPublisher:(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>)=>repository.assign(actor(identity),{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},assignReportInput(input)),
 reportSource:(identity:Identity|null,organizationId:unknown,schoolId:unknown,handoffId:unknown)=>repository.source(actor(identity),{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},uuid(handoffId)),
 publishReport:(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>)=>repository.publish(actor(identity),{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},publishReportInput(input)),
 withdrawReport:(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:Record<string,unknown>)=>repository.withdraw(actor(identity),{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},withdrawReportInput(input)),
 reportCommandStatus:(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:{command:unknown;key:unknown;handoffId?:unknown;expectedVersion?:unknown})=>{if(!['AssignAssessmentReportPublisher','PublishAssessmentReport','WithdrawAssessmentReport'].includes(String(input.command)))throw new AssessmentsError('VALIDATION');return repository.status(actor(identity),{organizationId:uuid(organizationId),schoolId:uuid(schoolId)},{command:String(input.command) as 'AssignAssessmentReportPublisher'|'PublishAssessmentReport'|'WithdrawAssessmentReport',key:uuid(input.key),...(input.handoffId?{handoffId:uuid(input.handoffId)}:{}),...(input.expectedVersion!==undefined?{expectedVersion:Number(input.expectedVersion)}:{})});},
 guardianReports:(identity:Identity|null,studentId:unknown)=>repository.recipient(actor(identity),'GUARDIAN',uuid(studentId)),
 studentReports:(identity:Identity|null,studentId:unknown)=>repository.recipient(actor(identity),'STUDENT',uuid(studentId)),
 grantReportCapability:(operator:OperatorPrincipal,input:Scope&{accountId:string;capability:'PUBLISH'|'WITHDRAW'})=>repository.grantCapability(operator,{organizationId:uuid(input.organizationId),schoolId:uuid(input.schoolId),accountId:uuid(input.accountId),capability:input.capability})
};}
export type AssessmentReportPublicationFacade=ReturnType<typeof createAssessmentReportPublicationUseCases>;
