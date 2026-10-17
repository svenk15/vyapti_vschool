import 'server-only';
import {AccessError} from '../../backend/modules/access/contracts';
import {createCommunicationServices} from '../../backend/composition/communication';
import type {Identity} from '../../shared/contracts/access';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {accountGateway,leadershipGateway} from './access';
type Service=ReturnType<typeof createCommunicationServices>;let services:Service|undefined;try{services=createCommunicationServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),now:()=>new Date()});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;};const required=(identity:Identity|null)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');return identity;};
async function scope(identity:Identity|null){const actor=required(identity),home=await accountGateway.getHome(actor);return {actor,...home.scope};}
export const communicationGateway={
 async saveProposal(identity:Identity|null,proposalId:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().saveProposal(actor,organizationId,schoolId,proposalId,input,requestId);},
 async listAuthorProposals(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().listAuthorProposals(actor,organizationId,schoolId);},
 async authorProposalDetail(identity:Identity|null,proposalId:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().authorProposalDetail(actor,organizationId,schoolId,proposalId);},
 async submitProposal(identity:Identity|null,proposalId:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().submitProposal(actor,organizationId,schoolId,proposalId,input,requestId);},
 async listReviewProposals(identity:Identity|null){const actor=required(identity),home=await leadershipGateway.getHome(actor);return service().listReviewProposals(actor,home.scope.organizationId,home.scope.schoolId);},
 async reviewProposalDetail(identity:Identity|null,proposalId:unknown){const actor=required(identity),home=await leadershipGateway.getHome(actor);return service().reviewProposalDetail(actor,home.scope.organizationId,home.scope.schoolId,proposalId);},
 async decideProposal(identity:Identity|null,proposalId:unknown,input:unknown,requestId:string){const actor=required(identity),home=await leadershipGateway.getHome(actor);return service().decideProposal(actor,home.scope.organizationId,home.scope.schoolId,proposalId,input,requestId);},
 async publishProposal(identity:Identity|null,proposalId:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().publishProposal(actor,organizationId,schoolId,proposalId,input,requestId);},
 async publish(identity:Identity|null,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().publish(actor,organizationId,schoolId,input,requestId);},
 async listAdmin(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().listAdmin(actor,organizationId,schoolId);},
 async listLeadership(identity:Identity|null,input:Readonly<{limit?:number}>={}){const actor=required(identity),home=await leadershipGateway.getHome(actor);return service().listLeadership(actor,home.scope.organizationId,home.scope.schoolId,input);},
 async previewAcknowledgementReminder(identity:Identity|null,noticeId:unknown,versionId:unknown){const actor=required(identity),home=await leadershipGateway.getHome(actor);return service().previewAcknowledgementReminder(actor,home.scope.organizationId,home.scope.schoolId,noticeId,versionId);},
 async sendAcknowledgementReminder(identity:Identity|null,noticeId:unknown,input:unknown,requestId:string){const actor=required(identity),home=await leadershipGateway.getHome(actor);return service().sendAcknowledgementReminder(actor,home.scope.organizationId,home.scope.schoolId,noticeId,input,requestId);},
 listParent:(identity:Identity|null,studentId:unknown)=>service().listParent(required(identity),studentId),
 detailParent:(identity:Identity|null,studentId:unknown,noticeId:unknown)=>service().detailParent(required(identity),studentId,noticeId),
 markRead:(identity:Identity|null,input:{studentId:unknown;noticeId:unknown;versionId:unknown})=>service().markRead(required(identity),input),
 acknowledge:(identity:Identity|null,input:{studentId:unknown;noticeId:unknown;versionId:unknown;key:unknown},requestId:string)=>service().acknowledge(required(identity),input,requestId),
 listStudent:(identity:Identity|null,studentId:unknown)=>service().listStudent(required(identity),studentId),
 detailStudent:(identity:Identity|null,studentId:unknown,noticeId:unknown)=>service().detailStudent(required(identity),studentId,noticeId),
 markStudentRead:(identity:Identity|null,input:{studentId:unknown;noticeId:unknown;versionId:unknown})=>service().markStudentRead(required(identity),input),
 acknowledgeStudent:(identity:Identity|null,input:{studentId:unknown;noticeId:unknown;versionId:unknown;key:unknown},requestId:string)=>service().acknowledgeStudent(required(identity),input,requestId),
 async withdraw(identity:Identity|null,noticeId:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().withdraw(actor,organizationId,schoolId,noticeId,input,requestId);},
};
