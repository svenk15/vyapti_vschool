import "server-only";
import { createAccessServices } from "../../backend/composition/access";
import { cookies } from "next/headers";
import { AccessError } from "../../backend/modules/access/contracts";
import type { ManagementFacade } from "../../backend/modules/access/contracts";
import type { Identity } from "../../shared/contracts/access";
import {emailSender} from "./email";

export const access = createAccessServices({databaseUrl:process.env.DATABASE_URL??"",cursorSecret:process.env.NEXTAUTH_SECRET,emailSender});
// Candidate cookies never carry permission; the portable facade reauthorizes.
export async function selectedSchoolId(identity:Identity|null):Promise<string|undefined>{
 const raw=(await cookies()).get('vschool-context')?.value;if(!raw)return undefined;
 let candidate;try{candidate=JSON.parse(raw);}catch{throw new AccessError('NOT_FOUND');}
 if(!identity||candidate.accountId!==identity.accountId)return undefined;
 const home=await access.switchContext(identity,candidate.organizationId,candidate.schoolId);return home.scope.schoolId;
}
export const contextGateway={getContexts:access.getContexts,switchContext:access.switchContext,createBranch:access.createBranch};
export const accountGateway={getHome:async(identity:Identity|null,schoolId?:string)=>access.getAccountHome(identity,schoolId??await selectedSchoolId(identity)),getSelf:access.getSelfAccount};
export const appearanceGateway={
 getEffective:(identity:Identity|null,organizationId:string,schoolId?:string)=>access.getEffectiveTheme(identity,organizationId,schoolId),
 getVerifiedPortalTheme:(identity:Identity|null,organizationId:string,schoolId:string,source:'GUARDIAN_CHILD'|'STUDENT_SELF')=>access.getEffectiveThemeForVerifiedPortalContext({identity,organizationId,schoolId,source,verified:true}),
 getInstitution:(identity:Identity|null,organizationId:string)=>access.getAppearanceConfiguration(identity,organizationId),
 updateInstitution:(identity:Identity|null,organizationId:string,input:unknown)=>access.updateInstitutionTheme(identity,organizationId,input),
 async getBranch(identity:Identity|null){const home=await accountGateway.getHome(identity);return access.getAppearanceConfiguration(identity,home.scope.organizationId,home.scope.schoolId);},
 async updateBranch(identity:Identity|null,input:unknown){const home=await accountGateway.getHome(identity);return access.updateBranchTheme(identity,home.scope.organizationId,home.scope.schoolId,input);},
};
export const leadershipGateway={getHome:async(identity:Identity|null,schoolId?:string)=>access.getLeadershipHome(identity,schoolId??await selectedSchoolId(identity))};
export const delegationGateway={listOwn:access.listOwnDelegations};
export const sessionGateway={list:access.listSessions,revoke:access.revokeSession};
export const preferenceGateway={get:access.getOwnPreferences,update:access.updateOwnPreferences,getSupport:access.getSchoolSupport};
export const adminGateway = {
 getSettings:async(identity:Identity|null,schoolId?:string)=>access.getSettings(identity,schoolId??await selectedSchoolId(identity)),
 listMembers:async(identity:Identity|null,schoolId?:string,cursor?:string)=>access.listMembers(identity,schoolId??await selectedSchoolId(identity),cursor),
 command:async(...args:Parameters<ManagementFacade['command']>)=>{args[4]??=await selectedSchoolId(args[0]);return access.command(...args);},
 status:async(...args:Parameters<ManagementFacade['status']>)=>{args[3]??=await selectedSchoolId(args[0]);return access.status(...args);},
 getHome:async(identity:Identity|null,schoolId?:string)=>access.getAdminHome(identity,schoolId??await selectedSchoolId(identity)),
};
