import {randomBytes,randomUUID} from 'node:crypto';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createAccessServices} from '../backend/composition/access';
import {localAccessConfig} from './access-local-config';

const directory='artifacts/appearance-01',path=`${directory}/private-demo.json`;
type Fixture={
 organizationName:string;schoolName:string;schoolCode:string;timezone:string;adminEmail:string;password:string;
 organizationId?:string;inheritedSchoolId?:string;overrideSchoolId?:string;
 institutionGrantKey:string;overrideBranchKey:string;overrideMembershipKey:string;
 firstInstitutionThemeKey:string;restoreInstitutionThemeKey:string;demonstrated?:boolean;
 previewThemes:['porcelain','linen'];
};
function save(value:Fixture){mkdirSync(directory,{recursive:true,mode:0o700});writeFileSync(path,`${JSON.stringify(value,null,2)}\n`,{mode:0o600});}
function load():Fixture{
 if(existsSync(path))return JSON.parse(readFileSync(path,'utf8')) as Fixture;
 const suffix=randomUUID().slice(0,8).toUpperCase(),value:Fixture={organizationName:`Synthetic Appearance Trust ${suffix}`,schoolName:`Forest Inheritance School ${suffix}`,schoolCode:'FOREST',timezone:'Asia/Kolkata',adminEmail:`appearance-${suffix.toLowerCase()}@vschool.example`,password:randomBytes(24).toString('base64url'),institutionGrantKey:randomUUID(),overrideBranchKey:randomUUID(),overrideMembershipKey:randomUUID(),firstInstitutionThemeKey:randomUUID(),restoreInstitutionThemeKey:randomUUID(),previewThemes:['porcelain','linen']};save(value);return value;
}

async function main(){
 const local=localAccessConfig(),service=createAccessServices(local);let fixture=load();
 try{
  let identity=await service.authenticate(fixture.adminEmail,fixture.password);
  if(!identity){
   if(fixture.organizationId){console.log(`Existing appearance credentials were changed; preserved fixture without overwriting: ${path}`);return;}
   const created=await service.provisionSchool({...fixture,themeId:'forest'},local.operator);fixture={...fixture,organizationId:created.organizationId,inheritedSchoolId:created.schoolId};save(fixture);identity=await service.authenticate(fixture.adminEmail,fixture.password);
  }
  if(!identity||!fixture.organizationId||!fixture.inheritedSchoolId)throw new Error('SYNTHETIC_APPEARANCE_IDENTITY_REQUIRED');
  const organizationId=fixture.organizationId,inheritedSchoolId=fixture.inheritedSchoolId;
  const grant=await service.institutionOperation({kind:'SetInstitutionGrant',organizationId,accountId:identity.accountId,status:'ACTIVE',expectedVersion:0,key:fixture.institutionGrantKey,reason:'Synthetic appearance settings authority'},local.operator);
  if(!fixture.overrideSchoolId){
   const branch=await service.createBranch(identity,organizationId,{code:'AMETHYST',name:'Amethyst Override School',timezone:'Asia/Kolkata',themeId:'amethyst',expectedRevision:grant.revision,key:fixture.overrideBranchKey,reason:'Synthetic explicit branch theme'});fixture={...fixture,overrideSchoolId:branch.resourceId};save(fixture);
  }
  const overrideSchoolId=fixture.overrideSchoolId;if(!overrideSchoolId)throw new Error('SYNTHETIC_APPEARANCE_BRANCH_REQUIRED');
  await service.institutionOperation({kind:'SetBranchMembership',organizationId,schoolId:overrideSchoolId,accountId:identity.accountId,status:'ACTIVE',roles:['SCHOOL_ADMIN'],expectedVersion:0,key:fixture.overrideMembershipKey,reason:'Synthetic appearance branch access'},local.operator);
  if(!fixture.demonstrated){
   const institution=await service.getAppearanceConfiguration(identity,organizationId);
   if(institution.selection!=='forest')throw new Error('SYNTHETIC_APPEARANCE_FIXTURE_CHANGED');
   const changed=await service.updateInstitutionTheme(identity,organizationId,{themeId:'linen',expectedVersion:institution.version,key:fixture.firstInstitutionThemeKey,reason:'Verify inheritance without replacing a branch override'});
   const inherited=await service.getEffectiveTheme(identity,organizationId,inheritedSchoolId),override=await service.getEffectiveTheme(identity,organizationId,overrideSchoolId);
   if(inherited.themeId!=='linen'||inherited.source!=='institution'||override.themeId!=='amethyst'||override.source!=='branch')throw new Error('SYNTHETIC_APPEARANCE_RESOLUTION_FAILED');
   await service.updateInstitutionTheme(identity,organizationId,{themeId:'forest',expectedVersion:changed.version,key:fixture.restoreInstitutionThemeKey,reason:'Restore the documented synthetic institution default'});
   fixture={...fixture,demonstrated:true};save(fixture);
  }
  const inherited=await service.getEffectiveTheme(identity,organizationId,inheritedSchoolId),override=await service.getEffectiveTheme(identity,organizationId,overrideSchoolId);
  if(inherited.themeId!=='forest'||inherited.source!=='institution'||override.themeId!=='amethyst'||override.source!=='branch')throw new Error('SYNTHETIC_APPEARANCE_FIXTURE_CHANGED');
  console.log(`Prepared inherited Forest and explicit Amethyst synthetic branches. Preview Porcelain and Linen without saving. Private credentials: ${path}`);
 }finally{await service.disconnect();}
}
main().catch(error=>{const code=error instanceof Error&&/^[A-Z_]+$/.test(error.message)?error.message:'LOCAL_DEMO_ERROR';console.error(`APPEARANCE_DEMO_SEED_FAILED (${code}): private values were not printed.`);process.exitCode=1;});
