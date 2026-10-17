import type {AssessmentsModerationFacade} from '../application/moderation';
import type {DecisionOwnerAdapter} from '../../leadership/contracts/decisions';

export class AssessmentsModerationDecisionAdapter implements DecisionOwnerAdapter{
 readonly owner='ASSESSMENTS_MODERATION' as const;
 constructor(private readonly assessments:AssessmentsModerationFacade){}
 list(actor:Parameters<DecisionOwnerAdapter['list']>[0],organizationId:string,schoolId:string,input:Parameters<DecisionOwnerAdapter['list']>[3]){return this.assessments.list(actor,organizationId,schoolId,input);}
 get(actor:Parameters<DecisionOwnerAdapter['get']>[0],organizationId:string,schoolId:string,id:string){return this.assessments.get(actor,organizationId,schoolId,id);}
 decide(actor:Parameters<DecisionOwnerAdapter['decide']>[0],organizationId:string,schoolId:string,id:string,input:Parameters<DecisionOwnerAdapter['decide']>[4]){return this.assessments.decide(actor,organizationId,schoolId,id,input);}
 status(actor:Parameters<DecisionOwnerAdapter['status']>[0],organizationId:string,schoolId:string,id:string,input:Parameters<DecisionOwnerAdapter['status']>[4]){return this.assessments.decisionStatus(actor,organizationId,schoolId,id,input);}
 requestInformation(actor:Parameters<DecisionOwnerAdapter['requestInformation']>[0],organizationId:string,schoolId:string,id:string,input:Parameters<DecisionOwnerAdapter['requestInformation']>[4]){return this.assessments.requestInformation(actor,organizationId,schoolId,id,input);}
 reviewers(actor:Parameters<DecisionOwnerAdapter['reviewers']>[0],organizationId:string,schoolId:string,id:string){return this.assessments.reviewers(actor,organizationId,schoolId,id);}
 recuse(actor:Parameters<DecisionOwnerAdapter['recuse']>[0],organizationId:string,schoolId:string,id:string,input:Parameters<DecisionOwnerAdapter['recuse']>[4]){return this.assessments.recuse(actor,organizationId,schoolId,id,input);}
}
