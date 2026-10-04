/** Portable account-wide recovery policy. Infrastructure supplies a complete snapshot
 * of active school memberships and institution grants, including grant-only access. */
export type TrustMode = "OPERATOR_CLI" | "HYBRID" | "EMAIL";
export interface RecoveryPolicyOrganization { organizationId:string; trustMode:TrustMode; configurationVersion:number; }
export interface RecoveryPolicyInput { accountStatus:string; emailVerified:boolean; hasPassword:boolean; organizations:readonly RecoveryPolicyOrganization[]; }
export interface RecoveryPolicyDecision { allowed:boolean; reason:"ELIGIBLE"|"ACCOUNT_INACTIVE"|"ADDRESS_UNVERIFIED"|"PASSWORD_MISSING"|"OPERATOR_CLI_REQUIRED"; snapshot:readonly RecoveryPolicyOrganization[]; }
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
 issue(input:{email:string;organizationId:string;schoolId:string;inviterAccountId:string;roles:readonly InviteRole[];tokenHash:string;expiresAt:Date;requestId:string}):Promise<{id:string;recipient:string}|null>;
 finishDelivery(input:{id:string;status:"SENT"|"FAILED";failureReason?:string;requestId:string}):Promise<void>;
 /** Rechecks inviter authority, scope, trust mode, recipient, account state and unchanged proposed grants transactionally. */
 accept(input:{tokenHash:string;initialPasswordHash?:string;requestId:string}):Promise<boolean>;
}
export interface StaffInviteFacade { inviteStaff(input:{email:unknown;organizationId:string;schoolId:string;roles:unknown;inviterAccountId:string;requestId:string}):Promise<{invitationId:string;deliveryStatus:"SENT"|"FAILED"}>; acceptStaffInvite(input:{token:unknown;initialPassword?:unknown;confirmation?:unknown;requestId:string}):Promise<{accepted:true}>; }
const normalizeEmail=(value:unknown):string|null=>typeof value==="string"&&value.trim().length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())?value.trim().toLowerCase():null;
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
  if(!email||!email.includes("@")||!roles.length||roles.length!==(Array.isArray(input.roles)?new Set(input.roles).size:0))throw new Error("INVALID_INVITATION");
  const token=tokens.generate(),expiresAt=new Date(now().getTime()+72*60*60_000),invite=await repository.issue({email,organizationId:input.organizationId,schoolId:input.schoolId,inviterAccountId:input.inviterAccountId,roles,tokenHash:tokens.hash(token),expiresAt,requestId:input.requestId});
  if(!invite)throw new Error("INVITATION_NOT_ALLOWED");
  const delivery=await sender.sendStaffInvite({to:invite.recipient,token,expiresAt:expiresAt.toISOString(),organizationId:input.organizationId,schoolId:input.schoolId});
  const status=delivery.ok?"SENT":"FAILED";await repository.finishDelivery({id:invite.id,status,...(!delivery.ok?{failureReason:delivery.reason.slice(0,120)}:{}),requestId:input.requestId});
  return {invitationId:invite.id,deliveryStatus:status};
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
