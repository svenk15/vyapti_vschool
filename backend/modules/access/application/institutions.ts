import type { Identity,OperatorPrincipal } from '../../../../shared/contracts/access';
import type { BranchInput,ContextDirectory,InstitutionCommand,InstitutionResult,SwitchedContext } from '../../../../shared/contracts/tenancy';
import { AccessError,uuidPattern } from '../domain/policy';
import { branchInput,identifier,institutionCommand } from '../domain/institutions';
export interface InstitutionRepository {
 directory(identity:Identity):Promise<ContextDirectory>;
 switchContext(identity:Identity,organizationId:string,schoolId:string):Promise<SwitchedContext>;
 createBranch(identity:Identity,organizationId:string,input:BranchInput):Promise<InstitutionResult>;
 operate(command:InstitutionCommand,operator:OperatorPrincipal):Promise<InstitutionResult>;
}
export interface InstitutionFacade {
 getContexts(identity:Identity|null):Promise<ContextDirectory>;
 switchContext(identity:Identity|null,organizationId:unknown,schoolId:unknown):Promise<SwitchedContext>;
 createBranch(identity:Identity|null,organizationId:string,input:unknown):Promise<InstitutionResult>;
 institutionOperation(command:InstitutionCommand,operator:OperatorPrincipal):Promise<InstitutionResult>;
}
function auth(identity:Identity|null):asserts identity is Identity {if(!identity||!uuidPattern.test(identity.accountId)||!Number.isSafeInteger(identity.tokenVersion))throw new AccessError('UNAUTHENTICATED');}
export function createInstitutionUseCases(repo:InstitutionRepository):InstitutionFacade{return {
 getContexts(identity){auth(identity);return repo.directory(identity);},
 switchContext(identity,org,school){auth(identity);let o,s;try{o=identifier(org);s=identifier(school);}catch{throw new AccessError('NOT_FOUND');}return repo.switchContext(identity,o,s);},
 createBranch(identity,org,input){auth(identity);return repo.createBranch(identity,identifier(org),branchInput(input));},
 institutionOperation(command,operator){if(operator?.verified!==true||!uuidPattern.test(operator.operatorId))throw new AccessError('UNAUTHENTICATED');return repo.operate(institutionCommand(command),operator);},
};}
