import type { ModuleId } from './modules';
export type { ModuleId } from './modules';

export type EntitlementState = 'ACTIVE'|'READ_ONLY'|'SUSPENDED'|'RETIRED';
export type ActivationState = 'DISABLED'|'PROVISIONING'|'ACTIVE'|'READ_ONLY'|'SUSPENDED'|'RETIRED';
export type ModuleConfigurationItem = {
  moduleId:ModuleId; licensedState:EntitlementState|null; activationState:ActivationState;
  releaseAvailable:boolean; effective:boolean; dependencies:ModuleId[]; blockingReasons:string[]; version:number;
};
export type BranchModuleConfiguration = {
  organizationId:string; schoolId:string; institutionRevision:number; branchRevision:number;
  modules:ModuleConfigurationItem[];
};
export type BranchModulePreview = {
  organizationId:string; schoolId:string; institutionRevision:number; branchRevision:number;
  desired:ModuleId[]; expectedVersions:Record<string,number>; previewHash:string; blockers:{moduleId:ModuleId;code:string}[];
};
export type ConfirmBranchModules = {
  expectedInstitutionRevision:number; expectedBranchRevision:number; expectedVersions:Record<string,number>;
  previewHash:string; enabled:ModuleId[]; key:string; reason:string;
};
export type SetOrganizationEntitlement = {
  kind:'SetOrganizationEntitlement'; organizationId:string; actorAccountId:string; moduleId:ModuleId;
  state:EntitlementState; startsAt:string; endsAt:string|null; expectedVersion:number;
  manifestVersion:number; limits:Record<string,never>; key:string; reason:string;
};
export type OrganizationTrustMode='OPERATOR_CLI'|'HYBRID'|'EMAIL';
export type SetOrganizationTrustMode={kind:'SetOrganizationTrustMode';organizationId:string;actorAccountId:string;trustMode:OrganizationTrustMode;expectedRevision:number;key:string;reason:string};
export type TenantModulePermission = {accountId:string;organizationId:string;schoolId:string;moduleId:ModuleId;permission:string;resourceId?:string};
