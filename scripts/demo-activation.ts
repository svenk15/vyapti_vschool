// Fresh synthetic pending teacher; private token issued through the real CLI.
import { randomBytes,randomUUID } from 'node:crypto';
import { existsSync,readFileSync,mkdirSync,writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createAccessServices } from '../backend/composition/access';
import { localAccessConfig } from './access-local-config';
async function run(){
 const path='artifacts/iam-03/private-demo.json';if(existsSync(path)){console.log('Existing private IAM-03 demo preserved: '+path);return;}
 const config=localAccessConfig(),service=createAccessServices(config),admin=JSON.parse(readFileSync('artifacts/iam-01/private-demo.json','utf8'));
 try{
  const identity=await service.authenticate(admin.email,admin.password);if(!identity)throw new Error('DEMO_ADMIN_UNAVAILABLE');
  const email=`teacher-demo-${randomUUID()}@vschool.example`,member=await service.command(identity,'CreateMembership',{payload:{email,roles:['TEACHER']}},randomUUID(),admin.schoolId);
  const staff=(await service.listMembers(identity,admin.schoolId)).items.find(m=>m.resourceId===member.resourceId);if(!staff)throw new Error('DEMO_STAFF_UNAVAILABLE');
  mkdirSync('artifacts/iam-03',{recursive:true});const activationFile='artifacts/iam-03/private-activation.json';
  const issued=spawnSync(process.execPath,['--import','tsx','scripts/issue-activation.ts','--accountId',staff.accountId,'--membershipIds',member.resourceId,'--caseReference','SYNTHETIC-DEMO','--reason','Synthetic demo identity verified','--output',activationFile],{env:{...process.env,VSCHOOL_DEMO_URL:'http://127.0.0.1:3403'},encoding:'utf8',timeout:20000});
  if(issued.status!==0)throw new Error('DEMO_ISSUE_FAILED');
  writeFileSync(path,JSON.stringify({url:'http://127.0.0.1:3403/activate',email,password:randomBytes(24).toString('base64url'),recoveryPassword:randomBytes(24).toString('base64url'),accountId:staff.accountId,membershipId:member.resourceId,schoolId:admin.schoolId,activationFile},null,2)+'\n',{flag:'wx',mode:0o600});console.log('Synthetic teacher and private activation instructions: '+path);
 }finally{await service.disconnect();}
}
run().catch(()=>{console.error('ACTIVATION_DEMO_FAILED: private credentials were not logged; inspect local configuration.');process.exitCode=1;});
