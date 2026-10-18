import { afterAll,expect,it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAccessServices } from '../../backend/composition/access';
import { createInstitutionUseCases } from '../../backend/modules/access/application/institutions';
import { PrismaInstitutionRepository } from '../../backend/modules/access/infrastructure/institutions';
import { PrismaInstitutionEvidence } from '../../backend/modules/tenancy/infrastructure/evidence';
import {createAppearanceUseCases} from '../../backend/modules/access/application/appearance';
import {PrismaAppearanceRepository} from '../../backend/modules/access/infrastructure/appearance';
import { schoolInput } from '../fixtures/access-management';
const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated test DB required');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),service=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const};
afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function provision(){const scope=await service.provisionSchool(schoolInput(),operator);return {scope,identity:{accountId:scope.accountId,tokenVersion:1}};}
async function createInstitution(accountId:string){return service.institutionOperation({kind:'CreateInstitution',organizationId:randomUUID(),accountId,name:'Synthetic institution '+randomUUID().slice(0,8),key:randomUUID(),reason:'Synthetic operator verified institution'},operator);}
async function grant(org:string,account:string){return service.institutionOperation({kind:'SetInstitutionGrant',organizationId:org,accountId:account,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic institution authority grant'},operator);}
it('institution authority lists metadata without operational access; operator attachment enables only the explicit branch',async()=>{
 const {scope,identity}=await provision(),created=await createInstitution(scope.accountId),grantId=created.resourceId;
 const directory=await service.getContexts(identity),row=directory.institutions.find(i=>i.id===created.organizationId)!;expect(row.canManage).toBe(true);expect(row.branches).toEqual([]);await expect(service.switchContext(identity,created.organizationId,scope.schoolId)).rejects.toThrow('NOT_FOUND');
 const school=await db.school.create({data:{id:randomUUID(),organizationId:created.organizationId,code:'NORTH',name:'Synthetic north',timezone:'Asia/Kolkata',status:'ACTIVE',version:1,createdAt:new Date()}});
 const attached=await service.institutionOperation({kind:'SetBranchMembership',organizationId:created.organizationId,schoolId:school.id,accountId:scope.accountId,status:'ACTIVE',roles:['SCHOOL_ADMIN'],expectedVersion:0,key:randomUUID(),reason:'Synthetic reviewed branch access'},operator);
 const next=await service.getContexts(identity),branches=next.institutions.find(i=>i.id===created.organizationId)!.branches;expect(branches).toEqual([{id:school.id,code:'NORTH',name:'Synthetic north',timezone:'Asia/Kolkata',selectable:true,delegatedLeadership:false,roles:['SCHOOL_ADMIN']}]);expect((await service.switchContext(identity,created.organizationId,school.id)).scope.schoolId).toBe(school.id);
 await service.institutionOperation({kind:'SetInstitutionGrant',organizationId:created.organizationId,accountId:scope.accountId,status:'REVOKED',expectedVersion:1,key:randomUUID(),reason:'Synthetic authority removal'} ,operator);
 expect((await service.getContexts(identity)).institutions.find(i=>i.id===created.organizationId)?.canManage).toBe(false);expect((await service.switchContext(identity,created.organizationId,school.id)).scope.schoolId).toBe(school.id);expect(await db.schoolMembership.findUniqueOrThrow({where:{id:attached.resourceId}})).toMatchObject({status:'ACTIVE'});expect(await db.institutionGrant.findUniqueOrThrow({where:{id:grantId}})).toMatchObject({status:'REVOKED'});
});
it('branch provisioning replays one scoped write, rejects foreign authority and stale revision',async()=>{
 const {scope,identity}=await provision();await grant(scope.organizationId,scope.accountId);const directory=await service.getContexts(identity),org=directory.institutions.find(i=>i.id===scope.organizationId)!;
 const input={code:'SOUTH',name:'Synthetic south',timezone:'Asia/Kolkata',expectedRevision:org.revision,key:randomUUID(),reason:'Synthetic branch preparation'};
 const first=await service.createBranch(identity,scope.organizationId,input),replay=await service.createBranch(identity,scope.organizationId,input);expect(replay).toMatchObject({...first,replayed:true});expect(await db.school.count({where:{organizationId:scope.organizationId,code:'SOUTH'}})).toBe(1);expect((await service.getContexts(identity)).institutions.find(i=>i.id===scope.organizationId)!.branches.find(b=>b.id===first.resourceId)?.selectable).toBe(false);
 await expect(service.createBranch(identity,scope.organizationId,{...input,key:randomUUID()})).rejects.toThrow('STALE_VERSION');const other=await provision();await expect(service.createBranch(other.identity,scope.organizationId,{...input,key:randomUUID()})).rejects.toThrow('NOT_FOUND');await expect(service.switchContext(identity,randomUUID(),first.resourceId)).rejects.toThrow('NOT_FOUND');
 expect(await db.configurationChange.count({where:{organizationId:scope.organizationId,schoolId:first.resourceId}})).toBe(1);expect(await db.tenantCommandReceipt.count({where:{organizationId:scope.organizationId,command:'CreateBranch'}})).toBe(1);expect(await db.tenantOutbox.count({where:{organizationId:scope.organizationId,type:'CreateBranch.v1'}})).toBe(1);
});
it('institution operator creation has no membership side effect and altered replay keys fail',async()=>{
 const {scope,identity}=await provision(),command={kind:'CreateInstitution' as const,organizationId:randomUUID(),accountId:scope.accountId,name:'Synthetic separate tenant',key:randomUUID(),reason:'Synthetic tenant fixture'};const first=await service.institutionOperation(command,operator),replay=await service.institutionOperation(command,operator);expect(replay.replayed).toBe(true);expect((await db.organization.findUniqueOrThrow({where:{id:first.organizationId}})).trustMode).toBe('HYBRID');expect(await db.school.count({where:{organizationId:first.organizationId}})).toBe(0);expect((await service.getContexts(identity)).institutions.find(i=>i.id===first.organizationId)?.canManage).toBe(true);await expect(service.institutionOperation({...command,name:'Changed replay'},operator)).rejects.toThrow('IDEMPOTENCY_CONFLICT');
});
it('tenant appearance defaults, inherits, overrides and clears with versioned evidence',async()=>{
 const {scope,identity}=await provision();
 expect(await db.organization.findUniqueOrThrow({where:{id:scope.organizationId},select:{themeId:true}})).toEqual({themeId:'forest'});
 expect(await db.school.findUniqueOrThrow({where:{id:scope.schoolId},select:{themeOverride:true}})).toEqual({themeOverride:null});
 expect(await service.getEffectiveTheme(identity,scope.organizationId,scope.schoolId)).toEqual({themeId:'forest',source:'institution'});
 const institution=await grant(scope.organizationId,scope.accountId),evidenceBefore=await db.configurationChange.count({where:{organizationId:scope.organizationId}}),institutionConfig=await service.getAppearanceConfiguration(identity,scope.organizationId);
 const institutionInput={themeId:'amethyst' as const,expectedVersion:institutionConfig.version,key:randomUUID(),reason:'Synthetic institution theme review'};
 const changed=await service.updateInstitutionTheme(identity,scope.organizationId,institutionInput),replay=await service.updateInstitutionTheme(identity,scope.organizationId,institutionInput);
 expect(replay).toEqual({...changed,replayed:true});
 expect(await service.getEffectiveTheme(identity,scope.organizationId,scope.schoolId)).toEqual({themeId:'amethyst',source:'institution'});
 const branchConfig=await service.getAppearanceConfiguration(identity,scope.organizationId,scope.schoolId);
 const explicit=await service.updateBranchTheme(identity,scope.organizationId,scope.schoolId,{themeId:'forest',expectedVersion:branchConfig.version,key:randomUUID(),reason:'Synthetic explicit branch theme'});
 expect(explicit).toMatchObject({selection:'forest',effective:{themeId:'forest',source:'branch'}});
 const nextInstitution=await service.getAppearanceConfiguration(identity,scope.organizationId);
 await service.updateInstitutionTheme(identity,scope.organizationId,{themeId:'linen',expectedVersion:nextInstitution.version,key:randomUUID(),reason:'Synthetic institution theme change'});
 expect(await service.getEffectiveTheme(identity,scope.organizationId,scope.schoolId)).toEqual({themeId:'forest',source:'branch'});
 const nextBranch=await service.getAppearanceConfiguration(identity,scope.organizationId,scope.schoolId);
 const inherited=await service.updateBranchTheme(identity,scope.organizationId,scope.schoolId,{themeId:null,expectedVersion:nextBranch.version,key:randomUUID(),reason:'Synthetic branch inheritance restore'});
 expect(inherited).toMatchObject({selection:null,effective:{themeId:'linen',source:'institution'}});
 expect(await db.configurationChange.count({where:{organizationId:scope.organizationId}})).toBe(evidenceBefore+4);
 expect(await db.tenantCommandReceipt.count({where:{organizationId:scope.organizationId,command:{in:['UpdateInstitutionTheme','UpdateBranchTheme']}}})).toBe(4);
 const themeEvidence=(await db.configurationChange.findMany({where:{organizationId:scope.organizationId},select:{schoolId:true,changes:true}})).map(row=>({...row,changes:row.changes as Record<string,unknown>})).filter(row=>String(row.changes.command).startsWith('Update'));
 expect(themeEvidence).toEqual(expect.arrayContaining([
  expect.objectContaining({schoolId:null,changes:expect.objectContaining({command:'UpdateInstitutionTheme',previousThemeId:'forest',themeId:'amethyst'})}),
  expect.objectContaining({schoolId:scope.schoolId,changes:expect.objectContaining({command:'UpdateBranchTheme',previousThemeId:null,themeId:'forest'})}),
  expect.objectContaining({schoolId:scope.schoolId,changes:expect.objectContaining({command:'UpdateBranchTheme',previousThemeId:'forest',themeId:null})}),
 ]));
 expect(institution.revision).toBeGreaterThan(1);
});
it('tenant appearance rejects stale, changed replay, foreign scope and invalid persistence values',async()=>{
 const {scope,identity}=await provision();await grant(scope.organizationId,scope.accountId);
 const config=await service.getAppearanceConfiguration(identity,scope.organizationId),input={themeId:'porcelain' as const,expectedVersion:config.version,key:randomUUID(),reason:'Synthetic versioned theme update'};
 await service.updateInstitutionTheme(identity,scope.organizationId,input);
 await expect(service.updateInstitutionTheme(identity,scope.organizationId,{...input,key:randomUUID()})).rejects.toThrow('STALE_VERSION');
 await expect(service.updateInstitutionTheme(identity,scope.organizationId,{...input,themeId:'linen'})).rejects.toThrow('IDEMPOTENCY_CONFLICT');
 const other=await provision();
 await expect(service.getAppearanceConfiguration(other.identity,scope.organizationId)).rejects.toThrow('NOT_FOUND');
 await expect(service.updateBranchTheme(other.identity,scope.organizationId,scope.schoolId,{themeId:'amethyst',expectedVersion:1,key:randomUUID(),reason:'Foreign branch theme attempt'})).rejects.toThrow('NOT_FOUND');
 await expect(db.organization.update({where:{id:scope.organizationId},data:{themeId:'unknown'}})).rejects.toThrow();
 await expect(db.school.update({where:{id:scope.schoolId},data:{themeOverride:'unknown'}})).rejects.toThrow();
});
it('owner-verified family or Student rendering resolves an active scope without granting Access membership',async()=>{
 const {scope}=await provision(),portalAccount=await provision();
 await db.organization.update({where:{id:scope.organizationId},data:{themeId:'porcelain'}});
 expect(await service.getEffectiveThemeForVerifiedPortalContext({identity:portalAccount.identity,organizationId:scope.organizationId,schoolId:scope.schoolId,source:'GUARDIAN_CHILD',verified:true})).toEqual({themeId:'porcelain',source:'institution'});
 expect(await db.schoolMembership.count({where:{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:portalAccount.identity.accountId}})).toBe(0);
 await db.userAccount.update({where:{id:portalAccount.identity.accountId},data:{status:'DISABLED',version:{increment:1}}});
 await expect(service.getEffectiveThemeForVerifiedPortalContext({identity:portalAccount.identity,organizationId:scope.organizationId,schoolId:scope.schoolId,source:'STUDENT_SELF',verified:true})).rejects.toThrow('UNAUTHENTICATED');
});
it('institution and branch creation persist validated optional appearance without collapsing inheritance',async()=>{
 const {scope,identity}=await provision(),created=await service.institutionOperation({kind:'CreateInstitution',organizationId:randomUUID(),accountId:scope.accountId,name:'Synthetic themed institution',themeId:'porcelain',key:randomUUID(),reason:'Synthetic themed institution creation'},operator);
 expect(await db.organization.findUniqueOrThrow({where:{id:created.organizationId},select:{themeId:true}})).toEqual({themeId:'porcelain'});
 const contexts=await service.getContexts(identity),revision=contexts.institutions.find(row=>row.id===created.organizationId)!.revision;
 const branch=await service.createBranch(identity,created.organizationId,{code:'THEMED',name:'Synthetic themed branch',timezone:'Asia/Kolkata',themeId:'amethyst',expectedRevision:revision,key:randomUUID(),reason:'Synthetic themed branch creation'});
 expect(await db.school.findUniqueOrThrow({where:{id:branch.resourceId},select:{themeOverride:true}})).toEqual({themeOverride:'amethyst'});
});
it('appearance evidence failure rolls back and revoked identity cannot disclose a prior receipt',async()=>{
 const {scope,identity}=await provision();await grant(scope.organizationId,scope.accountId);const configuration=await service.getAppearanceConfiguration(identity,scope.organizationId),input={themeId:'amethyst' as const,expectedVersion:configuration.version,key:randomUUID(),reason:'Synthetic appearance rollback'};
 const failing=createAppearanceUseCases(new PrismaAppearanceRepository(db,()=>({append:async()=>{throw new Error('injected evidence failure');}})));
 await expect(failing.updateInstitutionTheme(identity,scope.organizationId,input)).rejects.toThrow('UNAVAILABLE');
 expect(await db.organization.findUniqueOrThrow({where:{id:scope.organizationId},select:{themeId:true,configurationVersion:true}})).toEqual({themeId:'forest',configurationVersion:configuration.version});
 expect(await db.tenantCommandReceipt.count({where:{organizationId:scope.organizationId,key:input.key}})).toBe(0);
 await service.updateInstitutionTheme(identity,scope.organizationId,input);
 await db.userAccount.update({where:{id:identity.accountId},data:{status:'DISABLED',version:{increment:1}}});
 await expect(service.updateInstitutionTheme(identity,scope.organizationId,input)).rejects.toThrow('UNAUTHENTICATED');
});
it('enlisted institution audit, receipt and outbox all roll back with the branch write',async()=>{
 const {scope,identity}=await provision();await grant(scope.organizationId,scope.accountId);const repo=new PrismaInstitutionRepository(db,tx=>({append:async e=>{await new PrismaInstitutionEvidence(tx).append(e);throw new Error('injected storage failure');}}),(actor,schoolId)=>service.getAccountHome(actor,schoolId));const failing=createInstitutionUseCases(repo),d=await service.getContexts(identity),revision=d.institutions.find(i=>i.id===scope.organizationId)!.revision,input={code:'ROLLBACK',name:'Synthetic rollback',timezone:'Asia/Kolkata',expectedRevision:revision,key:randomUUID(),reason:'Synthetic rollback check'};
 await expect(failing.createBranch(identity,scope.organizationId,input)).rejects.toThrow('UNAVAILABLE');expect(await db.school.count({where:{organizationId:scope.organizationId,code:'ROLLBACK'}})).toBe(0);expect(await db.configurationChange.count({where:{organizationId:scope.organizationId,schoolId:{not:null}}})).toBe(0);expect(await db.tenantCommandReceipt.count({where:{organizationId:scope.organizationId,key:input.key}})).toBe(0);expect(await db.tenantOutbox.count({where:{organizationId:scope.organizationId,type:'CreateBranch.v1'}})).toBe(0);
});
it('composite school references and immutable institution history reject forged writes',async()=>{
 const {scope,identity}=await provision();await grant(scope.organizationId,scope.accountId);const d=await service.getContexts(identity),o=d.institutions.find(i=>i.id===scope.organizationId)!;const branch=await service.createBranch(identity,scope.organizationId,{code:'WEST',name:'Synthetic west',timezone:'Asia/Kolkata',expectedRevision:o.revision,key:randomUUID(),reason:'Synthetic immutable history'});
 await expect(db.configurationChange.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:randomUUID(),actorAccountId:scope.accountId,expectedRevision:1,newRevision:2,changes:{},reason:'Foreign scope attempt',requestId:randomUUID(),occurredAt:new Date()}})).rejects.toMatchObject({code:'P2003'});
 const history=await db.configurationChange.findFirstOrThrow({where:{organizationId:scope.organizationId,schoolId:branch.resourceId}});await expect(db.configurationChange.update({where:{id:history.id},data:{reason:'Changed'}})).rejects.toThrow();const receipt=await db.tenantCommandReceipt.findFirstOrThrow({where:{organizationId:scope.organizationId,command:'CreateBranch'}});await expect(db.tenantCommandReceipt.delete({where:{id:receipt.id}})).rejects.toThrow();
});
it('operator branch revocation obeys the last-active-school-administrator guard',async()=>{
 const {scope}=await provision();await expect(service.institutionOperation({kind:'SetBranchMembership',organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:scope.accountId,status:'REVOKED',roles:['SCHOOL_ADMIN'],expectedVersion:1,key:randomUUID(),reason:'Synthetic last branch administrator check'},operator)).rejects.toThrow('LAST_ADMIN');expect(await db.schoolMembership.findUniqueOrThrow({where:{id:scope.membershipId}})).toMatchObject({status:'ACTIVE',version:1});
});
