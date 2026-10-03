import { describe,expect,it } from "vitest";
import { canUseModule, dependencyClosure, enabledModules, isModuleId, type TenantConfiguration } from "../../backend/modules/tenancy/domain/entitlements";
const configuration:TenantConfiguration={organizationId:"institution-a",branch:{id:"north",organizationId:"institution-a"},licensed:["attendance","fees"],enabled:["attendance"],lifecycle:"ACTIVE"};
const request={requestedScope:{organizationId:"institution-a",branchId:"north"},verifiedMemberships:[{organizationId:"institution-a",branchId:"north"}],configuration,moduleId:"attendance" as const,hasCapability:true,releaseAvailable:true,resourceAllowed:true};
describe("module packaging and scope reference policy",()=>{
 it("attendance includes its internal foundations without fees",()=>expect(dependencyClosure(["attendance"])).toEqual(["academic_core","attendance","staff_core","student_core"]));
 it("fees operates without attendance or academic enrollment",()=>expect(dependencyClosure(["fees"])).toEqual(["fees","student_core"]));
 it("deduplicates shared foundations",()=>expect(dependencyClosure(["fees","attendance","fees"]).filter(x=>x==="student_core")).toHaveLength(1));
 it("rejects unlicensed activation",()=>expect(()=>enabledModules({...configuration,licensed:["fees"]})).toThrow("MODULE_NOT_LICENSED"));
 it("rejects mismatched institution and branch ownership",()=>expect(()=>enabledModules({...configuration,branch:{id:"north",organizationId:"institution-b"}})).toThrow("BRANCH_SCOPE_MISMATCH"));
 it("suspension disables every module",()=>expect(enabledModules({...configuration,lifecycle:"SUSPENDED"})).toEqual([]));
 it("allows only when release, entitlement, activation, membership and resource permission agree",()=>expect(canUseModule(request)).toBe(true));
 it.each(["hasCapability","releaseAvailable","resourceAllowed"] as const)("denies missing %s even with licensed module",key=>expect(canUseModule({...request,[key]:false})).toBe(false));
 it("denies another branch in the same institution",()=>expect(canUseModule({...request,requestedScope:{organizationId:"institution-a",branchId:"south"}})).toBe(false));
 it("denies another institution even with the same branch label",()=>expect(canUseModule({...request,requestedScope:{organizationId:"institution-b",branchId:"north"}})).toBe(false));
 it("denies an ungranted actor",()=>expect(canUseModule({...request,verifiedMemberships:[]})).toBe(false));
 it("denies licensed but disabled capability",()=>expect(canUseModule({...request,moduleId:"fees"})).toBe(false));
 it("rejects prototype names and unknown registry entries",()=>{expect(isModuleId("constructor")).toBe(false);expect(isModuleId("unknown")).toBe(false);expect(()=>dependencyClosure(["unknown" as never])).toThrow("UNKNOWN_MODULE");});
});
