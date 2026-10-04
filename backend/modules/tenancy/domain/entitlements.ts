/** Pure reference policy. Persistence and protected product endpoints are TEN-02 work. */
import { dependencyClosure,moduleCatalog,isModuleId,type ModuleId } from "../../../../shared/contracts/modules";
import type { ActivationState,EntitlementState,ModuleConfigurationItem } from "../../../../shared/contracts/tenancy-modules";
export { moduleCatalog, dependencyClosure, isModuleId } from "../../../../shared/contracts/modules";
export type { ModuleId } from "../../../../shared/contracts/modules";

export type BranchScope = Readonly<{ organizationId: string; branchId: string }>;
export type ReleaseManifest = Readonly<Record<ModuleId,boolean>>;
export const NO_PRODUCT_RELEASES:ReleaseManifest=Object.freeze({student_core:false,academic_core:false,staff_core:false,attendance:false,fees:false,admissions:false,assessments:false,family:false,communication:false,timetable:false,homework:false,transport:false,hr:false,library:false,inventory:false,health:false,analytics:false,ai:false});
export type EntitlementRecord={moduleId:ModuleId;state:EntitlementState;startsAt:Date;endsAt:Date|null;version:number};
export type ActivationRecord={moduleId:ModuleId;state:ActivationState;version:number};
export type TenantConfiguration = Readonly<{
  organizationId: string;
  branch: { id: string; organizationId: string };
  licensed: readonly ModuleId[];
  enabled: readonly ModuleId[];
  lifecycle: "ACTIVE" | "SUSPENDED";
}>;

export function enabledModules(config: TenantConfiguration): ModuleId[] {
  if (config.branch.organizationId !== config.organizationId) throw new Error("BRANCH_SCOPE_MISMATCH");
  if (config.lifecycle !== "ACTIVE") return [];
  const licensed = new Set(dependencyClosure(config.licensed));
  const requested = dependencyClosure(config.enabled);
  if (requested.some(id => !licensed.has(id))) throw new Error("MODULE_NOT_LICENSED");
  return requested;
}

/** Caller must supply verified memberships/capabilities, never request assertions. */
export function canUseModule(input: {
  requestedScope: BranchScope;
  verifiedMemberships: readonly BranchScope[];
  configuration: TenantConfiguration;
  moduleId: ModuleId;
  hasCapability: boolean;
  releaseAvailable: boolean;
  resourceAllowed: boolean;
}): boolean {
  const { requestedScope: scope, configuration: config } = input;
  if (scope.organizationId !== config.organizationId || scope.branchId !== config.branch.id) return false;
  if (!input.verifiedMemberships.some(m => m.organizationId === scope.organizationId && m.branchId === scope.branchId)) return false;
  if (!input.hasCapability || !input.releaseAvailable || !input.resourceAllowed) return false;
  try { return enabledModules(config).includes(input.moduleId); } catch { return false; }
}

export function configurationItems(input:{entitlements:readonly EntitlementRecord[];activations:readonly ActivationRecord[];manifest:ReleaseManifest;now:Date}):ModuleConfigurationItem[]{
 const licensed=new Map(input.entitlements.map(x=>[x.moduleId,x])),activated=new Map(input.activations.map(x=>[x.moduleId,x]));
 return (Object.keys(moduleCatalog) as ModuleId[]).sort().map(moduleId=>{
  const entitlement=licensed.get(moduleId),activation=activated.get(moduleId),releaseAvailable=input.manifest[moduleId];
  const blockers:string[]=[];
  if(!releaseAvailable)blockers.push('RELEASE_UNAVAILABLE');
  if(!entitlement)blockers.push('NOT_LICENSED');
  else if(entitlement.state!=='ACTIVE'||entitlement.startsAt>input.now||(entitlement.endsAt!==null&&entitlement.endsAt<=input.now))blockers.push('ENTITLEMENT_INACTIVE');
  if(activation?.state!=='ACTIVE')blockers.push('BRANCH_DISABLED');
  const dependencies=moduleCatalog[moduleId].dependencies as readonly ModuleId[];
  for(const dependency of dependencies){const depEnt=licensed.get(dependency),depAct=activated.get(dependency);if(!input.manifest[dependency]||!depEnt||depEnt.state!=='ACTIVE'||depEnt.startsAt>input.now||(depEnt.endsAt!==null&&depEnt.endsAt<=input.now)||depAct?.state!=='ACTIVE')blockers.push('DEPENDENCY_DISABLED');}
  return {moduleId,licensedState:entitlement?.state??null,activationState:activation?.state??'DISABLED',releaseAvailable,effective:blockers.length===0,dependencies:[...dependencies],blockingReasons:[...new Set(blockers)],version:activation?.version??0};
 });
}

export function previewBlockers(input:{desired:readonly ModuleId[];items:readonly ModuleConfigurationItem[];manifest:ReleaseManifest}):{moduleId:ModuleId;code:string}[]{
 const chosen=new Set(dependencyClosure(input.desired)),byId=new Map(input.items.map(x=>[x.moduleId,x])),blockers:{moduleId:ModuleId;code:string}[]=[];
 for(const moduleId of chosen){const item=byId.get(moduleId)!;if(!input.manifest[moduleId])blockers.push({moduleId,code:'RELEASE_UNAVAILABLE'});if(!item.licensedState||item.licensedState!=='ACTIVE')blockers.push({moduleId,code:'MODULE_NOT_LICENSED'});for(const dependency of item.dependencies)if(!chosen.has(dependency))blockers.push({moduleId,code:'DEPENDENCY_DISABLED'});}
 return blockers;
}

export function releasedModuleIds(raw?:string):ModuleId[]{
 if(!raw?.trim())return [];const values=raw.split(',').map(value=>value.trim());
 if(values.some(value=>!value||!isModuleId(value))||new Set(values).size!==values.length)throw new Error('INVALID_RELEASE_MANIFEST');
 return (values as ModuleId[]).sort();
}
export function capabilityReleaseManifest(released:readonly ModuleId[]=[]):ReleaseManifest{
 const manifest={...NO_PRODUCT_RELEASES} as Record<ModuleId,boolean>;for(const moduleId of released)manifest[moduleId]=true;return Object.freeze(manifest);
}
