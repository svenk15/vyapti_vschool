import type {Identity} from '../../../../shared/contracts/access';
import type {AppearanceConfiguration,BranchThemeUpdateInput,ResolvedTheme,ThemeUpdateInput,ThemeUpdateResult} from '../../../../shared/contracts/branding';
import {AccessError,uuidPattern} from '../domain/policy';
import {branchThemeInput,institutionThemeInput} from '../domain/appearance';

export interface AppearanceRepository {
  effective(identity:Identity,organizationId:string,schoolId?:string):Promise<ResolvedTheme>;
  effectiveVerifiedPortalContext(identity:Identity,organizationId:string,schoolId:string):Promise<ResolvedTheme>;
  configuration(identity:Identity,organizationId:string,schoolId?:string):Promise<AppearanceConfiguration>;
  updateInstitution(identity:Identity,organizationId:string,input:ThemeUpdateInput):Promise<ThemeUpdateResult>;
  updateBranch(identity:Identity,organizationId:string,schoolId:string,input:BranchThemeUpdateInput):Promise<ThemeUpdateResult>;
}
export interface AppearanceFacade {
  getEffectiveTheme(identity:Identity|null,organizationId:unknown,schoolId?:unknown):Promise<ResolvedTheme>;
  getEffectiveThemeForVerifiedPortalContext(input:unknown):Promise<ResolvedTheme>;
  getAppearanceConfiguration(identity:Identity|null,organizationId:unknown,schoolId?:unknown):Promise<AppearanceConfiguration>;
  updateInstitutionTheme(identity:Identity|null,organizationId:unknown,input:unknown):Promise<ThemeUpdateResult>;
  updateBranchTheme(identity:Identity|null,organizationId:unknown,schoolId:unknown,input:unknown):Promise<ThemeUpdateResult>;
}
function auth(identity:Identity|null):asserts identity is Identity {
  if(!identity||!uuidPattern.test(identity.accountId)||!Number.isSafeInteger(identity.tokenVersion))throw new AccessError('UNAUTHENTICATED');
}
function id(value:unknown):string {
  if(typeof value!=='string'||!uuidPattern.test(value))throw new AccessError('NOT_FOUND');
  return value.toLowerCase();
}
export function createAppearanceUseCases(repository:AppearanceRepository):AppearanceFacade {
  return {
    getEffectiveTheme(identity,organizationId,schoolId){auth(identity);return repository.effective(identity,id(organizationId),schoolId===undefined?undefined:id(schoolId));},
    getEffectiveThemeForVerifiedPortalContext(input){if(!input||typeof input!=='object')throw new AccessError('FORBIDDEN');const value=input as Record<string,unknown>,identity=value.identity as Identity|null;if(value.verified!==true||!['GUARDIAN_CHILD','STUDENT_SELF'].includes(String(value.source)))throw new AccessError('FORBIDDEN');auth(identity);return repository.effectiveVerifiedPortalContext(identity,id(value.organizationId),id(value.schoolId));},
    getAppearanceConfiguration(identity,organizationId,schoolId){auth(identity);return repository.configuration(identity,id(organizationId),schoolId===undefined?undefined:id(schoolId));},
    updateInstitutionTheme(identity,organizationId,input){auth(identity);return repository.updateInstitution(identity,id(organizationId),institutionThemeInput(input));},
    updateBranchTheme(identity,organizationId,schoolId,input){auth(identity);return repository.updateBranch(identity,id(organizationId),id(schoolId),branchThemeInput(input));},
  };
}
