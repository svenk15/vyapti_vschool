import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {LearningManagerCapability,LearningManagerWorkspace,LearningRecipientEvidencePage,LearningRecipientPolicyResult} from '../../../../shared/contracts/learning';
import {AccessError} from '../../access/contracts/index';
import {managerCapability,policyId,recipientPolicyInput} from '../domain/recipient-policy';

export interface LearningRecipientPolicyRepository{
 managerWorkspace(actor:Identity,input:{organizationId:string;schoolId:string}):Promise<LearningManagerWorkspace>;
 recipientEvidence(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string}):Promise<LearningRecipientEvidencePage>;
 apply(actor:Identity,input:{organizationId:string;schoolId:string;assignmentId:string;requestId:string}&ReturnType<typeof recipientPolicyInput>):Promise<LearningRecipientPolicyResult>;
 grant(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;sectionId:string;subjectId:string;capability:LearningManagerCapability}):Promise<{grantId:string;version:number}>;
 revoke(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;sectionId:string;subjectId:string;capability:LearningManagerCapability}):Promise<{grantId:string;version:number}>;
}
const scope=(actor:Identity|null,organizationId:unknown,schoolId:unknown)=>{if(!actor)throw new AccessError('UNAUTHENTICATED');return {actor,organizationId:policyId(organizationId),schoolId:policyId(schoolId)};};
export function createLearningRecipientPolicyUseCases(repository:LearningRecipientPolicyRepository){return {
 managerWorkspace(identity:Identity|null,organizationId:unknown,schoolId:unknown){const s=scope(identity,organizationId,schoolId);return repository.managerWorkspace(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId});},
 recipientEvidence(identity:Identity|null,organizationId:unknown,schoolId:unknown,assignmentId:unknown){const s=scope(identity,organizationId,schoolId);return repository.recipientEvidence(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId,assignmentId:policyId(assignmentId)});},
 applyRecipientPolicy(identity:Identity|null,organizationId:unknown,schoolId:unknown,assignmentId:unknown,value:unknown,requestId:unknown){const s=scope(identity,organizationId,schoolId);return repository.apply(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId,assignmentId:policyId(assignmentId),requestId:policyId(requestId),...recipientPolicyInput(value)});},
 grantLearningManager(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;sectionId:string;subjectId:string;capability:LearningManagerCapability}){return repository.grant(operator,{organizationId:policyId(input.organizationId),schoolId:policyId(input.schoolId),accountId:policyId(input.accountId),sectionId:policyId(input.sectionId),subjectId:policyId(input.subjectId),capability:managerCapability(input.capability)});},
 revokeLearningManager(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;sectionId:string;subjectId:string;capability:LearningManagerCapability}){return repository.revoke(operator,{organizationId:policyId(input.organizationId),schoolId:policyId(input.schoolId),accountId:policyId(input.accountId),sectionId:policyId(input.sectionId),subjectId:policyId(input.subjectId),capability:managerCapability(input.capability)});},
};}
