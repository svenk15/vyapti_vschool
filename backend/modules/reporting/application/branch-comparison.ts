import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {LeadershipBranchComparison,LeadershipComparisonAvailability,LeadershipBranchComparisonInput} from '../../../../shared/contracts/reporting';
import {AccessError,uuidPattern} from '../../access/contracts/index';

export interface LeadershipBranchComparisonRepository {
 availability(actor:Identity,organizationId:string,currentSchoolId:string):Promise<LeadershipComparisonAvailability>;
 compare(actor:Identity,organizationId:string,currentSchoolId:string,input:LeadershipBranchComparisonInput):Promise<LeadershipBranchComparison>;
 grant(operator:OperatorPrincipal,input:Readonly<{organizationId:string;schoolId:string;accountId:string}>):Promise<Readonly<{grantId:string;version:number}>>;
 revoke(operator:OperatorPrincipal,input:Readonly<{organizationId:string;schoolId:string;accountId:string}>):Promise<Readonly<{grantId:string;version:number}>>;
}

const datePattern=/^\d{4}-\d{2}-\d{2}$/;
const id=(value:unknown)=>{if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value;};
const actor=(value:Identity|null)=>{if(!value||!uuidPattern.test(value.accountId)||!Number.isSafeInteger(value.tokenVersion))throw new AccessError('UNAUTHENTICATED');return value;};
function comparisonInput(value:LeadershipBranchComparisonInput){
 if(!Array.isArray(value.branchIds)||value.branchIds.length<1||value.branchIds.length>20||new Set(value.branchIds).size!==value.branchIds.length||value.branchIds.some(branch=>!uuidPattern.test(branch))||!datePattern.test(value.fromDate)||!datePattern.test(value.toDate))throw new AccessError('VALIDATION');
 const from=new Date(`${value.fromDate}T00:00:00.000Z`),to=new Date(`${value.toDate}T00:00:00.000Z`),days=Math.round((to.getTime()-from.getTime())/86400000)+1;if(!Number.isFinite(days)||days<1||days>31||from.toISOString().slice(0,10)!==value.fromDate||to.toISOString().slice(0,10)!==value.toDate)throw new AccessError('VALIDATION');
 return {branchIds:value.branchIds,fromDate:value.fromDate,toDate:value.toDate};
}

export function createLeadershipBranchComparisonUseCases(repository:LeadershipBranchComparisonRepository){return {
 leadershipComparisonAvailability(actorValue:Identity|null,organizationId:unknown,currentSchoolId:unknown){return repository.availability(actor(actorValue),id(organizationId),id(currentSchoolId));},
 compareLeadershipBranches(actorValue:Identity|null,organizationId:unknown,currentSchoolId:unknown,input:LeadershipBranchComparisonInput){return repository.compare(actor(actorValue),id(organizationId),id(currentSchoolId),comparisonInput(input));},
 grantLeadershipComparison(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown}){return repository.grant(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId)});},
 revokeLeadershipComparison(operator:OperatorPrincipal,input:{organizationId:unknown;schoolId:unknown;accountId:unknown}){return repository.revoke(operator,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId)});}
};}
