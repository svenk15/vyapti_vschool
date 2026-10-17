import {config} from 'dotenv';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {createAccessServices} from '../backend/composition/access';
import {createReportingServices} from '../backend/composition/reporting';
import {localAccessConfig} from './access-local-config';

config({path:'.env.local',quiet:true});config({quiet:true});
const leadershipPath='artifacts/leadership-01/private-demo.json',coordinationPath='artifacts/coordination-01/private-demo.json';
type LeadershipDemo={adminEmail:string;password:string;organizationId:string;schoolId:string;coverageDate?:string;snapshotId?:string;weeklyReviewId?:string};
type CoordinationDemo={organizationId:string;schoolId:string;sourceDate:string;missingRequestId?:string;inProgressRequestId?:string;unassignedRequestId?:string;awaitingRequestId?:string;resolvedRequestId?:string};
const key=(value:string)=>{const hash=createHash('sha256').update(value).digest('hex').slice(0,32);return `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20)}`;};

async function main(){
 if(!existsSync(leadershipPath)||!existsSync(coordinationPath))throw new Error('PRINCIPAL_COORDINATION_DEMO_REQUIRED');
 const local=localAccessConfig(),demo=JSON.parse(readFileSync(leadershipPath,'utf8')) as LeadershipDemo,coordinationDemo=JSON.parse(readFileSync(coordinationPath,'utf8')) as CoordinationDemo;
 if(!demo.coverageDate||!demo.snapshotId||demo.organizationId!==coordinationDemo.organizationId||demo.schoolId!==coordinationDemo.schoolId)throw new Error('PRINCIPAL_WEEKLY_REVIEW_SCOPE_REQUIRED');
 const start=demo.coverageDate<coordinationDemo.sourceDate?demo.coverageDate:coordinationDemo.sourceDate,end=demo.coverageDate>coordinationDemo.sourceDate?demo.coverageDate:coordinationDemo.sourceDate;
 const access=createAccessServices(local),reporting=createReportingServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core','attendance','staff_core','student_core'],snapshotMode:'synthetic'});
 try{
  const identity=await access.authenticate(demo.adminEmail,demo.password);if(!identity)throw new Error('SYNTHETIC_ACCOUNT_UNAVAILABLE');
  const actionRequestIds=[coordinationDemo.missingRequestId,coordinationDemo.inProgressRequestId,coordinationDemo.unassignedRequestId,coordinationDemo.awaitingRequestId,coordinationDemo.resolvedRequestId].filter((value,index,all):value is string=>Boolean(value)&&all.indexOf(value)===index),options=await reporting.leadershipReviewOptions(identity,demo.organizationId,demo.schoolId,{periodStart:start,periodEnd:end});
  if(options.status!=='AVAILABLE'||actionRequestIds.length<3)throw new Error('PRINCIPAL_WEEKLY_REVIEW_ACTIONS_REQUIRED');
  await reporting.grantBriefCapability(local.operator,{organizationId:demo.organizationId,accountId:identity.accountId,capability:'GENERATE'});await reporting.grantBriefCapability(local.operator,{organizationId:demo.organizationId,accountId:identity.accountId,capability:'SHARE'});
  const created=await reporting.createBrief(identity,demo.organizationId,demo.schoolId,{kind:'WEEKLY_REVIEW',title:'Weekly leadership review',purpose:'Review fictional source-backed school operations and carry forward owned follow-ups.',interpretation:'Attendance evidence and current Coordination states have been reviewed for the selected school week.',nextActions:'Open each owned follow-up through Coordination; saving this review does not change its status.',periodStart:start,periodEnd:end,timezone:options.timezone,snapshotIds:[demo.snapshotId],actionRequestIds,recipientAccountIds:[identity.accountId],key:key(`principal-weekly-review:${demo.organizationId}:${start}:${end}`)}),finalized=await reporting.finalizeBrief(identity,demo.organizationId,demo.schoolId,created.briefId,{expectedVersion:created.version,key:key(`principal-weekly-finalize:${demo.organizationId}:${start}:${end}`)}),shared=await reporting.shareBrief(identity,demo.organizationId,demo.schoolId,created.briefId,{expectedVersion:finalized.version,key:key(`principal-weekly-share:${demo.organizationId}:${start}:${end}`)});
  if(shared.state!=='FINALIZED')throw new Error('PRINCIPAL_WEEKLY_REVIEW_REQUIRED');demo.weeklyReviewId=created.briefId;writeFileSync(leadershipPath,`${JSON.stringify(demo,null,2)}\n`,{mode:0o600});console.log(`Prepared or preserved the source-backed weekly leadership review. Private scenario: ${leadershipPath}`);
 }finally{await reporting.disconnect();await access.disconnect();}
}
main().catch(error=>{console.error(error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'PRINCIPAL_WEEKLY_REVIEW_DEMO_ERROR');process.exitCode=1;});
