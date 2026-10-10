import {config} from 'dotenv';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {createAccessServices} from '../backend/composition/access';
import {createPeopleServices} from '../backend/composition/people';
import {createAcademicServices} from '../backend/composition/academics';
import {localAccessConfig} from './access-local-config';
config({path:'.env.local',quiet:true});config({quiet:true});
const peopleFile='artifacts/people-02/private-demo.json',dir='artifacts/academics-03',path=join(dir,'private-demo.json');
type PeopleDemo={adminEmail:string;password:string;organizationId:string;schoolId:string;timezone?:string;employeeIds?:[string,string]};
type Fixture={yearKey:string;gradeKey:string;subjectKey:string;sectionKey:string;publishKey:string;openKey:string;eligibilityKey:string;offeringKey:string;assignmentKey:string;yearId?:string;calendarId?:string;gradeId?:string;subjectId?:string;sectionId?:string;teacherId?:string;offeringId?:string;assignmentId?:string};
function fixture():Fixture{mkdirSync(dir,{recursive:true,mode:0o700});if(existsSync(path))return JSON.parse(readFileSync(path,'utf8')) as Fixture;const v={yearKey:randomUUID(),gradeKey:randomUUID(),subjectKey:randomUUID(),sectionKey:randomUUID(),publishKey:randomUUID(),openKey:randomUUID(),eligibilityKey:randomUUID(),offeringKey:randomUUID(),assignmentKey:randomUUID()};writeFileSync(path,`${JSON.stringify(v,null,2)}\n`,{mode:0o600});return v;}
async function main(){const local=localAccessConfig(),demo=JSON.parse(readFileSync(peopleFile,'utf8')) as PeopleDemo;if(!demo.employeeIds?.[0])throw new Error('PEOPLE_DEMO_NOT_SEEDED');const access=createAccessServices(local);let admin;try{admin=await access.authenticate(demo.adminEmail,demo.password);if(!admin)throw new Error('SYNTHETIC_ADMIN_UNAVAILABLE');}finally{await access.disconnect();}const f=fixture(),calendarAlreadySeeded=Boolean(f.calendarId),people=createPeopleServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core']}),academics=createAcademicServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core']});try{
 const eligibility=await people.enableTeacher(admin!,demo.organizationId,demo.schoolId,demo.employeeIds[0],{expectedVersion:1,key:f.eligibilityKey});if(!eligibility.teacherId)throw new Error('SYNTHETIC_TEACHER_NOT_ENABLED');f.teacherId=eligibility.teacherId;
 const year=await academics.createYear(admin!,demo.organizationId,demo.schoolId,{code:'DEMO26',name:'Synthetic Academic Year 2026–27',startsOn:'2026-04-01',endsOn:'2027-04-01',key:f.yearKey,reason:'Prepare synthetic ACA-03 demo'});f.yearId=year.id;f.calendarId=year.calendarId;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:demo.timezone??'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),weekday=new Date(`${today}T00:00:00.000Z`).getUTCDay()||7,exceptions=calendarAlreadySeeded||weekday<=5?[]:[{date:today,campusId:null,isTeachingDay:true,label:'Synthetic demo teaching day'}];
 const calendar=await academics.publishCalendar(admin!,demo.organizationId,demo.schoolId,year.calendarId,{expectedVersion:1,teachingWeekdays:[1,2,3,4,5],exceptions,key:f.publishKey,reason:'Publish synthetic demo calendar'});
 await academics.transitionYear(admin!,demo.organizationId,demo.schoolId,year.id,{expectedVersion:1,target:'OPEN',key:f.openKey,reason:'Open synthetic demo year'});
 const grade=await academics.createGrade(admin!,demo.organizationId,demo.schoolId,{code:'DEMO8',name:'Grade 8 Demo',key:f.gradeKey,reason:'Prepare synthetic demo grade'});f.gradeId=grade.id;
 const subject=await academics.createSubject(admin!,demo.organizationId,demo.schoolId,{code:'DEMOMATH',name:'Mathematics Demo',key:f.subjectKey,reason:'Prepare synthetic demo subject'});f.subjectId=subject.id;
 const section=await academics.createSection(admin!,demo.organizationId,demo.schoolId,{yearId:year.id,gradeId:grade.id,campusId:null,code:'DEMO-A',name:'Demo Section A',key:f.sectionKey,reason:'Prepare synthetic demo section'});f.sectionId=section.id;
 const offering=await academics.create(admin!,demo.organizationId,demo.schoolId,{yearId:year.id,sectionId:section.id,subjectId:subject.id,code:'DEMO-MATH8A',key:f.offeringKey,reason:'Prepare synthetic demo course offering'});f.offeringId=offering.id;
 const assignment=await academics.assign(admin!,demo.organizationId,demo.schoolId,{offeringId:offering.id,teacherId:eligibility.teacherId,validFrom:'2026-10-05',validTo:'2027-04-01',key:f.assignmentKey,reason:'Prepare synthetic demo teacher assignment'});f.assignmentId=assignment.assignmentId;
 writeFileSync(path,`${JSON.stringify(f,null,2)}\n`,{mode:0o600});console.log(`Prepared synthetic offering, active teacher and date assignment. Private fixture: ${path}; credentials: ${peopleFile}`);void calendar;
 }finally{await people.disconnect();await academics.disconnect();}}
main().catch(e=>{const code=e instanceof Error&&/^[A-Z_]+$/.test(e.message)?e.message:'LOCAL_DEMO_ERROR';console.error(`ACADEMIC_DEMO_SEED_FAILED (${code}); secrets were not printed.`);process.exitCode=1;});
