import {config} from 'dotenv';
import {chmodSync,existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../backend/composition/access';
import {createImportsServices} from '../backend/composition/imports';
import {createReportingServices} from '../backend/composition/reporting';
import {localAccessConfig} from './access-local-config';
import {schoolDate} from '../backend/modules/attendance/domain/schedule';

config({path:'.env.local',quiet:true});config({quiet:true});
const directory='artifacts/dashboard-01',fixturePath=`${directory}/private-demo.json`,peoplePath='artifacts/people-02/private-demo.json',academicsPath='artifacts/academics-03/private-demo.json';
const released=['academic_core','attendance','staff_core','student_core'] as const;
type PeopleFixture={adminEmail:string;password:string;organizationId:string;schoolId:string;timezone:string};
type AcademicsFixture={yearId:string;gradeId:string;sectionId:string};
type DashboardImportFixture={key:string;jobId?:string};
type DashboardFixture={importKey?:string;importJobId?:string;seededSchoolDate?:string;importsByDate?:Record<string,DashboardImportFixture>};
function loadFixture():DashboardFixture{mkdirSync(directory,{recursive:true,mode:0o700});if(existsSync(fixturePath))return JSON.parse(readFileSync(fixturePath,'utf8')) as DashboardFixture;const value={importsByDate:{}};save(value);return value;}
function save(value:DashboardFixture){writeFileSync(fixturePath,`${JSON.stringify(value,null,2)}\n`,{mode:0o600});chmodSync(fixturePath,0o600);}
async function main(){
 const local=localAccessConfig(),people=JSON.parse(readFileSync(peoplePath,'utf8')) as PeopleFixture,academics=JSON.parse(readFileSync(academicsPath,'utf8')) as AcademicsFixture,demo=loadFixture();
 const access=createAccessServices(local),identity=await access.authenticate(people.adminEmail,people.password);if(!identity)throw new Error('SYNTHETIC_ADMIN_UNAVAILABLE');
 const database=new PrismaClient({adapter:new PrismaPg({connectionString:local.databaseUrl,connectionTimeoutMillis:5000,max:3}),log:[]}),imports=createImportsServices({databaseUrl:local.databaseUrl,releasedModules:released,cursorSecret:process.env.NEXTAUTH_SECRET??''}),reporting=createReportingServices({databaseUrl:local.databaseUrl,releasedModules:released});
 try{
  const [year,grade,section]=await Promise.all([
   database.academicYear.findFirstOrThrow({where:{id:academics.yearId,organizationId:people.organizationId,schoolId:people.schoolId},select:{startsOn:true,endsOn:true}}),
   database.gradeLevel.findFirstOrThrow({where:{id:academics.gradeId,organizationId:people.organizationId,schoolId:people.schoolId},select:{code:true}}),
   database.section.findFirstOrThrow({where:{id:academics.sectionId,organizationId:people.organizationId,schoolId:people.schoolId},select:{code:true}}),
  ]),today=schoolDate(new Date(),people.timezone),admittedOn=year.startsOn.toISOString().slice(0,10),validFrom=today>=admittedOn&&today<year.endsOn.toISOString().slice(0,10)?today:admittedOn;
  demo.importsByDate??={};
  if(demo.importKey&&demo.seededSchoolDate&&!demo.importsByDate[demo.seededSchoolDate])demo.importsByDate[demo.seededSchoolDate]={key:demo.importKey,...(demo.importJobId?{jobId:demo.importJobId}:{})};
  const current=demo.importsByDate[today]??={key:randomUUID()};demo.importsByDate[today]=current;save(demo);
  const source=new TextEncoder().encode(`external_student_id,student_first_name,admission_number,admitted_on,grade,section,student_last_name,roll_number\nDASHBOARD-REVIEW-${today},Noor,DASH-${today.replaceAll('-','')},${admittedOn},${grade.code},${section.code},Example,\n`);
  const preview=await imports.preview(identity,people.organizationId,people.schoolId,{yearId:academics.yearId,campusId:null,namespace:'DASHBOARD-DEMO',validFrom,schemaVersion:'STUDENT_ROSTER_V1',fileName:`dashboard-review-${today}.csv`,idempotencyKey:current.key,sourceBytes:source});
  current.jobId=preview.jobId;demo.importJobId=preview.jobId;demo.seededSchoolDate=today;save(demo);
  const overview=await reporting.schoolAdminOverview(identity,people.organizationId,people.schoolId);
  if(!overview?.exceptions.some(item=>item.id==='imports'&&item.href.includes(preview.jobId)))throw new Error('SYNTHETIC_DASHBOARD_IMPORT_LINK_REQUIRED');
  console.log(`Prepared a review-state roster import and verified its scoped dashboard link for ${today}. Private fixture: ${fixturePath}`);
 }finally{await reporting.disconnect();await imports.disconnect();await database.$disconnect();await access.disconnect();}
}
main().catch(error=>{const code=error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'LOCAL_DEMO_ERROR';console.error(`DASHBOARD_DEMO_SEED_FAILED (${code}): private credentials and source rows were not printed.`);process.exitCode=1;});
