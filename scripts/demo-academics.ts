import {config} from 'dotenv';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../backend/composition/access';
import {createTenancyServices} from '../backend/composition/tenancy';
import {localAccessConfig} from './access-local-config';
config({path:'.env.local',quiet:true});config({quiet:true});
const path='artifacts/academics-01/private-command.json';
type Command=Readonly<{startsAt:string;entitlementKey:string;activationKey:string}>;
async function main(){
 const local=localAccessConfig(),demo=JSON.parse(readFileSync('artifacts/iam-01/private-demo.json','utf8')) as {email:string;password:string;organizationId:string;schoolId:string};
 const authServices=createAccessServices(local),identity=await authServices.authenticate(demo.email,demo.password);await authServices.disconnect();if(!identity)throw new Error('SYNTHETIC_DEMO_ACCOUNT_REQUIRED');
 const service=createTenancyServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core']}),db=new PrismaClient({adapter:new PrismaPg({connectionString:local.databaseUrl,connectionTimeoutMillis:5000,max:3}),log:[]});let command:Command;
 if(existsSync(path))command=JSON.parse(readFileSync(path,'utf8')) as Command;else{command={startsAt:new Date().toISOString(),entitlementKey:randomUUID(),activationKey:randomUUID()};mkdirSync('artifacts/academics-01',{recursive:true,mode:0o700});writeFileSync(path,JSON.stringify(command,null,2)+'\n',{flag:'wx',mode:0o600});}
 try{
  const current=await service.getBranch(identity,demo.organizationId,demo.schoolId),item=current.modules.find(module=>module.moduleId==='academic_core');if(!item)throw new Error('ACADEMIC_MODULE_MISSING');
  const entitlement=await db.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId:demo.organizationId,moduleId:'academic_core'}},select:{state:true,startsAt:true,endsAt:true,version:true}}),now=new Date();
  const active=!!entitlement&&entitlement.state==='ACTIVE'&&entitlement.startsAt<=now&&(!entitlement.endsAt||entitlement.endsAt>now);
  if(!active)await service.setEntitlement(local.operator,{kind:'SetOrganizationEntitlement',organizationId:demo.organizationId,actorAccountId:identity.accountId,moduleId:'academic_core',state:'ACTIVE',startsAt:command.startsAt,endsAt:null,expectedVersion:entitlement?.version??0,manifestVersion:1,limits:{},key:command.entitlementKey,reason:'Synthetic ACA-01 local demo entitlement'});
  const branch=await service.getBranch(identity,demo.organizationId,demo.schoolId),enabled=branch.modules.find(module=>module.moduleId==='academic_core')?.activationState==='ACTIVE';
  if(!enabled){const preview=await service.preview(identity,demo.organizationId,demo.schoolId,['academic_core']);if(preview.blockers.length)throw new Error(preview.blockers.map(blocker=>blocker.code).join(','));await service.confirm(identity,demo.organizationId,demo.schoolId,{enabled:['academic_core'],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:command.activationKey,reason:'Activate synthetic ACA-01 local demo'});}
  console.log('Academic structure is enabled for the existing synthetic local branch. The default server release manifest is unchanged.');
 }finally{await db.$disconnect();await service.disconnect();}
}
main().catch(error=>{const code=error&&typeof error==='object'&&'code'in error&&typeof error.code==='string'?error.code:'LOCAL_DEMO_ERROR';console.error(`ACADEMIC_DEMO_FAILED (${code}): confirm the existing synthetic IAM/TEN artifacts and local development database.`);process.exitCode=1;});
