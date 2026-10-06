import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {createAccessServices} from '../backend/composition/access';
import {createTenancyServices} from '../backend/composition/tenancy';
import {localAccessConfig} from './access-local-config';
import {uuidPattern} from '../backend/modules/access/domain/policy';

let stage='configuration';

async function main(){
 stage='profile';
 const tenant=JSON.parse(readFileSync('artifacts/tenancy-01/private-demo.json','utf8')) as {organizationId:string;originalBranchId?:string};
 const user=JSON.parse(readFileSync('artifacts/iam-01/private-demo.json','utf8')) as {accountId:string;email:string;password:string};
 if(!uuidPattern.test(tenant.organizationId)||!uuidPattern.test(user.accountId)||!tenant.originalBranchId||!uuidPattern.test(tenant.originalBranchId)||typeof user.email!=='string'||typeof user.password!=='string')throw new Error('SYNTHETIC_PROFILE_REQUIRED');
 stage='local-connection';
 const config=localAccessConfig(),access=createAccessServices({databaseUrl:config.databaseUrl}),services=createTenancyServices(config),path='artifacts/tenancy-02/private-command.json';
 try{
  // Account recovery increments tokenVersion. Authenticate the preserved
  // local credential instead of assuming its original session version.
  stage='current-identity';
  const identity=await access.authenticate(user.email,user.password);
  if(!identity||identity.accountId!==user.accountId)throw new Error('SYNTHETIC_ADMIN_AUTHENTICATION_REQUIRED');
  stage='current-branch-read';
  const existing=await services.getBranch(identity,tenant.organizationId,tenant.originalBranchId),contract=existing.modules.find(item=>item.moduleId==='attendance');
  if(contract?.licensedState){console.log(`Existing Attendance contract preserved (state ${contract.licensedState}); no entitlement was overwritten.`);return;}
  stage='command-load';
  let command;
  if(existsSync(path))command=JSON.parse(readFileSync(path,'utf8'));
  else{
   command={kind:'SetOrganizationEntitlement',organizationId:tenant.organizationId,actorAccountId:user.accountId,moduleId:'attendance',state:'ACTIVE',startsAt:new Date().toISOString(),endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:'Synthetic TEN-02 Attendance contract preview'};
   mkdirSync('artifacts/tenancy-02',{recursive:true,mode:0o700});
   writeFileSync(path,JSON.stringify(command,null,2)+'\n',{flag:'wx',mode:0o600});
  }
  stage='set-entitlement';
  const result=await services.setEntitlement(config.operator,command);
  console.log(`Recorded a synthetic Attendance contract${result.replayed?' (same-key replay)':''}. Current release remains unavailable; no branch was activated. Revision ${result.revision}.`);
 }finally{await Promise.all([access.disconnect(),services.disconnect()]);}
}

main().catch(error=>{
 const code=error&&typeof error==='object'&&'code'in error&&typeof error.code==='string'?error.code:'LOCAL_DEMO_ERROR';
 console.error(`TENANCY_MODULE_DEMO_FAILED at ${stage} (${code}): verify local config and existing synthetic IAM/TEN demo artifacts.`);
 process.exitCode=1;
});
