import type { AdminHome, Identity, LeadershipDelegationAction, OperatorPrincipal, ProvisionInput, ProvisionResult, RoleCode, SelfAccount } from "../../../../shared/contracts/access";
import { AccessError, capabilitiesFor, currentIdentity, normalizeEmail, normalizeProvision, uuidPattern, validPassword } from "../domain/policy";
export type LoginRecord = { id:string; passwordHash:string|null; tokenVersion:number };
export interface AccessRepository {
 provision(input:Omit<ProvisionInput,"password">,passwordHash:string,operator:OperatorPrincipal,requestId:string):Promise<ProvisionResult>;
 loginRecord(email:string):Promise<LoginRecord|null>;
 finishLogin(record:LoginRecord|null,verified:boolean,requestId:string):Promise<Identity|null>;
 account(identity:Identity):Promise<{status:string;tokenVersion:number;normalizedEmail:string;createdAt:Date}|null>;
 adminContext(identity:Identity,schoolId?:string):Promise<(Omit<AdminHome,"capabilities">&{roles:RoleCode[]})|null>;
 leadershipContext(identity:Identity,schoolId?:string):Promise<(Omit<AdminHome,"capabilities">&{roles:RoleCode[];delegatedCapabilities?:readonly LeadershipDelegationAction[]})|null>;
 memberContext(identity:Identity,schoolId?:string):Promise<(Omit<AdminHome,"capabilities">&{roles:RoleCode[]})|null>;
}
export interface Passwords { hash(value:string):Promise<string>; verify(value:string,hash:string|null):Promise<boolean> }
export interface AccessFacade {
 isCurrentIdentity(identity:Identity):Promise<boolean>;
 provisionSchool(input:ProvisionInput,operator:OperatorPrincipal):Promise<ProvisionResult>;
 authenticate(email:unknown,password:unknown):Promise<Identity|null>;
 getAdminHome(identity:Identity|null,schoolId?:string):Promise<AdminHome>;
 getLeadershipHome(identity:Identity|null,schoolId?:string):Promise<AdminHome>;
 getAccountHome(identity:Identity|null,schoolId?:string):Promise<AdminHome>;
 getSelfAccount(identity:Identity|null):Promise<SelfAccount>;
}
export function createAccessUseCases(repository:AccessRepository,passwords:Passwords,newId:()=>string):AccessFacade {
 return {
  async getSelfAccount(identity:Identity|null){
   if(!identity||!uuidPattern.test(identity.accountId)||!Number.isInteger(identity.tokenVersion))throw new AccessError("UNAUTHENTICATED");
   const account=await repository.account(identity);
   if(!currentIdentity(account,identity.tokenVersion))throw new AccessError("UNAUTHENTICATED");
   return {accountId:identity.accountId,email:account!.normalizedEmail,status:account!.status,createdAt:account!.createdAt.toISOString()};
  },
  async getAccountHome(identity:Identity|null,schoolId?:string){
   if(!identity||!uuidPattern.test(identity.accountId)||!Number.isInteger(identity.tokenVersion)||!currentIdentity(await repository.account(identity),identity.tokenVersion))throw new AccessError("UNAUTHENTICATED");
   if(schoolId&&!uuidPattern.test(schoolId))throw new AccessError("NOT_FOUND");
   const context=await repository.memberContext(identity,schoolId);if(!context)throw new AccessError("NOT_FOUND");
   const {roles,...safe}=context;return {...safe,capabilities:capabilitiesFor(roles)};
  },
  async isCurrentIdentity(identity:Identity):Promise<boolean> {
   return uuidPattern.test(identity.accountId)&&Number.isInteger(identity.tokenVersion)&&currentIdentity(await repository.account(identity),identity.tokenVersion);
  },
  async provisionSchool(input:ProvisionInput,operator:OperatorPrincipal) {
   if(operator.verified!==true||!uuidPattern.test(operator.operatorId))throw new AccessError("VALIDATION");
   const normalized=normalizeProvision(input),hash=await passwords.hash(normalized.password);
   const {password:discard,...safe}=normalized;void discard;
   return repository.provision(safe,hash,operator,newId());
  },
  async authenticate(email:unknown,password:unknown):Promise<Identity|null> {
   if(typeof email!=="string"||typeof password!=="string"||email.length>254||!validPassword(password))return null;
   try{
    const record=await repository.loginRecord(normalizeEmail(email));
    const verified=await passwords.verify(password,record?.passwordHash??null);
    return await repository.finishLogin(record,verified,newId());
   }catch{throw new AccessError("UNAVAILABLE");}
  },
  async getAdminHome(identity:Identity|null,schoolId?:string):Promise<AdminHome> {
   if(!identity||!uuidPattern.test(identity.accountId)||!Number.isInteger(identity.tokenVersion)||!currentIdentity(await repository.account(identity),identity.tokenVersion))throw new AccessError("UNAUTHENTICATED");
   if(schoolId&&!uuidPattern.test(schoolId))throw new AccessError("NOT_FOUND");
   const context=await repository.adminContext(identity,schoolId);
   if(!context)throw new AccessError("NOT_FOUND");
   const capabilities=capabilitiesFor(context.roles);
   if(!capabilities.includes("school.manage"))throw new AccessError("NOT_FOUND");
   const {roles:discard,...safe}=context;void discard;
   return {...safe,capabilities};
  },
  async getLeadershipHome(identity:Identity|null,schoolId?:string):Promise<AdminHome> {
   if(!identity||!uuidPattern.test(identity.accountId)||!Number.isInteger(identity.tokenVersion)||!currentIdentity(await repository.account(identity),identity.tokenVersion))throw new AccessError("UNAUTHENTICATED");
   if(schoolId&&!uuidPattern.test(schoolId))throw new AccessError("NOT_FOUND");
   const context=await repository.leadershipContext(identity,schoolId);
   if(!context)throw new AccessError("NOT_FOUND");
   const capabilities=[...new Set([...capabilitiesFor(context.roles),...(context.delegatedCapabilities??[])])];
   if(!capabilities.includes("leadership.read"))throw new AccessError("NOT_FOUND");
   const {roles:discard,delegatedCapabilities:discardDelegated,...safe}=context;void discard;void discardDelegated;
   return {...safe,capabilities};
  },
 };
}
