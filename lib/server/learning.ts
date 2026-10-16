import 'server-only';
import {AccessError} from '../../backend/modules/access/contracts';
import {createLearningServices} from '../../backend/composition/learning';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import type {Identity} from '../../shared/contracts/access';
import {accountGateway,leadershipGateway} from './access';
type Services=ReturnType<typeof createLearningServices>;let services:Services|undefined;try{services=createLearningServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),now:()=>new Date()});}catch{}
const service=()=>{if(!services)throw new AccessError('UNAVAILABLE');return services;},required=(identity:Identity|null)=>{if(!identity)throw new AccessError('UNAUTHENTICATED');return identity;};
async function scope(identity:Identity|null){const actor=required(identity),home=await accountGateway.getHome(actor);return {actor,...home.scope};}
export const learningGateway={
 async teacherWorkspace(identity:Identity|null){const {actor,organizationId,schoolId}=await scope(identity);return service().teacherWorkspace(actor,organizationId,schoolId);},
 async createDraft(identity:Identity|null,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().createDraft(actor,organizationId,schoolId,input,requestId);},
 async updateDraft(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().updateDraft(actor,organizationId,schoolId,id,input,requestId);},
 async publish(identity:Identity|null,id:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().publish(actor,organizationId,schoolId,id,input,requestId);},
 listParent:(identity:Identity|null,studentId:unknown)=>service().listParent(required(identity),studentId),
 detailParent:(identity:Identity|null,studentId:unknown,id:unknown)=>service().detailParent(required(identity),studentId,id),
 listStudent:(identity:Identity|null,studentId:unknown)=>service().listStudent(required(identity),studentId),
 queryStudent:(identity:Identity|null,studentId:unknown,query:unknown)=>service().queryStudent(required(identity),studentId,query),
 detailStudent:(identity:Identity|null,studentId:unknown,id:unknown)=>service().detailStudent(required(identity),studentId,id),
 studentWork:(identity:Identity|null,studentId:unknown,id:unknown)=>service().studentWork(required(identity),studentId,id),
 saveStudentDraft:(identity:Identity|null,id:unknown,input:unknown,requestId:string)=>service().saveStudentDraft(required(identity),id,input,requestId),
 submitStudentWork:(identity:Identity|null,id:unknown,input:unknown,requestId:string)=>service().submitStudentWork(required(identity),id,input,requestId),
 async teacherSubmissions(identity:Identity|null,id:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().teacherSubmissions(actor,organizationId,schoolId,id);},
 async teacherSubmission(identity:Identity|null,id:unknown,submissionId:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().teacherSubmission(actor,organizationId,schoolId,id,submissionId);},
 async teacherFeedback(identity:Identity|null,id:unknown,submissionId:unknown){const {actor,organizationId,schoolId}=await scope(identity);return service().teacherFeedback(actor,organizationId,schoolId,id,submissionId);},
 async saveFeedbackDraft(identity:Identity|null,id:unknown,submissionId:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().saveFeedbackDraft(actor,organizationId,schoolId,id,submissionId,input,requestId);},
 async publishFeedback(identity:Identity|null,id:unknown,submissionId:unknown,input:unknown,requestId:string){const {actor,organizationId,schoolId}=await scope(identity);return service().publishFeedback(actor,organizationId,schoolId,id,submissionId,input,requestId);},
 async leadershipOverview(identity:Identity|null,query:unknown){const actor=required(identity),home=await leadershipGateway.getHome(actor);return service().leadershipLearningOverview(actor,home.scope.organizationId,home.scope.schoolId,query);},
 async leadershipFeedbackTurnaround(identity:Identity|null,query:unknown){const actor=required(identity),home=await leadershipGateway.getHome(actor);return service().leadershipFeedbackTurnaround(actor,home.scope.organizationId,home.scope.schoolId,query);},
};
