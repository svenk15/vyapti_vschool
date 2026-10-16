import {config} from 'dotenv';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {createAccessServices} from '../backend/composition/access';
import {createAttendanceServices} from '../backend/composition/attendance';
import {createReportingServices} from '../backend/composition/reporting';
import {localAccessConfig} from './access-local-config';

config({path:'.env.local',quiet:true});config({quiet:true});
const path='artifacts/leadership-01/private-demo.json';
type Demo={adminEmail:string;password:string;organizationId:string;schoolId:string;coverageDate?:string;coverageCounts?:{scheduled:number;due:number;received:number;awaiting:number;notDue:number;cancelled:number}};

async function main(){
 const local=localAccessConfig();if(!existsSync(path))throw new Error('PRINCIPAL_DEMO_REQUIRED');const demo=JSON.parse(readFileSync(path,'utf8')) as Demo,access=createAccessServices(local),released=['academic_core','attendance','staff_core','student_core'] as const,attendance=createAttendanceServices({databaseUrl:local.databaseUrl,releasedModules:released}),reporting=createReportingServices({databaseUrl:local.databaseUrl,releasedModules:released});
 try{const identity=await access.authenticate(demo.adminEmail,demo.password);if(!identity)throw new Error('SYNTHETIC_ACCOUNT_UNAVAILABLE');const coverage=await attendance.get(identity,demo.organizationId,demo.schoolId,{});if(coverage.counts.awaiting<1||coverage.counts.received<1||coverage.counts.notDue<1)throw new Error('PRINCIPAL_ATTENDANCE_SCENARIO_REQUIRED');await reporting.grantExporter(local.operator,{organizationId:demo.organizationId,schoolId:demo.schoolId,accountId:identity.accountId});const exported=await reporting.exportLeadershipAttendance(identity,demo.organizationId,demo.schoolId,{date:coverage.schoolDate});if(!exported.csv.includes('"SUMMARY","register-coverage.v1"')||exported.rowCount!==coverage.awaiting.total+1)throw new Error('PRINCIPAL_REPORT_EXPORT_REQUIRED');demo.coverageDate=coverage.schoolDate;demo.coverageCounts=coverage.counts;writeFileSync(path,`${JSON.stringify(demo,null,2)}\n`,{mode:0o600});console.log(`Verified and preserved the connected Principal Attendance/export scenario. Private credentials and date: ${path}`);}finally{await reporting.disconnect();await attendance.disconnect();await access.disconnect();}
}
main().catch(error=>{console.error(error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'PRINCIPAL_ATTENDANCE_DEMO_ERROR');process.exitCode=1;});
