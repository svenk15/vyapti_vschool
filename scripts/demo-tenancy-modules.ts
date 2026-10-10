import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
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
 const config=localAccessConfig(),services=createTenancyServices(config),path='artifacts/tenancy-02/private-command.json',interestPath='artifacts/tenancy-02/private-interest.json';
 try{
  // This control-plane fixture is replayed by its verified local operator.
  // It does not depend on a preserved administrator password that IAM-03 may
  // deliberately rotate during recovery demonstrations.
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
  stage='capability-interest';let interest;
  if(existsSync(interestPath))interest=JSON.parse(readFileSync(interestPath,'utf8'));
  else{interest={moduleId:'transport',need:'Evaluate safe route coordination for the next school term.',key:randomUUID()};writeFileSync(interestPath,JSON.stringify(interest,null,2)+'\n',{flag:'wx',mode:0o600});}
  const submitted=await services.submitCapabilityInterest({accountId:user.accountId,tokenVersion:1},tenant.organizationId,tenant.originalBranchId,interest);
  console.log(`Recorded synthetic Transport capability interest${submitted.replayed?' (same-key replay)':''}; no contract or activation changed. Private command: ${interestPath}`);
 }finally{await services.disconnect();}
}

main().catch(error=>{
 const code=error&&typeof error==='object'&&'code'in error&&typeof error.code==='string'?error.code:'LOCAL_DEMO_ERROR';
 console.error(`TENANCY_MODULE_DEMO_FAILED at ${stage} (${code}): verify local config and existing synthetic IAM/TEN demo artifacts.`);
 process.exitCode=1;
});
