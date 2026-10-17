import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../generated/prisma/client';
import {createAttendanceServices} from '../backend/composition/attendance';
import {createCoordinationServices} from '../backend/composition/coordination';
import {localAccessConfig} from './access-local-config';

const peoplePath='artifacts/people-02/private-demo.json',directory='artifacts/attendance-pupil-review',path=`${directory}/private-demo.json`;
type People={organizationId:string;schoolId:string;accountId:string};
type Demo={studentId:string;fromDate:string;toDate:string;threshold:number};
const date=(value:Date)=>value.toISOString().slice(0,10);

async function main(){
 const local=localAccessConfig();if(!existsSync(peoplePath))throw new Error('PEOPLE_DEMO_REQUIRED');
 const people=JSON.parse(readFileSync(peoplePath,'utf8')) as People,db=new PrismaClient({adapter:new PrismaPg({connectionString:local.databaseUrl}),log:[]}),attendance=createAttendanceServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core','attendance','staff_core','student_core'],pupilReviewMode:'synthetic'}),coordination=createCoordinationServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core','attendance','staff_core','student_core'],mode:'synthetic'});
 try{
  const outcome=await db.attendanceRecord.findFirst({where:{organizationId:people.organizationId,schoolId:people.schoolId,status:'ABSENT',session:{status:'SUBMITTED'}},include:{session:{select:{schoolDate:true}}},orderBy:{session:{schoolDate:'desc'}}});
  if(!outcome)throw new Error('SYNTHETIC_SUBMITTED_ABSENCE_REQUIRED');
  const toDate=date(outcome.session.schoolDate),from=new Date(`${toDate}T00:00:00.000Z`);from.setUTCDate(from.getUTCDate()-89);const fromDate=date(from);
  await attendance.grant(local.operator,{organizationId:people.organizationId,schoolId:people.schoolId,accountId:people.accountId,studentId:outcome.studentId});
  for(const capability of ['coordination.create','coordination.assign','coordination.work'] as const){const active=await db.coordinationCapabilityGrant.findFirst({where:{organizationId:people.organizationId,schoolId:people.schoolId,accountId:people.accountId,capability,revokedAt:null}});if(!active)await coordination.grant(local.operator,{organizationId:people.organizationId,schoolId:people.schoolId,accountId:people.accountId,capability});}
  const count=await db.attendanceRecord.count({where:{organizationId:people.organizationId,schoolId:people.schoolId,studentId:outcome.studentId,status:'ABSENT',session:{status:'SUBMITTED',schoolDate:{gte:from,lte:new Date(`${toDate}T00:00:00.000Z`)}}}}),demo:Demo={studentId:outcome.studentId,fromDate,toDate,threshold:Math.max(1,Math.min(count,90))};
  mkdirSync(directory,{recursive:true,mode:0o700});writeFileSync(path,JSON.stringify(demo,null,2)+'\n',{mode:0o600});
  console.log(`Named-pupil factual review prepared. Private scenario: ${path}`);
 }finally{await coordination.disconnect();await attendance.disconnect();await db.$disconnect();}
}
main().catch(()=>{console.error('ATTENDANCE_PUPIL_REVIEW_DEMO_UNAVAILABLE');process.exitCode=1;});
