import type {Identity,LeadershipDelegationResult,LeadershipDelegationSummary,OperatorPrincipal} from '../../../../shared/contracts/access';
import {AccessError,uuidPattern} from '../domain/policy';
import {normalizeDelegationIssue,normalizeDelegationRevoke} from '../domain/delegations';

export interface LeadershipDelegationRepository {
  issue(operator:OperatorPrincipal,input:ReturnType<typeof normalizeDelegationIssue>,requestId:string):Promise<LeadershipDelegationResult>;
  revoke(operator:OperatorPrincipal,input:ReturnType<typeof normalizeDelegationRevoke>,requestId:string):Promise<LeadershipDelegationResult>;
  listOwn(identity:Identity):Promise<readonly LeadershipDelegationSummary[]>;
}
export interface LeadershipDelegationFacade {
  issueDelegation(operator:OperatorPrincipal,body:unknown):Promise<LeadershipDelegationResult>;
  revokeDelegation(operator:OperatorPrincipal,body:unknown):Promise<LeadershipDelegationResult>;
  listOwnDelegations(identity:Identity|null):Promise<readonly LeadershipDelegationSummary[]>;
}
export function createLeadershipDelegationUseCases(repository:LeadershipDelegationRepository,newId:()=>string):LeadershipDelegationFacade{return {
  issueDelegation(operator,body){if(!operator.verified||!uuidPattern.test(operator.operatorId))throw new AccessError('FORBIDDEN');return repository.issue(operator,normalizeDelegationIssue(body),newId());},
  revokeDelegation(operator,body){if(!operator.verified||!uuidPattern.test(operator.operatorId))throw new AccessError('FORBIDDEN');return repository.revoke(operator,normalizeDelegationRevoke(body),newId());},
  listOwnDelegations(identity){if(!identity||!uuidPattern.test(identity.accountId)||!Number.isInteger(identity.tokenVersion))throw new AccessError('UNAUTHENTICATED');return repository.listOwn(identity);},
};}
