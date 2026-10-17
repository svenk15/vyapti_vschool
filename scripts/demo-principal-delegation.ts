import {config} from 'dotenv';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {createAccessServices} from '../backend/composition/access';
import {localAccessConfig} from './access-local-config';

config({path:'.env.local',quiet:true});config({quiet:true});
const peoplePath='artifacts/people-02/private-demo.json',leadershipPath='artifacts/leadership-01/private-demo.json';
type People={teacherEmail:string;teacherPassword:string;organizationId:string;schoolId:string;employeeIds:[string,string]};
type Leadership=Record<string,unknown>&{delegationId?:string;delegationIssueKey?:string;delegationStartsAt?:string;delegationEndsAt?:string};

async function main(){
  const local=localAccessConfig();
  if(!existsSync(peoplePath)||!existsSync(leadershipPath))throw new Error('SYNTHETIC_PRINCIPAL_FIXTURE_REQUIRED');
  const people=JSON.parse(readFileSync(peoplePath,'utf8')) as People;
  const leadership=JSON.parse(readFileSync(leadershipPath,'utf8')) as Leadership;
  if(!people.employeeIds?.[0])throw new Error('SYNTHETIC_EMPLOYEE_REQUIRED');
  const access=createAccessServices(local);
  try{
    const identity=await access.authenticate(people.teacherEmail,people.teacherPassword);if(!identity)throw new Error('SYNTHETIC_TEACHER_UNAVAILABLE');
    const active=(await access.listOwnDelegations(identity)).find(item=>item.schoolId===people.schoolId&&item.status==='ACTIVE');
    if(active){leadership.delegationId=active.delegationId;leadership.delegationStartsAt=active.startsAt;leadership.delegationEndsAt=active.endsAt;}
    else{
      const startsAt=new Date(),endsAt=new Date(startsAt.getTime()+7*24*60*60*1000),key=randomUUID();
      const result=await access.issueDelegation(local.operator,{organizationId:people.organizationId,schoolId:people.schoolId,employeeId:people.employeeIds[0],actions:['leadership.read','communication.read_leadership'],startsAt:startsAt.toISOString(),endsAt:endsAt.toISOString(),reason:'Synthetic acting Principal demonstration',key});
      leadership.delegationId=result.delegationId;leadership.delegationIssueKey=key;leadership.delegationStartsAt=result.startsAt;leadership.delegationEndsAt=result.endsAt;
    }
    writeFileSync(leadershipPath,`${JSON.stringify(leadership,null,2)}\n`,{mode:0o600});
    console.log(`Prepared or preserved synthetic acting Principal access. Private credentials: ${leadershipPath}`);
  }finally{await access.disconnect();}
}

main().catch(error=>{console.error(error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'PRINCIPAL_DELEGATION_DEMO_ERROR');process.exitCode=1;});
