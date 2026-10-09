# Tenancy — concrete engineering LLD

## Responsibility and aggregate boundary
Institution entitlement and branch activation. Aggregates/owned records: OrganizationEntitlement, BranchActivation, ConfigurationChange, TenantCommandReceipt, TenantOutbox. Not every child table is a separate aggregate; commands follow existing root state/version contracts.

**Invariants:** License and branch activation differ; release manifest is another independent gate. Preserve tightening/invalidation and expected revision. RLS context proof remains its own release work.

## Input facades and cross-owner ports
- `backend/modules/tenancy/application/modules.ts`
- `backend/modules/tenancy/contracts/evidence.ts`
- `backend/modules/tenancy/contracts/index.ts`
- `backend/modules/tenancy/contracts/verified-database-context.ts`

The exact interfaces, validators and facade method bodies are reproduced below and in engineering/source-reference. They are observed code, not newly generated replacement APIs. Live compatible contracts take precedence after EX-00. Preserve parameters/error codes unless a separately designed delta changes them.

### backend/modules/tenancy/application/modules.ts

```ts
import type {Identity,OperatorPrincipal} from '../../../../shared/contracts/access';
import type {BranchModuleConfiguration,BranchModulePreview,ConfirmBranchModules,ModuleId,SetOrganizationEntitlement,SetOrganizationTrustMode,TenantModulePermission} from '../../../../shared/contracts/tenancy-modules';
import type {ReleaseManifest} from '../domain/entitlements';
import {AccessError,uuidPattern} from '../../access/contracts/index';
import {isModuleId} from '../domain/entitlements';

export interface TenancyModuleRepository {
 getBranch(identity:Identity,organizationId:string,schoolId:string):Promise<BranchModuleConfiguration>;
 preview(identity:Identity,organizationId:string,schoolId:string,enabled:ModuleId[]):Promise<BranchModulePreview>;
 confirm(identity:Identity,organizationId:string,schoolId:string,input:ConfirmBranchModules):Promise<{organizationId:string;schoolId:string;modules:ModuleId[];branchRevision:number;replayed:boolean}>;
 setEntitlement(operator:OperatorPrincipal,input:SetOrganizationEntitlement):Promise<{organizationId:string;moduleId:ModuleId;version:number;revision:number;replayed:boolean}>;
 setTrustMode(operator:OperatorPrincipal,input:SetOrganizationTrustMode):Promise<{organizationId:string;trustMode:SetOrganizationTrustMode['trustMode'];revision:number;revokedInvites:number;revokedResetTokens:number;replayed:boolean}>;
 moduleState(identity:Identity,organizationId:string,schoolId:string,moduleId:ModuleId):Promise<{enabled:boolean;releaseAvailable:boolean}>;
}
export interface CurrentModulePermission { assertCurrentPermission(identity:Identity,permission:TenantModulePermission):Promise<void> }
export interface TenancyModuleFacade {
 getBranch(identity:Identity|null,organizationId:unknown,schoolId:unknown):Promise<BranchModuleConfiguration>;
 preview(identity:Identity|null,organizationId:unknown,schoolId:unknown,enabled:unknown):Promise<BranchModulePreview>;
 confirm(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown):Promise<{organizationId:string;schoolId:string;modules:ModuleId[];branchRevision:number;replayed:boolean}>;
 setEntitlement(operator:OperatorPrincipal,input:unknown):Promise<{organizationId:string;moduleId:ModuleId;version:number;revision:number;replayed:boolean}>;
 setTrustMode(operator:OperatorPrincipal,input:unknown):Promise<{organizationId:string;trustMode:SetOrganizationTrustMode['trustMode'];revision:number;revokedInvites:number;revokedResetTokens:number;replayed:boolean}>;
 assertModule(identity:Identity|null,organizationId:unknown,schoolId:unknown,moduleId:unknown,permission:string,resourceId?:string):Promise<void>;
}
function identity(actor:Identity|null):asserts actor is Identity {if(!actor||!uuidPattern.test(actor.accountId)||!Number.isSafeInteger(actor.tokenVersion))throw new AccessError('UNAUTHENTICATED');}
function id(value:unknown){if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('NOT_FOUND');return value.toLowerCase();}
function number(value:unknown,max=2147483646){if(!Number.isSafeInteger(value)||Number(value)<0||Number(value)>max)throw new AccessError('VALIDATION');return Number(value);}
function reason(value:unknown){if(typeof value!=='string')throw new AccessError('VALIDATION');const v=value.normalize('NFC').trim();if(v.length<5||v.length>500||/[\u0000-\u001f]/.test(v))throw new AccessError('VALIDATION');return v;}
function moduleList(raw:unknown):ModuleId[]{if(!Array.isArray(raw)||raw.length>18||raw.some(x=>typeof x!=='string'||!isModuleId(x)))throw new AccessError('VALIDATION');return [...new Set(raw as ModuleId[])].sort();}
function confirmInput(raw:unknown):ConfirmBranchModules {if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');const v=raw as Record<string,unknown>,enabled=moduleList(v.enabled),versions=v.expectedVersions;if(!versions||typeof versions!=='object'||Array.isArray(versions))throw new AccessError('VALIDATION');const expectedVersions:Record<string,number>={};for(const [k,n] of Object.entries(versions)){if(!isModuleId(k))throw new AccessError('VALIDATION');expectedVersions[k]=number(n);}if(typeof v.previewHash!=='string'||!/[a-f0-9]{64}/.test(v.previewHash))throw new AccessError('VALIDATION');return {enabled,expectedVersions,previewHash:v.previewHash,expectedInstitutionRevision:number(v.expectedInstitutionRevision),expectedBranchRevision:number(v.expectedBranchRevision),key:id(v.key),reason:reason(v.reason)};}
function entitlementInput(raw:unknown):SetOrganizationEntitlement {if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');const v=raw as Record<string,unknown>;if(!isModuleId(v.moduleId as string)||!['ACTIVE','READ_ONLY','SUSPENDED','RETIRED'].includes(String(v.state)))throw new AccessError('VALIDATION');if(typeof v.startsAt!=='string'||Number.isNaN(Date.parse(v.startsAt))||new Date(v.startsAt).toISOString()!==v.startsAt)throw new AccessError('VALIDATION');let endsAt:string|null=null;if(v.endsAt!==null){if(typeof v.endsAt!=='string'||Number.isNaN(Date.parse(v.endsAt))||new Date(v.endsAt).toISOString()!==v.endsAt||Date.parse(v.endsAt)<=Date.parse(v.startsAt))throw new AccessError('VALIDATION');endsAt=v.endsAt;}if(!v.limits||typeof v.limits!=='object'||Array.isArray(v.limits)||Object.keys(v.limits).length!==0||v.manifestVersion!==1)throw new AccessError('VALIDATION');return {kind:'SetOrganizationEntitlement',organizationId:id(v.organizationId),actorAccountId:id(v.actorAccountId),moduleId:v.moduleId as ModuleId,state:v.state as SetOrganizationEntitlement['state'],startsAt:v.startsAt,endsAt,expectedVersion:number(v.expectedVersion),manifestVersion:1,limits:{},key:id(v.key),reason:reason(v.reason)};}
function trustModeInput(raw:unknown):SetOrganizationTrustMode {if(!raw||typeof raw!=='object')throw new AccessError('VALIDATION');const v=raw as Record<string,unknown>;if(!['OPERATOR_CLI','HYBRID','EMAIL'].includes(String(v.trustMode)))throw new AccessError('VALIDATION');return {kind:'SetOrganizationTrustMode',organizationId:id(v.organizationId),actorAccountId:id(v.actorAccountId),trustMode:v.trustMode as SetOrganizationTrustMode['trustMode'],expectedRevision:number(v.expectedRevision),key:id(v.key),reason:reason(v.reason)};}
export function createTenancyModuleUseCases(repo:TenancyModuleRepository,permission:CurrentModulePermission,manifest:ReleaseManifest):TenancyModuleFacade{return {
 async getBranch(actor,organizationId,schoolId){identity(actor);return repo.getBranch(actor,id(organizationId),id(schoolId));},
 async preview(actor,organizationId,schoolId,enabled){identity(actor);return repo.preview(actor,id(organizationId),id(schoolId),moduleList(enabled));},
 async confirm(actor,organizationId,schoolId,raw){identity(actor);return repo.confirm(actor,id(organizationId),id(schoolId),confirmInput(raw));},
 async setEntitlement(operator,raw){if(operator?.verified!==true||!uuidPattern.test(operator.operatorId))throw new AccessError('UNAUTHENTICATED');return repo.setEntitlement(operator,entitlementInput(raw));},
 async setTrustMode(operator,raw){if(operator?.verified!==true||!uuidPattern.test(operator.operatorId))throw new AccessError('UNAUTHENTICATED');return repo.setTrustMode(operator,trustModeInput(raw));},
 async assertModule(actor,organizationId,schoolId,rawModule,capability,resourceId){identity(actor);if(typeof rawModule!=='string'||!isModuleId(rawModule))throw new AccessError('VALIDATION');const org=id(organizationId),school=id(schoolId),moduleId=rawModule as ModuleId;if(!manifest[moduleId])throw new AccessError('RELEASE_UNAVAILABLE');const state=await repo.moduleState(actor,org,school,moduleId);if(!state.releaseAvailable)throw new AccessError('RELEASE_UNAVAILABLE');if(!state.enabled)throw new AccessError('MODULE_DISABLED');await permission.assertCurrentPermission(actor,{accountId:actor.accountId,organizationId:org,schoolId:school,moduleId,permission:capability,...(resourceId?{resourceId:id(resourceId)}:{})});},
};}

```

### backend/modules/tenancy/contracts/evidence.ts

```ts
export type InstitutionEvidence={organizationId:string;schoolId?:string;actorAccountId:string;command:string;key:string;inputHash:string;response:Record<string,unknown>;expectedRevision:number;newRevision:number;reason:string;requestId:string;occurredAt:string;changes:{schemaVersion:1;principalKind:'OPERATOR'|'ACCOUNT';operatorId?:string;resourceId:string;version:number;status?:string;trustMode?:'OPERATOR_CLI'|'HYBRID'|'EMAIL';roles?:string[];moduleId?:string;enabled?:string[];limits?:Record<string,never>}};
export interface InstitutionEvidenceWriter {append(input:InstitutionEvidence):Promise<void>}

```

### backend/modules/tenancy/contracts/index.ts

```ts
export type { InstitutionEvidence, InstitutionEvidenceWriter } from './evidence';
export type { ReleaseManifest } from '../domain/entitlements';
export type { VerifiedBranchContextInput, VerifiedDatabaseContextPort } from './verified-database-context';

```

### backend/modules/tenancy/contracts/verified-database-context.ts

```ts
export type VerifiedBranchContextInput=Readonly<{
 accountId:string;
 tokenVersion:number;
 organizationId:string;
 branchId:string;
}>;
export type VerifiedStaffInviteContext=Readonly<{inviteId:string;accountId:string;inviterAccountId:string;organizationId:string;schoolId:string}>;

export interface VerifiedDatabaseContextPort {
 establish(transaction:object,context:VerifiedBranchContextInput):Promise<boolean>;
 establishAccount(transaction:object,accountId:string,tokenVersion:number):Promise<boolean>;
 findAccountByEmail(transaction:object,normalizedEmail:string):Promise<string|null>;
 findAccountForPasswordReset(transaction:object,tokenHash:string):Promise<string|null>;
 findStaffInviteByToken(transaction:object,tokenHash:string):Promise<VerifiedStaffInviteContext|null>;
 findStaffInviteById(transaction:object,inviteId:string):Promise<VerifiedStaffInviteContext|null>;
}

```

## Output adapters

- `backend/modules/tenancy/infrastructure/evidence.ts`
- `backend/modules/tenancy/infrastructure/modules.ts`
- `backend/modules/tenancy/infrastructure/verified-db-context.ts`

## Pure domain rules

- `backend/modules/tenancy/domain/entitlements.ts`

## Physical data

- `vs_tenancy_configuration_change` — Append-only institution or branch configuration history with an atomically enlisted revision.; see database/tables/vs_tenancy_configuration_change.md
- `vs_tenancy_tenant_command_receipt` — Idempotent institution command outcomes, scoped to the verified account and tenant.; see database/tables/vs_tenancy_tenant_command_receipt.md
- `vs_tenancy_tenant_outbox` — Institution-scoped integration events with immutable payload and mutable delivery state.; see database/tables/vs_tenancy_tenant_outbox.md
- `vs_tenancy_organization_entitlement` — Module contract, activation or configuration evidence.; see database/tables/vs_tenancy_organization_entitlement.md
- `vs_tenancy_branch_activation` — Module contract, activation or configuration evidence.; see database/tables/vs_tenancy_branch_activation.md

## Wiring and transaction evidence

Read the exact matching factory under engineering/source-reference/backend/composition, Next gateway under lib/server, and actual route map. The original owner DESIGN.md is included under engineering/source-reference/docs/modules/tenancy/DESIGN.md when present. Repository transaction code is also preserved verbatim: inspect the specific method before changing it. Common architecture and critical-path sequences are in HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md and CRITICAL_WORKFLOWS.md.

## Task rule

For this owner, bind each consumed screen operation to one existing facade method and one current permission check. Use the applicable EX ticket. New use case requires a named command/query, exact transport DTO, owner port, transaction/read projection and positive/negative test before implementation. No generic catch-all endpoint, no writes from a page, no cross-owner repository import. A styling task adds no tables.
