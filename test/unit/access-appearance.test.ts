import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {createAppearanceUseCases,type AppearanceRepository} from '../../backend/modules/access/application/appearance';
import type {AppearanceConfiguration,BranchThemeUpdateInput,ResolvedTheme,ThemeUpdateInput,ThemeUpdateResult} from '../../shared/contracts/branding';

const identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID();
const config:AppearanceConfiguration={organizationId,schoolId:null,selection:'forest',inheritedTheme:null,effective:{themeId:'forest',source:'institution'},version:1};
class FakeAppearance implements AppearanceRepository {
  lastInstitution?:ThemeUpdateInput;lastBranch?:BranchThemeUpdateInput;
  async effective():Promise<ResolvedTheme>{return config.effective;}
  async configuration():Promise<AppearanceConfiguration>{return config;}
  async updateInstitution(_identity:typeof identity,_organizationId:string,input:ThemeUpdateInput):Promise<ThemeUpdateResult>{this.lastInstitution=input;return {...config,selection:input.themeId,effective:{themeId:input.themeId,source:'institution'},replayed:false};}
  async updateBranch(_identity:typeof identity,_organizationId:string,_schoolId:string,input:BranchThemeUpdateInput):Promise<ThemeUpdateResult>{this.lastBranch=input;return {...config,schoolId,selection:input.themeId,effective:{themeId:input.themeId??'forest',source:input.themeId===null?'institution':'branch'},replayed:false};}
}

describe('Access appearance contract',()=>{
  it('accepts only the four named themes and preserves null inheritance separately from explicit forest',async()=>{
    const repository=new FakeAppearance(),service=createAppearanceUseCases(repository),common={expectedVersion:1,key:randomUUID(),reason:'Reviewed portal appearance'};
    await service.updateInstitutionTheme(identity,organizationId,{...common,themeId:'porcelain'});
    expect(repository.lastInstitution?.themeId).toBe('porcelain');
    await service.updateBranchTheme(identity,organizationId,schoolId,{...common,key:randomUUID(),themeId:'forest'});
    expect(repository.lastBranch?.themeId).toBe('forest');
    await service.updateBranchTheme(identity,organizationId,schoolId,{...common,key:randomUUID(),themeId:null});
    expect(repository.lastBranch?.themeId).toBeNull();
    expect(()=>service.updateInstitutionTheme(identity,organizationId,{...common,key:randomUUID(),themeId:'indigo'})).toThrow('VALIDATION');
  });
  it('rejects malformed identity, scope, versions, keys and reasons before persistence',async()=>{
    const service=createAppearanceUseCases(new FakeAppearance()),valid={themeId:'linen',expectedVersion:1,key:randomUUID(),reason:'Reviewed portal appearance'};
    expect(()=>service.getEffectiveTheme(null,organizationId,schoolId)).toThrow('UNAUTHENTICATED');
    expect(()=>service.getAppearanceConfiguration(identity,'bad')).toThrow('NOT_FOUND');
    expect(()=>service.updateInstitutionTheme(identity,organizationId,{...valid,expectedVersion:0})).toThrow('VALIDATION');
    expect(()=>service.updateInstitutionTheme(identity,organizationId,{...valid,key:'bad'})).toThrow('VALIDATION');
    expect(()=>service.updateInstitutionTheme(identity,organizationId,{...valid,reason:'no'})).toThrow('VALIDATION');
  });
});
