import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {SupportCapability,SupportCommandResult,SupportCommandStatus,SupportHandoffSummary,SupportProcedureView,SupportPupilCandidate,SupportReferralDetail,SupportReferralSummary,SupportSpecialistCandidate} from '../../../../shared/contracts/support';
import {capability,handoffAckInput,handoffInput,procedureInput,referralCreateInput,referralTransitionInput,supportId,supportKey} from '../domain/support';
import {AccessError} from '../../access/contracts/index';

export interface SupportRepository{
 grant(operator:OperatorPrincipal,input:{organizationId:string;schoolId:string;accountId:string;capability:SupportCapability;studentId:string|null}):Promise<{grantId:string;version:number}>;
 pupils(actor:Identity,scope:{organizationId:string;schoolId:string}):Promise<readonly SupportPupilCandidate[]>;
 specialists(actor:Identity,scope:{organizationId:string;schoolId:string}):Promise<readonly SupportSpecialistCandidate[]>;
 createReferral(actor:Identity,input:{organizationId:string;schoolId:string;studentId:string;specialistAccountId:string;factualConcern:string;key:string;requestId:string}):Promise<SupportCommandResult>;
 listReferrals(actor:Identity,scope:{organizationId:string;schoolId:string}):Promise<readonly SupportReferralSummary[]>;
 getReferral(actor:Identity,scope:{organizationId:string;schoolId:string},id:string):Promise<SupportReferralDetail>;
 transitionReferral(actor:Identity,input:{organizationId:string;schoolId:string;id:string;action:'ACKNOWLEDGE'|'RETURN'|'CLOSE';expectedVersion:number;key:string;requestId:string}):Promise<SupportCommandResult>;
 currentProcedure(actor:Identity,scope:{organizationId:string;schoolId:string}):Promise<SupportProcedureView|null>;
 publishProcedure(actor:Identity,input:{organizationId:string;schoolId:string;title:string;instruction:string;contactLabel:string;responsibleAccountId:string;key:string;requestId:string}):Promise<SupportCommandResult>;
 recordHandoff(actor:Identity,input:{organizationId:string;schoolId:string;procedureId:string;procedureVersion:number;safeReference:string;key:string;requestId:string}):Promise<SupportCommandResult>;
 listHandoffs(actor:Identity,scope:{organizationId:string;schoolId:string}):Promise<readonly SupportHandoffSummary[]>;
 acknowledgeHandoff(actor:Identity,input:{organizationId:string;schoolId:string;id:string;expectedVersion:number;key:string;requestId:string}):Promise<SupportCommandResult>;
 status(actor:Identity,scope:{organizationId:string;schoolId:string},key:string):Promise<SupportCommandStatus>;
}
const scoped=(actor:Identity|null,organizationId:unknown,schoolId:unknown)=>{if(!actor)throw new AccessError('UNAUTHENTICATED');return {actor,organizationId:supportId(organizationId),schoolId:supportId(schoolId)};};
export function createSupportUseCases(repository:SupportRepository){return {
 grant:(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown;capability:unknown;studentId?:unknown})=>repository.grant(operator,{organizationId:supportId(input.organizationId),schoolId:supportId(input.schoolId),accountId:supportId(input.accountId),capability:capability(input.capability),studentId:input.studentId?supportId(input.studentId):null}),
 pupils(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scoped(actor,organizationId,schoolId);return repository.pupils(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId});},
 specialists(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scoped(actor,organizationId,schoolId);return repository.specialists(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId});},
 createReferral(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown,requestId:string){const s=scoped(actor,organizationId,schoolId);return repository.createReferral(s.actor,{...s,...referralCreateInput(input),requestId});},
 listReferrals(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scoped(actor,organizationId,schoolId);return repository.listReferrals(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId});},
 getReferral(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown){const s=scoped(actor,organizationId,schoolId);return repository.getReferral(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId},supportId(id));},
 transitionReferral(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scoped(actor,organizationId,schoolId);return repository.transitionReferral(s.actor,{...s,id:supportId(id),...referralTransitionInput(input),requestId});},
 currentProcedure(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scoped(actor,organizationId,schoolId);return repository.currentProcedure(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId});},
 publishProcedure(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown,requestId:string){const s=scoped(actor,organizationId,schoolId);return repository.publishProcedure(s.actor,{...s,...procedureInput(input),requestId});},
 recordHandoff(actor:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown,requestId:string){const s=scoped(actor,organizationId,schoolId);return repository.recordHandoff(s.actor,{...s,...handoffInput(input),requestId});},
 listHandoffs(actor:Identity|null,organizationId:unknown,schoolId:unknown){const s=scoped(actor,organizationId,schoolId);return repository.listHandoffs(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId});},
 acknowledgeHandoff(actor:Identity|null,organizationId:unknown,schoolId:unknown,id:unknown,input:unknown,requestId:string){const s=scoped(actor,organizationId,schoolId);return repository.acknowledgeHandoff(s.actor,{...s,id:supportId(id),...handoffAckInput(input),requestId});},
 status(actor:Identity|null,organizationId:unknown,schoolId:unknown,key:unknown){const s=scoped(actor,organizationId,schoolId);return repository.status(s.actor,{organizationId:s.organizationId,schoolId:s.schoolId},supportKey(key));},
};}
export type SupportFacade=ReturnType<typeof createSupportUseCases>;
