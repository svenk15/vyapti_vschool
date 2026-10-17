import {config} from 'dotenv';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../generated/prisma/client';
import {createAccessServices} from '../backend/composition/access';
import {localAccessConfig} from './access-local-config';
import type {RoleCode} from '../shared/contracts/access';

config({path:'.env.local',quiet:true});config({quiet:true});
const directory='artifacts/leadership-01',privatePath=`${directory}/private-demo.json`,peoplePath='artifacts/people-02/private-demo.json';
type People={adminEmail:string;password:string;organizationId:string;schoolId:string;accountId:string;membershipId:string};
type Demo=People&{grantKey:string;supportKey?:string;preferenceKey?:string};

async function main(){
 let stage='configuration';
 const local=localAccessConfig();if(!existsSync(peoplePath))throw new Error('PEOPLE_DEMO_REQUIRED');
 const people=JSON.parse(readFileSync(peoplePath,'utf8')) as People;
 let demo:Demo=existsSync(privatePath)?JSON.parse(readFileSync(privatePath,'utf8')) as Demo:{...people,grantKey:randomUUID()};
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:local.databaseUrl}),log:[]}),access=createAccessServices(local);
 try{
  stage='authentication';
  const identity=await access.authenticate(people.adminEmail,people.password);if(!identity)throw new Error('SYNTHETIC_ACCOUNT_UNAVAILABLE');
  stage='membership';
  const membership=await db.schoolMembership.findFirstOrThrow({where:{id:people.membershipId,organizationId:people.organizationId,schoolId:people.schoolId,accountId:people.accountId},include:{grants:{select:{code:true}}}});
  const roles:RoleCode[]=membership.grants.flatMap(grant=>grant.code==='SCHOOL_ADMIN'||grant.code==='TEACHER'||grant.code==='PRINCIPAL'?[grant.code]:[]);
  if(!roles.includes('PRINCIPAL')){const desired:RoleCode[]=[...roles,'PRINCIPAL'];desired.sort();await access.institutionOperation({kind:'SetBranchMembership',organizationId:people.organizationId,schoolId:people.schoolId,accountId:people.accountId,status:'ACTIVE',roles:desired,expectedVersion:membership.version,key:demo.grantKey,reason:'Authorize fictional branch Principal workspace'},local.operator);}
  stage='support-read';const settings=await access.getSettings(identity,people.schoolId);
  stage='support-publish';
  if(!settings.support){demo.supportKey??=randomUUID();await access.command(identity,'PublishSchoolSupport',{payload:{label:'Riverbank school office',email:'support@riverbank.example',phone:'',hours:'Weekdays 08:00–16:00',reason:'Publish fictional support route for the connected Principal demo'},expectedVersion:settings.version},demo.supportKey,people.schoolId);}
  stage='preference-read';const preferences=await access.getOwnPreferences(identity);
  stage='preference-write';
  if(preferences.versions.density===0&&preferences.versions.reducedMotion===0){demo.preferenceKey??=randomUUID();await access.updateOwnPreferences(identity,{density:'COMFORTABLE',reducedMotion:'SYSTEM',expectedVersions:preferences.versions},demo.preferenceKey);}
  stage='leadership-read';
  const home=await access.getLeadershipHome(identity,people.schoolId);if(home.scope.schoolId!==people.schoolId)throw new Error('SYNTHETIC_PRINCIPAL_SCOPE_MISMATCH');
  demo={...demo,...people};mkdirSync(directory,{recursive:true,mode:0o700});writeFileSync(privatePath,`${JSON.stringify(demo,null,2)}\n`,{mode:0o600});
  console.log(`Prepared or preserved explicit branch Principal access. Private credentials: ${privatePath}`);
 }catch(error){const code=error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'FAILED';throw new Error(`PRINCIPAL_DEMO_${stage.toUpperCase().replaceAll('-','_')}_${code}`);}finally{await access.disconnect();await db.$disconnect();}
}

main().catch(error=>{console.error(error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'PRINCIPAL_DEMO_ERROR');process.exitCode=1;});
