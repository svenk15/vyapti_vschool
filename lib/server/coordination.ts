import 'server-only';
import {createCoordinationServices} from '../../backend/composition/coordination';
import type {Identity} from '../../shared/contracts/access';
import {releasedModuleIds} from '../../backend/modules/tenancy/domain/entitlements';
import {accountGateway} from './access';

const coordination=createCoordinationServices({databaseUrl:process.env.DATABASE_URL??'',releasedModules:releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES),mode:process.env.VSCHOOL_COORDINATION_MODE==='synthetic'?'synthetic':'disabled'});
const scoped=async(identity:Identity|null)=>{const scope=(await accountGateway.getHome(identity)).scope;return {identity,organizationId:scope.organizationId,schoolId:scope.schoolId};};
export const coordinationGateway={
 availability:async(identity:Identity|null)=>{const s=await scoped(identity);return coordination.availability(s.identity,s.organizationId,s.schoolId);},
 list:async(identity:Identity|null,input:Parameters<typeof coordination.list>[3]={})=>{const s=await scoped(identity);return coordination.list(s.identity,s.organizationId,s.schoolId,input);},
 get:async(identity:Identity|null,id:string)=>{const s=await scoped(identity);return coordination.get(s.identity,s.organizationId,s.schoolId,id);},
 eligibleAssignees:async(identity:Identity|null,id:string)=>{const s=await scoped(identity);return coordination.eligibleAssignees(s.identity,s.organizationId,s.schoolId,id);},
 sourceAssignees:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.sourceAssignees(s.identity,s.organizationId,s.schoolId,input);},
 sourceSetup:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.sourceSetup(s.identity,s.organizationId,s.schoolId,input);},
 previewBatch:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.previewBatch(s.identity,s.organizationId,s.schoolId,input);},
 submitBatch:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.submitBatch(s.identity,s.organizationId,s.schoolId,input);},
 getBatch:async(identity:Identity|null,id:string)=>{const s=await scoped(identity);return coordination.getBatch(s.identity,s.organizationId,s.schoolId,id);},
 handover:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.handover(s.identity,s.organizationId,s.schoolId,input);},
 getHandover:async(identity:Identity|null,id:string)=>{const s=await scoped(identity);return coordination.getHandover(s.identity,s.organizationId,s.schoolId,id);},
 history:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.history(s.identity,s.organizationId,s.schoolId,input);},
 recordHistoryFinding:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.recordHistoryFinding(s.identity,s.organizationId,s.schoolId,input);},
 create:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.create(s.identity,s.organizationId,s.schoolId,input);},
 assign:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.assign(s.identity,s.organizationId,s.schoolId,input);},
 start:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.start(s.identity,s.organizationId,s.schoolId,input);},
 submit:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.submit(s.identity,s.organizationId,s.schoolId,input);},
 verify:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.verify(s.identity,s.organizationId,s.schoolId,input);},
 returnResolution:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.returnResolution(s.identity,s.organizationId,s.schoolId,input);},
 requestInformation:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.requestInformation(s.identity,s.organizationId,s.schoolId,input);},
 respondInformation:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.respondInformation(s.identity,s.organizationId,s.schoolId,input);},
 decisionReviewers:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.decisionReviewers(s.identity,s.organizationId,s.schoolId,input);},
 recuseDecision:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.recuseDecision(s.identity,s.organizationId,s.schoolId,input);},
 decisionRouteQueue:async(identity:Identity|null)=>{const s=await scoped(identity);return coordination.decisionRouteQueue(s.identity,s.organizationId,s.schoolId);},
 routeDecision:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.routeDecision(s.identity,s.organizationId,s.schoolId,input);},
 withdraw:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.withdraw(s.identity,s.organizationId,s.schoolId,input);},
 reopen:async(identity:Identity|null,input:unknown)=>{const s=await scoped(identity);return coordination.reopen(s.identity,s.organizationId,s.schoolId,input);},
};
export {coordination as coordinationServices};
