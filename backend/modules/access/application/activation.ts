import type { ActivationResult,IssueActivationInput,IssuedActivation } from "../../../../shared/contracts/activation";
import type { OperatorPrincipal } from "../../../../shared/contracts/access";
import type { Passwords } from "./services";
import { AccessError,uuidPattern } from "../domain/policy";
import { normalizeIssue,validActivation } from "../domain/activation";
export interface ActivationRepository {
 issue(input:IssueActivationInput,operator:OperatorPrincipal,recovery:boolean,tokenHash:string,expiresAt:Date):Promise<{activationId:string}>;
 begin(tokenHash:string):Promise<{accountId:string;tokenVersion:number}|null>;
 redeem(tokenHash:string,accountId:string,tokenVersion:number,passwordHash:string):Promise<boolean>;
}
export interface ActivationTokens {generate():string;hash(token:string):string}
export interface ActivationFacade {
 issueActivation(input:IssueActivationInput,operator:OperatorPrincipal,recovery?:boolean):Promise<IssuedActivation>;
 activate(token:unknown,password:unknown,confirmation:unknown):Promise<ActivationResult>;
}
export function createActivationUseCases(repository:ActivationRepository,passwords:Passwords,tokens:ActivationTokens,now:()=>Date):ActivationFacade{return {
 async issueActivation(input,operator,recovery=false){
  if(!operator?.verified||!uuidPattern.test(operator.operatorId))throw new AccessError("UNAUTHENTICATED");
  const normalized=normalizeIssue(input,recovery),token=tokens.generate(),expiresAt=new Date(now().getTime()+86400000);
  const result=await repository.issue(normalized,operator,recovery,tokens.hash(token),expiresAt);
  return {...result,accountId:normalized.accountId,token,expiresAt:expiresAt.toISOString()};
 },
 async activate(token,password,confirmation){
  if(!validActivation(token,password,confirmation))throw new AccessError("INVALID_ACTIVATION");
  const hash=tokens.hash(token),candidate=await repository.begin(hash);if(!candidate)throw new AccessError("INVALID_ACTIVATION");
  const passwordHash=await passwords.hash(password as string);
  if(!await repository.redeem(hash,candidate.accountId,candidate.tokenVersion,passwordHash))throw new AccessError("INVALID_ACTIVATION");
  return {activated:true};
 },
};}
