import 'server-only';
import type {Identity} from '../../shared/contracts/access';
import {createDecisionInboxServices} from '../../backend/composition/decisions';
import {accountGateway} from './access';
import {coordinationServices} from './coordination';
import {assessmentsServices} from './assessments';

if(!assessmentsServices)throw new Error('Assessments decision service unavailable');
const decisions=createDecisionInboxServices({coordination:coordinationServices,assessments:assessmentsServices});
const scoped=async(identity:Identity|null)=>{const scope=(await accountGateway.getHome(identity)).scope;return {identity,organizationId:scope.organizationId,schoolId:scope.schoolId};};
export const decisionGateway={
 list:async(identity:Identity|null,input:Parameters<typeof decisions.list>[3]={})=>{const s=await scoped(identity);return decisions.list(s.identity,s.organizationId,s.schoolId,input);},
 get:async(identity:Identity|null,owner:string,id:string)=>{const s=await scoped(identity);return decisions.get(s.identity,s.organizationId,s.schoolId,owner,id);},
 decide:async(identity:Identity|null,owner:string,id:string,input:unknown)=>{const s=await scoped(identity);return decisions.decide(s.identity,s.organizationId,s.schoolId,owner,id,input);},
 status:async(identity:Identity|null,owner:string,id:string,input:unknown)=>{const s=await scoped(identity);return decisions.status(s.identity,s.organizationId,s.schoolId,owner,id,input);},
 requestInformation:async(identity:Identity|null,owner:string,id:string,input:unknown)=>{const s=await scoped(identity);return decisions.requestInformation(s.identity,s.organizationId,s.schoolId,owner,id,input);},
 recuse:async(identity:Identity|null,owner:string,id:string,input:unknown)=>{const s=await scoped(identity);return decisions.recuse(s.identity,s.organizationId,s.schoolId,owner,id,input);},
};
