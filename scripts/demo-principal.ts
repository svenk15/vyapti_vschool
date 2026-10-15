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
type Demo=People&{grantKey:string};

async function main(){
 const local=localAccessConfig();if(!existsSync(peoplePath))throw new Error('PEOPLE_DEMO_REQUIRED');
 const people=JSON.parse(readFileSync(peoplePath,'utf8')) as People;
 let demo:Demo=existsSync(privatePath)?JSON.parse(readFileSync(privatePath,'utf8')) as Demo:{...people,grantKey:randomUUID()};
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:local.databaseUrl}),log:[]}),access=createAccessServices(local);
 try{
  const identity=await access.authenticate(people.adminEmail,people.password);if(!identity)throw new Error('SYNTHETIC_ACCOUNT_UNAVAILABLE');
  const membership=await db.schoolMembership.findFirstOrThrow({where:{id:people.membershipId,organizationId:people.organizationId,schoolId:people.schoolId,accountId:people.accountId},include:{grants:{select:{code:true}}}});
  const roles:RoleCode[]=membership.grants.flatMap(grant=>grant.code==='SCHOOL_ADMIN'||grant.code==='TEACHER'||grant.code==='PRINCIPAL'?[grant.code]:[]);
  if(!roles.includes('PRINCIPAL')){const desired:RoleCode[]=[...roles,'PRINCIPAL'];desired.sort();await access.institutionOperation({kind:'SetBranchMembership',organizationId:people.organizationId,schoolId:people.schoolId,accountId:people.accountId,status:'ACTIVE',roles:desired,expectedVersion:membership.version,key:demo.grantKey,reason:'Authorize fictional branch Principal workspace'},local.operator);}
  const home=await access.getLeadershipHome(identity,people.schoolId);if(home.scope.schoolId!==people.schoolId)throw new Error('SYNTHETIC_PRINCIPAL_SCOPE_MISMATCH');
  demo={...demo,...people};mkdirSync(directory,{recursive:true,mode:0o700});writeFileSync(privatePath,`${JSON.stringify(demo,null,2)}\n`,{mode:0o600});
  console.log(`Prepared or preserved explicit branch Principal access. Private credentials: ${privatePath}`);
 }finally{await access.disconnect();await db.$disconnect();}
}

main().catch(error=>{console.error(error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'PRINCIPAL_DEMO_ERROR');process.exitCode=1;});
