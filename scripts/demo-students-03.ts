import {config} from 'dotenv';
import {existsSync,mkdirSync,readFileSync,writeFileSync,chmodSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {createAccessServices} from '../backend/composition/access';
import {createStudentsServices} from '../backend/composition/students';
import {createTenancyServices} from '../backend/composition/tenancy';
import {createAcademicServices} from '../backend/composition/academics';
import {localAccessConfig} from './access-local-config';
config({path:'.env.local',quiet:true});config({quiet:true});
const peoplePath='artifacts/people-02/private-demo.json',academicPath='artifacts/academics-03/private-demo.json',directory='artifacts/students-03',path=`${directory}/private-demo.json`;
type PeopleDemo={adminEmail:string;password:string;organizationId:string;schoolId:string};
type AcademicDemo={yearId?:string;gradeId?:string;sectionId?:string;sectionBId?:string};
type Fixture={createKey:string;enrollKey:string;sectionBKey:string;archiveKey:string;studentId?:string;enrollmentId?:string;sectionBId?:string;archiveStudentId?:string};
let stage='configuration';
function save(value:Fixture){mkdirSync(directory,{recursive:true,mode:0o700});writeFileSync(path,`${JSON.stringify(value,null,2)}\n`,{mode:0o600});chmodSync(path,0o600);}
async function main(){
 const local=localAccessConfig();if(!existsSync(peoplePath)||!existsSync(academicPath))throw new Error('SYNTHETIC_PEOPLE_ACADEMIC_FIXTURES_REQUIRED');
 const people=JSON.parse(readFileSync(peoplePath,'utf8')) as PeopleDemo,academic=JSON.parse(readFileSync(academicPath,'utf8')) as AcademicDemo;if(!academic.yearId||!academic.sectionId||!academic.gradeId)throw new Error('SYNTHETIC_ACADEMIC_SECTIONS_REQUIRED');
 const fixture:Fixture=existsSync(path)?JSON.parse(readFileSync(path,'utf8')) as Fixture:{createKey:randomUUID(),enrollKey:randomUUID(),sectionBKey:randomUUID(),archiveKey:randomUUID()};if(!fixture.sectionBKey)fixture.sectionBKey=randomUUID();if(!fixture.archiveKey)fixture.archiveKey=randomUUID();if(!existsSync(path))save(fixture);
 const access=createAccessServices(local),tenancy=createTenancyServices({databaseUrl:local.databaseUrl,releasedModules:['student_core','academic_core']}),students=createStudentsServices({databaseUrl:local.databaseUrl,releasedModules:['student_core','academic_core']}),academics=createAcademicServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core']});
 try{stage='admin-authentication';const admin=await access.authenticate(people.adminEmail,people.password);if(!admin)throw new Error('SYNTHETIC_ADMIN_UNAVAILABLE');
  stage='student-module-activation';
  const branch=await tenancy.getBranch(admin,people.organizationId,people.schoolId),existing=branch.modules.filter(item=>item.moduleId==='student_core');if(existing.length!==1)throw new Error('SYNTHETIC_STUDENT_MODULE_UNAVAILABLE');if(!existing[0]!.effective){if(existing[0]!.activationState==='ACTIVE')throw new Error('SYNTHETIC_STUDENT_MODULE_NOT_EFFECTIVE');const preview=await tenancy.preview(admin,people.organizationId,people.schoolId,['student_core']);if(preview.blockers.length)throw new Error('SYNTHETIC_STUDENT_ACTIVATION_BLOCKED');await tenancy.confirm(admin,people.organizationId,people.schoolId,{enabled:['student_core'],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason:'Activate synthetic student local demo'});}
  stage='destination-section';if(!academic.sectionBId&&!fixture.sectionBId){const section=await academics.createSection(admin,people.organizationId,people.schoolId,{yearId:academic.yearId,gradeId:academic.gradeId,campusId:null,code:'DEMO-B',name:'Demo Section B',key:fixture.sectionBKey,reason:'Prepare synthetic transfer destination'});fixture.sectionBId=section.id;save(fixture);}else if(!fixture.sectionBId)fixture.sectionBId=academic.sectionBId;save(fixture);
  stage='student-registration';if(!fixture.studentId){const created=await students.create(admin,people.organizationId,people.schoolId,{firstName:'Casey',lastName:'Learner',admissionNumber:'DEMO-STU03-0007',key:fixture.createKey});fixture.studentId=created.studentId;save(fixture);}
  if(!fixture.archiveStudentId){const archived=await students.create(admin,people.organizationId,people.schoolId,{firstName:'Riley',lastName:'Learner',admissionNumber:'DEMO-STU03-ARCHIVE',key:fixture.archiveKey});fixture.archiveStudentId=archived.studentId;save(fixture);}
  stage='student-enrollment';
  if(!fixture.enrollmentId){const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),startsOn=today<'2026-04-01'?'2026-04-01':today<'2027-04-01'?today:'2027-04-01';if(startsOn>='2027-04-01')throw new Error('SYNTHETIC_ACADEMIC_YEAR_CLOSED_FOR_ENROLLMENT');const enrolled=await students.enroll(admin,people.organizationId,people.schoolId,{studentId:fixture.studentId,yearId:academic.yearId,sectionId:academic.sectionId,startsOn,lastDay:'2027-03-31',rollNumber:'0007',key:fixture.enrollKey});fixture.enrollmentId=enrolled.enrollmentId;save(fixture);}
  console.log(`Prepared synthetic enrolled student with a transfer destination. Private fixture: ${path}; administrator credentials: artifacts/people-02/private-demo.json`);
 }finally{await academics.disconnect();await students.disconnect();await tenancy.disconnect();await access.disconnect();}
}
main().catch(error=>{const code=error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'LOCAL_DEMO_ERROR';console.error(`STUDENT_DEMO_SEED_FAILED at ${stage} (${code}); private credentials were not printed.`);process.exitCode=1;});
