import {config} from 'dotenv';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {createAccessServices} from '../backend/composition/access';
import {createAttendanceServices} from '../backend/composition/attendance';
import {localAccessConfig} from './access-local-config';

config({path:'.env.local',quiet:true});config({quiet:true});
const path='artifacts/leadership-01/private-demo.json';
type Demo={adminEmail:string;password:string;organizationId:string;schoolId:string;coverageDate?:string;coverageCounts?:{scheduled:number;due:number;received:number;awaiting:number;notDue:number;cancelled:number}};

async function main(){
 const local=localAccessConfig();if(!existsSync(path))throw new Error('PRINCIPAL_DEMO_REQUIRED');const demo=JSON.parse(readFileSync(path,'utf8')) as Demo,access=createAccessServices(local),attendance=createAttendanceServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core','attendance','staff_core','student_core']});
 try{const identity=await access.authenticate(demo.adminEmail,demo.password);if(!identity)throw new Error('SYNTHETIC_ACCOUNT_UNAVAILABLE');const coverage=await attendance.get(identity,demo.organizationId,demo.schoolId,{});if(coverage.counts.awaiting<1||coverage.counts.received<1||coverage.counts.notDue<1)throw new Error('PRINCIPAL_ATTENDANCE_SCENARIO_REQUIRED');demo.coverageDate=coverage.schoolDate;demo.coverageCounts=coverage.counts;writeFileSync(path,`${JSON.stringify(demo,null,2)}\n`,{mode:0o600});console.log(`Verified and preserved the connected Principal Attendance scenario. Private credentials and date: ${path}`);}finally{await attendance.disconnect();await access.disconnect();}
}
main().catch(error=>{console.error(error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'PRINCIPAL_ATTENDANCE_DEMO_ERROR');process.exitCode=1;});
