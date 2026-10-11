import {config} from 'dotenv';
import {chmodSync,existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../backend/composition/access';
import {createTenancyServices} from '../backend/composition/tenancy';
import {localAccessConfig} from './access-local-config';
import type {ModuleId} from '../shared/contracts/modules';

config({path:'.env.local',quiet:true});config({quiet:true});
const directory='artifacts/admissions-01',fixturePath=`${directory}/private-demo.json`,peoplePath='artifacts/people-02/private-demo.json',academicsPath='artifacts/academics-03/private-demo.json';
const released=['academic_core','admissions','attendance','staff_core','student_core'] as const;
type PeopleFixture={adminEmail:string;password:string;accountId:string;organizationId:string;schoolId:string};
type AcademicsFixture={gradeId:string};
type Fixture={cycleId:string;entitlementKey:string;activationKey:string;startsAt:string};
function fixture():Fixture{mkdirSync(directory,{recursive:true,mode:0o700});if(existsSync(fixturePath))return JSON.parse(readFileSync(fixturePath,'utf8')) as Fixture;const value={cycleId:randomUUID(),entitlementKey:randomUUID(),activationKey:randomUUID(),startsAt:new Date().toISOString()};writeFileSync(fixturePath,`${JSON.stringify(value,null,2)}\n`,{flag:'wx',mode:0o600});chmodSync(fixturePath,0o600);return value;}

async function main(){
 const local=localAccessConfig(),people=JSON.parse(readFileSync(peoplePath,'utf8')) as PeopleFixture,academics=JSON.parse(readFileSync(academicsPath,'utf8')) as AcademicsFixture,seed=fixture(),access=createAccessServices(local),identity=await access.authenticate(people.adminEmail,people.password);
 if(!identity||identity.accountId!==people.accountId)throw new Error('SYNTHETIC_ADMIN_UNAVAILABLE');
 const tenancy=createTenancyServices({databaseUrl:local.databaseUrl,releasedModules:released}),db=new PrismaClient({adapter:new PrismaPg({connectionString:local.databaseUrl,connectionTimeoutMillis:5000,max:3}),log:[]});
 try{
  const entitlement=await db.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId:people.organizationId,moduleId:'admissions'}}});
  if(!entitlement)await tenancy.setEntitlement(local.operator,{kind:'SetOrganizationEntitlement',organizationId:people.organizationId,actorAccountId:identity.accountId,moduleId:'admissions',state:'ACTIVE',startsAt:seed.startsAt,endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:seed.entitlementKey,reason:'Enable the implemented synthetic Admissions demo'});
  else if(entitlement.state!=='ACTIVE'||entitlement.startsAt>new Date()||(entitlement.endsAt&&entitlement.endsAt<=new Date()))throw new Error('EXISTING_ADMISSIONS_ENTITLEMENT_PRESERVED');
  const current=await tenancy.getBranch(identity,people.organizationId,people.schoolId),admission=current.modules.find(item=>item.moduleId==='admissions');
  if(admission?.activationState!=='ACTIVE'){
   const enabled=current.modules.filter(item=>item.activationState==='ACTIVE'&&!['student_core','academic_core','staff_core'].includes(item.moduleId)).map(item=>item.moduleId),selected=[...new Set<ModuleId>([...enabled,'admissions'])],preview=await tenancy.preview(identity,people.organizationId,people.schoolId,selected);
   if(preview.blockers.length)throw new Error('ADMISSIONS_ACTIVATION_BLOCKED');
   await tenancy.confirm(identity,people.organizationId,people.schoolId,{enabled:selected,expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:seed.activationKey,reason:'Activate the implemented synthetic Admissions demo'});
  }
  const grade=await db.gradeLevel.findFirstOrThrow({where:{id:academics.gradeId,organizationId:people.organizationId,schoolId:people.schoolId,active:true},select:{id:true}}),existing=await db.admissionCycle.findUnique({where:{id:seed.cycleId}});
  if(!existing)await db.admissionCycle.create({data:{id:seed.cycleId,organizationId:people.organizationId,schoolId:people.schoolId,code:'DEMO-2027',name:'2027–28',opensOn:new Date('2026-10-01T00:00:00.000Z'),closesOn:new Date('2027-03-31T00:00:00.000Z'),state:'OPEN',version:1}});
  else if(existing.organizationId!==people.organizationId||existing.schoolId!==people.schoolId)throw new Error('SYNTHETIC_CYCLE_SCOPE_MISMATCH');
  void grade;
  console.log(`Prepared the fictional Admissions intake without replacing existing records. Private fixture: ${fixturePath}`);
 }finally{await db.$disconnect();await tenancy.disconnect();await access.disconnect();}
}
main().catch(error=>{const code=error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'LOCAL_DEMO_ERROR';console.error(`ADMISSIONS_DEMO_SEED_FAILED (${code}): credentials and applicant data were not printed.`);process.exitCode=1;});
