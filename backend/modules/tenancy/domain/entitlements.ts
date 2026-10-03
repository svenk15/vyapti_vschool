/** Pure reference policy. Persistence and protected product endpoints are TEN-02 work. */
import { dependencyClosure, type ModuleId } from "../../../../shared/contracts/modules";
export { moduleCatalog, dependencyClosure, isModuleId } from "../../../../shared/contracts/modules";
export type { ModuleId } from "../../../../shared/contracts/modules";

export type BranchScope = Readonly<{ organizationId: string; branchId: string }>;
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
