import { existsSync,mkdirSync,readFileSync,writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { createAccessServices } from '../backend/composition/access';
import { localAccessConfig } from './access-local-config';
import { uuidPattern } from '../backend/modules/access/domain/policy';
async function run(){const output='artifacts/tenancy-01/private-demo.json';if(existsSync(output)){console.log(`Existing private tenancy demo preserved: ${output}`);return;}
 const profile=JSON.parse(readFileSync('artifacts/iam-01/private-demo.json','utf8'));if(!uuidPattern.test(profile.accountId)||!uuidPattern.test(profile.organizationId)||!uuidPattern.test(profile.schoolId))throw new Error('SYNTHETIC_PROFILE_REQUIRED');
 const operator=localAccessConfig(),service=createAccessServices(operator),key=()=>randomUUID(),suffix=randomUUID().slice(0,8).toUpperCase(),secondOrganizationId=randomUUID();
 try{
  const grant=await service.institutionOperation({kind:'SetInstitutionGrant',organizationId:profile.organizationId,accountId:profile.accountId,status:'ACTIVE',expectedVersion:0,key:key(),reason:'Synthetic TEN-01 verified institution authority'},operator.operator);
  const primary=await service.createBranch({accountId:profile.accountId,tokenVersion:1},profile.organizationId,{code:`TEN_${suffix}`,name:`Synthetic TEN branch ${suffix}`,timezone:'Asia/Kolkata',expectedRevision:grant.revision,key:key(),reason:'Synthetic TEN-01 context switch branch'});
  const attached=await service.institutionOperation({kind:'SetBranchMembership',organizationId:profile.organizationId,schoolId:primary.resourceId,accountId:profile.accountId,status:'ACTIVE',roles:['SCHOOL_ADMIN'],expectedVersion:0,key:key(),reason:'Synthetic TEN-01 reviewed branch membership'},operator.operator);
  const separate=await service.institutionOperation({kind:'CreateInstitution',organizationId:secondOrganizationId,accountId:profile.accountId,name:`Synthetic TEN institution ${suffix}`,key:key(),reason:'Synthetic TEN-01 second institution'},operator.operator);
  const dir=await service.getContexts({accountId:profile.accountId,tokenVersion:1}),institution=dir.institutions.find(i=>i.id===profile.organizationId)!;if(!institution?.branches.some(b=>b.id===profile.schoolId&&b.selectable)||!institution.branches.some(b=>b.id===primary.resourceId&&b.selectable))throw new Error('DEMO_CONTEXT_CHECK_FAILED');
  mkdirSync('artifacts/tenancy-01',{recursive:true,mode:0o700});writeFileSync(output,JSON.stringify({url:'http://127.0.0.1:3404',organizationId:profile.organizationId,originalBranchId:profile.schoolId,secondBranchId:primary.resourceId,secondMembershipId:attached.resourceId,otherInstitutionId:separate.organizationId},null,2)+'\n',{flag:'wx',mode:0o600});console.log(`Prepared two-institution, multi-branch synthetic demo. Read IDs locally: ${output}`);
 }finally{await service.disconnect();}
}
run().catch(()=>{console.error('TENANCY_DEMO_FAILED: verify local configuration and the existing synthetic IAM-01 account.');process.exitCode=1;});
