# Access — concrete engineering LLD

## Responsibility and aggregate boundary
Global identity, school/institution grants, activation and recovery. Aggregates/owned records: UserAccount, Organization, School, SchoolMembership, RoleGrant, InstitutionGrant, AccountPersonBinding, AccountActivation, AccessInvite, PasswordResetToken. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** Keep credentials/token hashing and account-wide trust recovery invariant. OperatorPrincipal is not browser-auth proof. Parent/student/principal roles require new explicit contracts.

## Input facades and cross-owner ports
- `backend/modules/access/application/activation.ts`
- `backend/modules/access/application/institutions.ts`
- `backend/modules/access/application/management.ts`
- `backend/modules/access/application/password-reset.ts`
- `backend/modules/access/application/person-binding.ts`
- `backend/modules/access/application/services.ts`
- `backend/modules/access/contracts/index.ts`
- `backend/modules/access/contracts/person-binding.ts`
- `backend/modules/access/contracts/trust-mode-invalidation.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/access/application/activation.ts

```ts
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

```

### backend/modules/access/application/institutions.ts

```ts
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

```

### backend/modules/access/application/management.ts

```ts
import type { Identity } from "../../../../shared/contracts/access";
import type { ManagementCommand,ManagementResult,SchoolSettings,StaffPage } from "../../../../shared/contracts/access-management";
import { AccessError,uuidPattern } from "../domain/policy";
import { normalizeCommand,requireCommandKey } from "../domain/management";
export interface ManagementRepository {
 settings(identity:Identity,schoolId?:string):Promise<SchoolSettings>;
 members(identity:Identity,schoolId?:string,cursor?:string):Promise<StaffPage>;
 execute(identity:Identity,command:ManagementCommand,key:string,schoolId?:string):Promise<ManagementResult>;
}
export interface ManagementFacade {
 getSettings(identity:Identity|null,schoolId?:string):Promise<SchoolSettings>;
 listMembers(identity:Identity|null,schoolId?:string,cursor?:string):Promise<StaffPage>;
 command(identity:Identity|null,kind:ManagementCommand["kind"],body:unknown,key:string,schoolId?:string,targetId?:string):Promise<ManagementResult>;
}
function authenticated(identity:Identity|null,schoolId?:string):asserts identity is Identity {if(!identity||!uuidPattern.test(identity.accountId)||!Number.isInteger(identity.tokenVersion))throw new AccessError("UNAUTHENTICATED");if(schoolId&&!uuidPattern.test(schoolId))throw new AccessError("NOT_FOUND");}
export function createManagementUseCases(repository:ManagementRepository):ManagementFacade{return {
 getSettings(identity,schoolId){authenticated(identity,schoolId);return repository.settings(identity,schoolId);},
 listMembers(identity,schoolId,cursor){authenticated(identity,schoolId);if(cursor&&cursor.length>1024)throw new AccessError("INVALID_CURSOR");return repository.members(identity,schoolId,cursor);},
 command(identity,kind,body,key,schoolId,targetId){authenticated(identity,schoolId);requireCommandKey(key);return repository.execute(identity,normalizeCommand(kind,body,targetId),key,schoolId);},
};}

```

### backend/modules/access/application/password-reset.ts

```ts
/** Portable account-wide recovery policy. Infrastructure supplies a complete snapshot
 * of active school memberships and institution grants, including grant-only access. */
export type TrustMode = "OPERATOR_CLI" | "HYBRID" | "EMAIL";
export interface RecoveryPolicyOrganization { organizationId:string; trustMode:TrustMode; configurationVersion:number; }
export interface RecoveryPolicyInput { accountStatus:string; emailVerified:boolean; hasPassword:boolean; organizations:readonly RecoveryPolicyOrganization[]; }
export interface RecoveryPolicyDecision { allowed:boolean; reason:"ELIGIBLE"|"ACCOUNT_INACTIVE"|"ADDRESS_UNVERIFIED"|"PASSWORD_MISSING"|"OPERATOR_CLI_REQUIRED"|"RATE_LIMITED"; snapshot:readonly RecoveryPolicyOrganization[]; }
export function evaluatePasswordRecoveryPolicy(input:RecoveryPolicyInput):RecoveryPolicyDecision {
 const snapshot=[...input.organizations].sort((a,b)=>a.organizationId.localeCompare(b.organizationId));
 let reason:RecoveryPolicyDecision["reason"]="ELIGIBLE";
 if(input.accountStatus!=="ACTIVE") reason="ACCOUNT_INACTIVE";
 else if(!input.emailVerified) reason="ADDRESS_UNVERIFIED";
 else if(!input.hasPassword) reason="PASSWORD_MISSING";
 else if(snapshot.some(item=>item.trustMode==="OPERATOR_CLI")) reason="OPERATOR_CLI_REQUIRED";
 return {allowed:reason==="ELIGIBLE",reason,snapshot};
}

export interface ResetTokens { generate():string; hash(token:string):string; }
export interface ResetPasswords { hash(password:string):Promise<string>; }
export interface AccessEmailSender {
 sendPasswordReset(input:{to:string;token:string;expiresAt:string}):Promise<{ok:true}|{ok:false;reason:string}>;
 sendStaffInvite(input:{to:string;token:string;expiresAt:string;organizationId:string;schoolId:string}):Promise<{ok:true}|{ok:false;reason:string}>;
}
export interface PasswordResetRepository {
 /** Must transactionally recheck address, account eligibility, active memberships and institution grants. */
 issue(input:{normalizedEmail:string;tokenHash:string;expiresAt:Date;requestId:string}):Promise<{id:string;recipient:string}|null>;
 /** Compare-and-set only while pending and not revoked, so late sends cannot revive tokens. */
 finishDelivery(input:{id:string;status:"SENT"|"FAILED";failureReason?:string;requestId:string}):Promise<void>;
 /** Must atomically recheck account-wide policy, consume one SENT token, revoke peers, clear lockout and increment tokenVersion. */
 consume(input:{tokenHash:string;passwordHash:string;requestId:string}):Promise<boolean>;
}
export interface PasswordResetFacade { requestPasswordReset(email:unknown,requestId:string):Promise<{accepted:true}>; acceptPasswordReset(token:unknown,password:unknown,confirmation:unknown,requestId:string):Promise<{reset:true}>; }
export type InviteRole="SCHOOL_ADMIN"|"TEACHER";
export interface StaffInviteRepository {
 /** Reuses a global identity and commits only a pending scoped membership/invite after current permission/trust checks. */
 issue(input:{email:string;organizationId:string;schoolId:string;inviterAccountId:string;inviterTokenVersion:number;roles:readonly InviteRole[];tokenHash:string;expiresAt:Date;requestId:string}):Promise<{id:string;recipient:string;organizationId:string;schoolId:string}|null>;
 finishDelivery(input:{id:string;status:"SENT"|"FAILED";failureReason?:string;requestId:string}):Promise<void>;
 /** Rechecks inviter authority, scope, trust mode, recipient, account state and unchanged proposed grants transactionally. */
 accept(input:{tokenHash:string;initialPasswordHash?:string;requestId:string}):Promise<boolean>;
}
export interface StaffInviteFacade { inviteStaff(input:{email:unknown;organizationId:string;schoolId:string;roles:unknown;inviterAccountId:string;inviterTokenVersion:number;requestId:string}):Promise<{invitationId:string;deliveryStatus:"SENT"|"FAILED";deliveryFailedAt?:string;deliveryFailureReason?:string}>; acceptStaffInvite(input:{token:unknown;initialPassword?:unknown;confirmation?:unknown;requestId:string}):Promise<{accepted:true}>; }
const normalizeEmail=(value:unknown):string|null=>typeof value==="string"&&value.trim().length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())?value.trim().toLowerCase():null;
const safeInviteFailure=(reason:string)=>reason.toLowerCase().includes("reject")?"Mail provider rejected the message":reason.toLowerCase().includes("timeout")?"Mail provider timed out":"Mail provider unavailable";
export function createPasswordResetUseCases(repository:PasswordResetRepository,sender:AccessEmailSender,tokens:ResetTokens,passwords:ResetPasswords,now:()=>Date):PasswordResetFacade{return {
 async requestPasswordReset(value,requestId){
  const email=normalizeEmail(value);if(!email)return {accepted:true};
  const token=tokens.generate(),expiresAt=new Date(now().getTime()+30*60_000),issued=await repository.issue({normalizedEmail:email,tokenHash:tokens.hash(token),expiresAt,requestId});
  if(!issued)return {accepted:true};
  const delivery=await sender.sendPasswordReset({to:issued.recipient,token,expiresAt:expiresAt.toISOString()});
  await repository.finishDelivery({id:issued.id,status:delivery.ok?"SENT":"FAILED",...(!delivery.ok?{failureReason:delivery.reason.slice(0,120)}:{}),requestId});
  return {accepted:true};
 },
 async acceptPasswordReset(token,password,confirmation,requestId){
  if(typeof token!=="string"||token.length<32||token.length>128||typeof password!=="string"||password.length<12||password.length>128||password!==confirmation)throw new Error("INVALID_RESET");
  const passwordHash=await passwords.hash(password);if(!await repository.consume({tokenHash:tokens.hash(token),passwordHash,requestId}))throw new Error("INVALID_RESET");
  return {reset:true};
 }
};}

export function createStaffInviteUseCases(repository:StaffInviteRepository,sender:AccessEmailSender,tokens:ResetTokens,passwords:ResetPasswords,now:()=>Date):StaffInviteFacade{return {
 async inviteStaff(input){
  const email=normalizeEmail(input.email),roles=Array.isArray(input.roles)?input.roles.filter((r):r is InviteRole=>r==="SCHOOL_ADMIN"||r==="TEACHER"):[];
  if(!email||!email.includes("@")||!roles.length||roles.length!==(Array.isArray(input.roles)?new Set(input.roles).size:0))throw new AccessError("VALIDATION");
  const token=tokens.generate(),expiresAt=new Date(now().getTime()+72*60*60_000),invite=await repository.issue({email,organizationId:input.organizationId,schoolId:input.schoolId,inviterAccountId:input.inviterAccountId,inviterTokenVersion:input.inviterTokenVersion,roles,tokenHash:tokens.hash(token),expiresAt,requestId:input.requestId});
  if(!invite)throw new AccessError("FORBIDDEN");
  const delivery=await sender.sendStaffInvite({to:invite.recipient,token,expiresAt:expiresAt.toISOString(),organizationId:invite.organizationId,schoolId:invite.schoolId});
  const status=delivery.ok?"SENT":"FAILED";await repository.finishDelivery({id:invite.id,status,...(!delivery.ok?{failureReason:delivery.reason.slice(0,120)}:{}),requestId:input.requestId});
  return {invitationId:invite.id,deliveryStatus:status,...(!delivery.ok?{deliveryFailedAt:now().toISOString(),deliveryFailureReason:safeInviteFailure(delivery.reason)}:{})};
 },
 async acceptStaffInvite(input){
  if(typeof input.token!=="string"||input.token.length<32||input.token.length>128)throw new Error("INVALID_INVITATION");
  let initialPasswordHash:string|undefined;
  if(input.initialPassword!==undefined&&input.initialPassword!==""){
   if(typeof input.initialPassword!=="string"||input.initialPassword.length<12||input.initialPassword.length>128||input.initialPassword!==input.confirmation)throw new Error("INVALID_INVITATION");
   initialPasswordHash=await passwords.hash(input.initialPassword);
  }
  if(!await repository.accept({tokenHash:tokens.hash(input.token),...(initialPasswordHash?{initialPasswordHash}:{}),requestId:input.requestId}))throw new Error("INVALID_INVITATION");
  return {accepted:true};
 }
};}
import {AccessError} from "../domain/policy";

```

### backend/modules/access/application/person-binding.ts

```ts
import {AccessError,uuidPattern} from '../contracts/index';
import type {VerifiedPersonBindingInput,VerifiedPersonBindingPort} from '../contracts/person-binding';
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('VALIDATION');return value.toLowerCase();}
export function createVerifiedPersonBindingUseCases(port:VerifiedPersonBindingPort){return {
 bind(transaction:object,input:Omit<VerifiedPersonBindingInput,'organizationId'|'schoolId'|'accountId'|'personId'|'verifiedBy'> & {organizationId:unknown;schoolId:unknown;accountId:unknown;personId:unknown;verifiedBy:unknown}){
  if(!transaction||typeof transaction!=='object')throw new AccessError('UNAVAILABLE');
  const reference=input.verificationReference.normalize('NFC').trim();if(reference.length<3||reference.length>80||/[\u0000-\u001f\u007f]/.test(reference))throw new AccessError('VALIDATION');
  if(typeof input.occurredAt!=='string'||!Number.isFinite(Date.parse(input.occurredAt))||typeof input.requestId!=='string'||!uuidPattern.test(input.requestId))throw new AccessError('VALIDATION');
  return port.bind(transaction,{organizationId:id(input.organizationId),schoolId:id(input.schoolId),accountId:id(input.accountId),personId:id(input.personId),verifiedBy:id(input.verifiedBy),verificationReference:reference,occurredAt:input.occurredAt,requestId:input.requestId});
 }
};}

```

### backend/modules/access/application/services.ts

```ts
import type { AdminHome, Identity, OperatorPrincipal, ProvisionInput, ProvisionResult } from "../../../../shared/contracts/access";
import { AccessError, capabilitiesFor, currentIdentity, normalizeEmail, normalizeProvision, uuidPattern, validPassword } from "../domain/policy";
export type LoginRecord = { id:string; passwordHash:string|null; tokenVersion:number };
export interface AccessRepository {
 provision(input:Omit<ProvisionInput,"password">,passwordHash:string,operator:OperatorPrincipal,requestId:string):Promise<ProvisionResult>;
 loginRecord(email:string):Promise<LoginRecord|null>;
 finishLogin(record:LoginRecord|null,verified:boolean,requestId:string):Promise<Identity|null>;
 account(identity:Identity):Promise<{status:string;tokenVersion:number}|null>;
 adminContext(identity:Identity,schoolId?:string):Promise<(Omit<AdminHome,"capabilities">&{roles:("SCHOOL_ADMIN"|"TEACHER")[]})|null>;
 memberContext(identity:Identity,schoolId?:string):Promise<(Omit<AdminHome,"capabilities">&{roles:("SCHOOL_ADMIN"|"TEACHER")[]})|null>;
}
export interface Passwords { hash(value:string):Promise<string>; verify(value:string,hash:string|null):Promise<boolean> }
export interface AccessFacade {
 isCurrentIdentity(identity:Identity):Promise<boolean>;
 provisionSchool(input:ProvisionInput,operator:OperatorPrincipal):Promise<ProvisionResult>;
 authenticate(email:unknown,password:unknown):Promise<Identity|null>;
 getAdminHome(identity:Identity|null,schoolId?:string):Promise<AdminHome>;
 getAccountHome(identity:Identity|null,schoolId?:string):Promise<AdminHome>;
}
export function createAccessUseCases(repository:AccessRepository,passwords:Passwords,newId:()=>string):AccessFacade {
 return {
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
 };
}

```

### backend/modules/access/contracts/index.ts

```ts
export type { AccessFacade, AccessRepository, Passwords } from "../application/services";
export type { AdminHome, Identity, OperatorPrincipal, ProvisionInput, ProvisionResult } from "../../../../shared/contracts/access";
export { AccessError,capabilitiesFor,uuidPattern } from "../domain/policy";
export type { ManagementFacade, ManagementRepository } from "../application/management";
export type { ActivationFacade } from "../application/activation";

export type { InstitutionFacade,InstitutionRepository } from "../application/institutions";

```

### backend/modules/access/contracts/person-binding.ts

```ts
export type BindingTransaction = object;
export type VerifiedPersonBindingInput = Readonly<{
 organizationId:string; schoolId:string; accountId:string; personId:string;
 verifiedBy:string; verificationReference:string; occurredAt:string; requestId:string;
}>;
export interface VerifiedPersonBindingPort {
 bind(transaction:BindingTransaction,input:VerifiedPersonBindingInput):Promise<{bindingId:string}>;
}

```

### backend/modules/access/contracts/trust-mode-invalidation.ts

```ts
export type ProvisioningTrustMode="OPERATOR_CLI"|"HYBRID"|"EMAIL";
export interface TrustModeInvalidationResult { revokedInvites:number; revokedResetTokens:number; affectedAccounts:number; }
/** Access-owned token invalidation enlisted in Tenancy's transaction. The transaction
 * handle is opaque to the application contract and interpreted only by its adapter. */
export interface AccessTrustModeInvalidator<TransactionScope>{
 invalidateForOperatorOnly(input:{transaction:TransactionScope;organizationId:string;configurationVersion:number;requestId:string;occurredAt:Date}):Promise<TrustModeInvalidationResult>;
}

```

## Output adapters

- `backend/modules/access/infrastructure/activation-tokens.ts`
- `backend/modules/access/infrastructure/activation.ts`
- `backend/modules/access/infrastructure/development-mail-sink.ts`
- `backend/modules/access/infrastructure/institutions.ts`
- `backend/modules/access/infrastructure/management.ts`
- `backend/modules/access/infrastructure/password-reset.ts`
- `backend/modules/access/infrastructure/passwords.ts`
- `backend/modules/access/infrastructure/person-binding.ts`
- `backend/modules/access/infrastructure/repository.ts`
- `backend/modules/access/infrastructure/staff-invites.ts`
- `backend/modules/access/infrastructure/trust-mode-invalidation.ts`

## Pure domain rules

- `backend/modules/access/domain/activation.ts`
- `backend/modules/access/domain/institutions.ts`
- `backend/modules/access/domain/management.ts`
- `backend/modules/access/domain/policy.ts`

## Physical data

- `vs_access_organization` — Contractual tenant; trust mode controls provisioning/recovery channels only; existing rows backfilled to OPERATOR_CLI.; see database/tables/vs_access_organization.md
- `vs_access_school` — Operational scope and serialization guard. Timezone immutable once sessions exist in Phase 1.; see database/tables/vs_access_school.md
- `vs_access_user_account` — Globally unique login; reset requires a previously verified address; no school access without membership. Never return hash/counters.; see database/tables/vs_access_user_account.md
- `vs_access_account_person_binding` — Deliberate verified account-to-person link; People supplies scoped Person reference.; see database/tables/vs_access_account_person_binding.md
- `vs_access_school_membership` — School access root; granting role does not prove teacher eligibility.; see database/tables/vs_access_school_membership.md
- `vs_access_role_grant` — Fixed permission mapping in code; no arbitrary permission JSON.; see database/tables/vs_access_role_grant.md
- `vs_access_auth_security_event` — Redacted auth/recovery evidence including internal cross-institution policy decisions. request_id is the correlation ID; no password, raw token or raw unknown identifier.; see database/tables/vs_access_auth_security_event.md
- `vs_access_invite` — Email invitation bound to the target global account and scoped pending membership; acceptance never creates Person or Employee bindings.; see database/tables/vs_access_invite.md
- `vs_access_password_reset_token` — Account-global password recovery token; issue and consume snapshots include every active school membership and institution grant trust mode/version.; see database/tables/vs_access_password_reset_token.md
- `vs_access_campus` — Optional subordinate site; no campus-level grants in first release.; see database/tables/vs_access_campus.md
- `vs_access_account_activation` — One-time 256-bit random opaque activation, hash stored; 24h expiry. Raw token shown once to authorized local operator, never audit/log/URL query.; see database/tables/vs_access_account_activation.md
- `vs_access_account_activation_membership` — Owned immutable relational membership intent snapshot for one activation.; see database/tables/vs_access_account_activation_membership.md
- `vs_access_institution_grant` — Institution configuration grant; no implicit pupil access.; see database/tables/vs_access_institution_grant.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/access/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
