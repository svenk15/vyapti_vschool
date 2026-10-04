import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {BranchModuleConfiguration,BranchModulePreview,ConfirmBranchModules,ModuleId,SetOrganizationEntitlement,TenantModulePermission} from '../../../../shared/contracts/tenancy-modules';
import type {ReleaseManifest} from '../domain/entitlements';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {isModuleId} from '../domain/entitlements';

export interface TenancyModuleRepository {
 getBranch(identity:Identity,organizationId:string,schoolId:string):Promise<BranchModuleConfiguration>;
 preview(identity:Identity,organizationId:string,schoolId:string,enabled:ModuleId[]):Promise<BranchModulePreview>;
 confirm(identity:Identity,organizationId:string,schoolId:string,input:ConfirmBranchModules):Promise<{organizationId:string;schoolId:string;modules:ModuleId[];branchRevision:number;replayed:boolean}>;
 setEntitlement(operator:OperatorPrincipal,input:SetOrganizationEntitlement):Promise<{organizationId:string;moduleId:ModuleId;version:number;revision:number;replayed:boolean}>;
 moduleState(organizationId:string,schoolId:string,moduleId:ModuleId):Promise<{enabled:boolean;releaseAvailable:boolean}>;
}
export interface CurrentModulePermission { assertCurrentPermission(identity:Identity,permission:TenantModulePermission):Promise<void> }
export interface TenancyModuleFacade {
 getBranch(identity:Identity|null,organizationId:unknown,schoolId:unknown):Promise<BranchModuleConfiguration>;
 preview(identity:Identity|null,organizationId:unknown,schoolId:unknown,enabled:unknown):Promise<BranchModulePreview>;
 confirm(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown):Promise<{organizationId:string;schoolId:string;modules:ModuleId[];branchRevision:number;replayed:boolean}>;
 setEntitlement(operator:OperatorPrincipal,input:unknown):Promise<{organizationId:string;moduleId:ModuleId;version:number;revision:number;replayed:boolean}>;
 assertModule(identity:Identity|null,organizationId:unknown,schoolId:unknown,moduleId:unknown,permission:string,resourceId?:string):Promise<void>;
}
function identity(actor:Identity|null):asserts actor is Identity {if(!actor||!uuidPattern.test(actor.accountId)||!Number.isSafeInteger(actor.tokenVersion))throw new AccessError('UNAUTHENTICATED');}
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('NOT_FOUND');return value.toLowerCase();}
function number(value:unknown,max=2147483646){if(!Number.isSafeInteger(value)||Number(value)<0||Number(value)>max)throw new AccessError('VALIDATION');return Number(value);}
function reason(value:unknown){if(typeof value!=='string')throw new AccessError('VALIDATION');const v=value.normalize('NFC').trim();if(v.length<5||v.length>500||/[\u0000-\u001f]/.test(v))throw new AccessError('VALIDATION');return v;}
function moduleList(raw:unknown):ModuleId[]{if(!Array.isArray(raw)||raw.length>18||raw.some(x=>typeof x!=='string'||!isModuleId(x)))throw new AccessError('VALIDATION');return [...new Set(raw as ModuleId[])].sort();}
function confirmInput(raw:unknown):ConfirmBranchModules {if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');const v=raw as Record<string,unknown>,enabled=moduleList(v.enabled),versions=v.expectedVersions;if(!versions||typeof versions!=='object'||Array.isArray(versions))throw new AccessError('VALIDATION');const expectedVersions:Record<string,number>={};for(const [k,n] of Object.entries(versions)){if(!isModuleId(k))throw new AccessError('VALIDATION');expectedVersions[k]=number(n);}if(typeof v.previewHash!=='string'||!/[a-f0-9]{64}/.test(v.previewHash))throw new AccessError('VALIDATION');return {enabled,expectedVersions,previewHash:v.previewHash,expectedInstitutionRevision:number(v.expectedInstitutionRevision),expectedBranchRevision:number(v.expectedBranchRevision),key:id(v.key),reason:reason(v.reason)};}
function entitlementInput(raw:unknown):SetOrganizationEntitlement {if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');const v=raw as Record<string,unknown>;if(!isModuleId(v.moduleId as string)||!['ACTIVE','READ_ONLY','SUSPENDED','RETIRED'].includes(String(v.state)))throw new AccessError('VALIDATION');if(typeof v.startsAt!=='string'||Number.isNaN(Date.parse(v.startsAt))||new Date(v.startsAt).toISOString()!==v.startsAt)throw new AccessError('VALIDATION');let endsAt:string|null=null;if(v.endsAt!==null){if(typeof v.endsAt!=='string'||Number.isNaN(Date.parse(v.endsAt))||new Date(v.endsAt).toISOString()!==v.endsAt||Date.parse(v.endsAt)<=Date.parse(v.startsAt))throw new AccessError('VALIDATION');endsAt=v.endsAt;}if(!v.limits||typeof v.limits!=='object'||Array.isArray(v.limits)||Object.keys(v.limits).length!==0||v.manifestVersion!==1)throw new AccessError('VALIDATION');return {kind:'SetOrganizationEntitlement',organizationId:id(v.organizationId),actorAccountId:id(v.actorAccountId),moduleId:v.moduleId as ModuleId,state:v.state as SetOrganizationEntitlement['state'],startsAt:v.startsAt,endsAt,expectedVersion:number(v.expectedVersion),manifestVersion:1,limits:{},key:id(v.key),reason:reason(v.reason)};}
export function createTenancyModuleUseCases(repo:TenancyModuleRepository,permission:CurrentModulePermission,manifest:ReleaseManifest):TenancyModuleFacade{return {
 async getBranch(actor,organizationId,schoolId){identity(actor);return repo.getBranch(actor,id(organizationId),id(schoolId));},
 async preview(actor,organizationId,schoolId,enabled){identity(actor);return repo.preview(actor,id(organizationId),id(schoolId),moduleList(enabled));},
 async confirm(actor,organizationId,schoolId,raw){identity(actor);return repo.confirm(actor,id(organizationId),id(schoolId),confirmInput(raw));},
 async setEntitlement(operator,raw){if(operator?.verified!==true||!uuidPattern.test(operator.operatorId))throw new AccessError('UNAUTHENTICATED');return repo.setEntitlement(operator,entitlementInput(raw));},
 async assertModule(actor,organizationId,schoolId,rawModule,capability,resourceId){identity(actor);if(typeof rawModule!=='string'||!isModuleId(rawModule))throw new AccessError('VALIDATION');const org=id(organizationId),school=id(schoolId),moduleId=rawModule as ModuleId;if(!manifest[moduleId])throw new AccessError('RELEASE_UNAVAILABLE');const state=await repo.moduleState(org,school,moduleId);if(!state.releaseAvailable)throw new AccessError('RELEASE_UNAVAILABLE');if(!state.enabled)throw new AccessError('MODULE_DISABLED');await permission.assertCurrentPermission(actor,{accountId:actor.accountId,organizationId:org,schoolId:school,moduleId,permission:capability,...(resourceId?{resourceId:id(resourceId)}:{})});},
};}
