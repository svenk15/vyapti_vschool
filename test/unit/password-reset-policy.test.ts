import {describe,expect,it} from "vitest";
import {createPasswordResetUseCases,createStaffInviteUseCases,evaluatePasswordRecoveryPolicy,type PasswordResetRepository,type StaffInviteRepository} from "../../backend/modules/access/application/password-reset";

describe("account-wide email recovery policy",()=>{
 const eligible={accountStatus:"ACTIVE",emailVerified:true,hasPassword:true};
 it("allows hybrid and email access and sorts the auditable policy snapshot",()=>{
  const result=evaluatePasswordRecoveryPolicy({...eligible,organizations:[{organizationId:"b",trustMode:"EMAIL",configurationVersion:2},{organizationId:"a",trustMode:"HYBRID",configurationVersion:8}]});
  expect(result.allowed).toBe(true);expect(result.snapshot.map(x=>x.organizationId)).toEqual(["a","b"]);
 });
 it("blocks when any applicable institution requires operator recovery",()=>{
  const result=evaluatePasswordRecoveryPolicy({...eligible,organizations:[{organizationId:"hybrid",trustMode:"HYBRID",configurationVersion:1},{organizationId:"cli",trustMode:"OPERATOR_CLI",configurationVersion:4}]});
  expect(result).toMatchObject({allowed:false,reason:"OPERATOR_CLI_REQUIRED"});
 });
 it.each([{accountStatus:"PENDING",emailVerified:true,hasPassword:true},{accountStatus:"ACTIVE",emailVerified:false,hasPassword:true},{accountStatus:"ACTIVE",emailVerified:true,hasPassword:false}])("rejects ineligible account state %#",state=>{
  expect(evaluatePasswordRecoveryPolicy({...state,organizations:[]}).allowed).toBe(false);
 });
});

describe("password reset application flow",()=>{
 it("returns the same public result and records delivery failure without consuming a token",async()=>{
  const writes:{status:string;failureReason?:string}[]=[];
  const repository:PasswordResetRepository={issue:async()=>({id:"reset-1",recipient:"person@example.test"}),finishDelivery:async input=>{writes.push({status:input.status,...("failureReason" in input?{failureReason:input.failureReason}:{})});},consume:async()=>false};
  const useCases=createPasswordResetUseCases(repository,{sendPasswordReset:async()=>({ok:false,reason:"Delivery provider unavailable"}),sendStaffInvite:async()=>({ok:false,reason:"Delivery provider unavailable"})},{generate:()=>"x".repeat(48),hash:value=>`hash:${value}`},{hash:async()=>"password-hash"},()=>new Date("2026-01-01T00:00:00Z"));
  await expect(useCases.requestPasswordReset("person@example.test","request-id")).resolves.toEqual({accepted:true});
  expect(writes).toEqual([{status:"FAILED",failureReason:"Delivery provider unavailable"}]);
 });
 it("does not deliver or reveal whether an unknown account exists",async()=>{
  let sends=0;const repository:PasswordResetRepository={issue:async()=>null,finishDelivery:async()=>{throw Error("unexpected")},consume:async()=>false};
  const useCases=createPasswordResetUseCases(repository,{sendPasswordReset:async()=>{sends++;return {ok:true}},sendStaffInvite:async()=>({ok:true})},{generate:()=>"x".repeat(48),hash:value=>value},{hash:async()=>"hash"},()=>new Date());
  await expect(useCases.requestPasswordReset("unknown@example.test","request-id")).resolves.toEqual({accepted:true});expect(sends).toBe(0);
 });
});

describe("staff invitation application flow",()=>{
 const noResend:StaffInviteRepository['resendForEmployee']=async()=>null;
 it("creates delivery evidence outside the issue transaction and returns its visible failure state",async()=>{
  const delivered:{state:string;reason?:string}[]=[];
  const repository:StaffInviteRepository={issue:async input=>({id:"invite-1",recipient:input.email,organizationId:input.organizationId,schoolId:input.schoolId}),issueForEmployee:async()=>null,resendForEmployee:noResend,finishDelivery:async input=>{delivered.push({state:input.status,...(input.failureReason?{reason:input.failureReason}:{})});},accept:async()=>false};
  const sender={sendPasswordReset:async()=>({ok:true as const}),sendStaffInvite:async()=>({ok:false as const,reason:"Mailbox rejected message"})};
  const facade=createStaffInviteUseCases(repository,sender,{generate:()=>"z".repeat(48),hash:value=>`digest:${value}`},{hash:async()=>"credential-hash"},()=>new Date("2026-01-01T00:00:00Z"));
  await expect(facade.inviteStaff({email:" Staff@Example.test ",organizationId:"org",schoolId:"school",roles:["TEACHER"],inviterAccountId:"admin",inviterTokenVersion:1,requestId:"req"})).resolves.toMatchObject({deliveryStatus:"FAILED",deliveryFailureReason:"Mail provider rejected the message"});
  expect(delivered).toEqual([{state:"FAILED",reason:"Mailbox rejected message"}]);
 });
 it("rejects missing initial-password confirmation before persistence",async()=>{
  let accepted=0;const repository:StaffInviteRepository={issue:async()=>null,issueForEmployee:async()=>null,resendForEmployee:noResend,finishDelivery:async()=>{},accept:async()=>{accepted++;return true}};
  const facade=createStaffInviteUseCases(repository,{sendPasswordReset:async()=>({ok:true}),sendStaffInvite:async()=>({ok:true})},{generate:()=>"z".repeat(48),hash:value=>value},{hash:async()=>"hash"},()=>new Date());
  await expect(facade.acceptStaffInvite({token:"z".repeat(48),initialPassword:"long-password-value",confirmation:"different",requestId:"req"})).rejects.toThrow("INVALID_INVITATION");expect(accepted).toBe(0);
 });
 it("requires explicit confirmation and a bounded non-sensitive verification reference",async()=>{
  let issued=0;const repository:StaffInviteRepository={issue:async()=>null,issueForEmployee:async()=>{issued++;return null},resendForEmployee:noResend,finishDelivery:async()=>{},accept:async()=>false};
  const facade=createStaffInviteUseCases(repository,{sendPasswordReset:async()=>({ok:true}),sendStaffInvite:async()=>({ok:true})},{generate:()=>"z".repeat(48),hash:value=>value},{hash:async()=>"hash"},()=>new Date());
  await expect(facade.grantEmployeeAccess({employeeId:"11111111-1111-4111-8111-111111111111",email:"staff@example.test",verificationReference:"CASE-14",confirmed:false,organizationId:"org",schoolId:"school",roles:["TEACHER"],inviterAccountId:"admin",inviterTokenVersion:1,requestId:"req",key:"22222222-2222-4222-8222-222222222222"})).rejects.toThrow("VALIDATION");
  expect(issued).toBe(0);
 });
 it("does not redeliver a replayed Employee grant",async()=>{
  let sends=0,finishes=0;const repository:StaffInviteRepository={issue:async()=>null,issueForEmployee:async input=>({id:"invite-employee",recipient:input.email,organizationId:input.organizationId,schoolId:input.schoolId,replayed:true,activationPath:"EMAIL_INVITATION",deliveryStatus:"SENT"}),resendForEmployee:noResend,finishDelivery:async()=>{finishes++},accept:async()=>false};
  const facade=createStaffInviteUseCases(repository,{sendPasswordReset:async()=>({ok:true}),sendStaffInvite:async()=>{sends++;return {ok:true}}},{generate:()=>"z".repeat(48),hash:value=>value},{hash:async()=>"hash"},()=>new Date());
  await expect(facade.grantEmployeeAccess({employeeId:"11111111-1111-4111-8111-111111111111",email:" staff@example.test ",verificationReference:" CASE-14 ",confirmed:true,organizationId:"org",schoolId:"school",roles:["TEACHER"],inviterAccountId:"admin",inviterTokenVersion:1,requestId:"req",key:"22222222-2222-4222-8222-222222222222"})).resolves.toMatchObject({accessId:"invite-employee",invitationId:"invite-employee",activationPath:"EMAIL_INVITATION",deliveryStatus:"SENT",replayed:true});
  expect({sends,finishes}).toEqual({sends:0,finishes:0});
 });
 it("returns the operator activation path without attempting email delivery",async()=>{
  let sends=0;const repository:StaffInviteRepository={issue:async()=>null,issueForEmployee:async input=>({id:"membership-1",recipient:input.email,organizationId:input.organizationId,schoolId:input.schoolId,replayed:false,activationPath:"OPERATOR_ACTIVATION",deliveryStatus:"NOT_APPLICABLE"}),resendForEmployee:noResend,finishDelivery:async()=>{throw Error('unexpected')},accept:async()=>false};
  const facade=createStaffInviteUseCases(repository,{sendPasswordReset:async()=>({ok:true}),sendStaffInvite:async()=>{sends++;return {ok:true}}},{generate:()=>"z".repeat(48),hash:value=>value},{hash:async()=>"hash"},()=>new Date());
  await expect(facade.grantEmployeeAccess({employeeId:"11111111-1111-4111-8111-111111111111",email:"staff@example.test",verificationReference:"CASE-CLI",confirmed:true,organizationId:"org",schoolId:"school",roles:["TEACHER"],inviterAccountId:"admin",inviterTokenVersion:1,requestId:"req",key:"22222222-2222-4222-8222-222222222222"})).resolves.toEqual({accessId:"membership-1",activationPath:"OPERATOR_ACTIVATION",deliveryStatus:"NOT_APPLICABLE",replayed:false});expect(sends).toBe(0);
 });
});
