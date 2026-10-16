import {config} from 'dotenv';
import {createHash} from 'node:crypto';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../generated/prisma/client';
import {createAccessServices} from '../backend/composition/access';
import {createCoordinationServices} from '../backend/composition/coordination';
import {BcryptPasswords} from '../backend/modules/access/infrastructure/passwords';
import {localAccessConfig} from './access-local-config';
import type {RoleCode} from '../shared/contracts/access';
import type {CoordinationRequestKind} from '../shared/contracts/coordination';

config({path:'.env.local',quiet:true});
config({quiet:true});

const peoplePath='artifacts/people-02/private-demo.json';
const directory='artifacts/coordination-01';
const path=`${directory}/private-demo.json`;

type People={adminEmail:string;password:string;teacherEmail:string;teacherPassword:string;organizationId:string;schoolId:string;accountId:string;teacherAccountId:string};
type Demo={roleKey:string;missingCreateKey:string;resolvedCreateKey:string;resolvedStartKey:string;resolvedSubmitKey:string;resolvedVerifyKey:string;fullBatchKey?:string;mixedBatchKey?:string;fullBatchId?:string;mixedBatchId?:string;missingRequestId?:string;resolvedRequestId?:string;unassignedRequestId?:string;inProgressRequestId?:string;awaitingRequestId?:string;returnedRequestId?:string;withdrawnRequestId?:string;sourceDate?:string};

const key=(value:string)=>{const hash=createHash('sha256').update(value).digest('hex').slice(0,32);return `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20)}`;};
const initial=(scope:string):Demo=>({roleKey:key(`coord-role:${scope}`),missingCreateKey:key(`coord-missing:${scope}`),resolvedCreateKey:key(`coord-resolved:${scope}`),resolvedStartKey:key(`coord-start:${scope}`),resolvedSubmitKey:key(`coord-submit:${scope}`),resolvedVerifyKey:key(`coord-verify:${scope}`)});

async function main(){
 const local=localAccessConfig();
 if(!existsSync(peoplePath))throw new Error('PEOPLE_DEMO_REQUIRED');
 const people=JSON.parse(readFileSync(peoplePath,'utf8')) as People;
 const scopeKey=`${people.organizationId}:${people.schoolId}`;
 const demo:Demo=existsSync(path)?JSON.parse(readFileSync(path,'utf8')) as Demo:initial(scopeKey);
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:local.databaseUrl}),log:[]});
 const access=createAccessServices(local);
 const coordination=createCoordinationServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core','attendance','staff_core','student_core'],mode:'synthetic'});
 let stage='authenticate';
 try{
  const principalAccount=await db.userAccount.findUnique({where:{normalizedEmail:people.adminEmail.toLowerCase()}});
  const workerAccount=await db.userAccount.findUnique({where:{normalizedEmail:people.teacherEmail.toLowerCase()}});
  const passwords=new BcryptPasswords();
  if(!principalAccount||!workerAccount||principalAccount.status!=='ACTIVE'||workerAccount.status!=='ACTIVE'||!await passwords.verify(people.password,principalAccount.passwordHash)||!await passwords.verify(people.teacherPassword,workerAccount.passwordHash))throw new Error('SYNTHETIC_IDENTITIES_REQUIRED');
  const principal={accountId:principalAccount.id,tokenVersion:principalAccount.tokenVersion};
  const worker={accountId:workerAccount.id,tokenVersion:workerAccount.tokenVersion};

  stage='worker-role';
  const membership=await db.schoolMembership.findFirstOrThrow({where:{organizationId:people.organizationId,schoolId:people.schoolId,accountId:worker.accountId,status:'ACTIVE'},include:{grants:{select:{code:true}}}});
  const roles=membership.grants.map(item=>item.code).filter((value):value is RoleCode=>value==='SCHOOL_ADMIN'||value==='TEACHER'||value==='PRINCIPAL');
  if(!roles.includes('SCHOOL_ADMIN'))await access.institutionOperation({kind:'SetBranchMembership',organizationId:people.organizationId,schoolId:people.schoolId,accountId:worker.accountId,status:'ACTIVE',roles:[...roles,'SCHOOL_ADMIN'].sort() as RoleCode[],expectedVersion:membership.version,key:demo.roleKey,reason:'Authorize fictional Attendance coordination worker'},local.operator);

  stage='capability-grants';
  for(const [accountId,capabilities] of [[principal.accountId,['coordination.create','coordination.assign','coordination.verify','coordination.manage']],[worker.accountId,['coordination.work']]] as const){
   for(const capability of capabilities){
    if(!await db.coordinationCapabilityGrant.findFirst({where:{organizationId:people.organizationId,schoolId:people.schoolId,accountId,capability,revokedAt:null}}))await coordination.grant(local.operator,{organizationId:people.organizationId,schoolId:people.schoolId,accountId,capability});
   }
  }

  stage='sources';
  const now=new Date();
  const sessions=await db.attendanceSession.findMany({where:{organizationId:people.organizationId,schoolId:people.schoolId,OR:[{status:'SUBMITTED'},{status:{in:['SCHEDULED','OPEN']},endsAt:{lt:now}}]},orderBy:[{schoolDate:'desc'},{startsAt:'asc'}]});
  if(sessions.length<2)throw new Error('SYNTHETIC_COORDINATION_SOURCES_REQUIRED');
  const occupied=new Set((await db.coordinationRequest.findMany({where:{organizationId:people.organizationId,schoolId:people.schoolId,status:{in:['OPEN','IN_PROGRESS','AWAITING_VERIFICATION']}},select:{sourceId:true,kind:true}})).map(item=>`${item.sourceId}:${item.kind}`));
  const pick=(kind:CoordinationRequestKind,preferred:'SUBMITTED'|'PAST')=>{
   const candidates=sessions.filter(session=>(preferred==='SUBMITTED'?session.status==='SUBMITTED':session.status==='SCHEDULED'||session.status==='OPEN')&&!occupied.has(`${session.id}:${kind}`));
   const source=candidates[0]??sessions.find(session=>!occupied.has(`${session.id}:${kind}`));
   if(!source)throw new Error('SYNTHETIC_COORDINATION_SOURCES_REQUIRED');
   occupied.add(`${source.id}:${kind}`);
   return source;
  };
  const command=(scenario:string,action:string)=>key(`coordination:${scenario}:${action}:${scopeKey}`);
  const getRequest=(requestId:string|undefined)=>requestId?db.coordinationRequest.findUnique({where:{id:requestId}}):null;

  stage='in-progress-request';
  let inProgress=await getRequest(demo.inProgressRequestId??demo.missingRequestId);
  if(!inProgress){
   const source=pick('MISSING_REGISTER','PAST');
   const created=await coordination.create(principal,people.organizationId,people.schoolId,{sessionId:source.id,kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:'Please confirm the register status with the responsible teaching team.',dueLocal:null,assigneeAccountId:worker.accountId,assignmentReason:'Assign the fictional missing-register follow-up.',key:demo.missingCreateKey});
   inProgress=await db.coordinationRequest.findUniqueOrThrow({where:{id:created.requestId}});
  }
  if(inProgress.status==='OPEN'&&inProgress.assigneeAccountId===worker.accountId)await coordination.start(worker,people.organizationId,people.schoolId,{requestId:inProgress.id,expectedVersion:inProgress.version,reason:null,key:command('in-progress','start')});
  demo.inProgressRequestId=inProgress.id;
  demo.missingRequestId=inProgress.id;

  stage='unassigned-request';
  if(!await getRequest(demo.unassignedRequestId)){
   const source=pick('MISSING_REGISTER','PAST');
   const created=await coordination.create(principal,people.organizationId,people.schoolId,{sessionId:source.id,kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:null,dueLocal:null,assigneeAccountId:null,assignmentReason:null,key:command('unassigned','create')});
   demo.unassignedRequestId=created.requestId;
  }

  stage='awaiting-request';
  if(!await getRequest(demo.awaitingRequestId)){
   const source=pick('SESSION_SETUP_REVIEW','SUBMITTED');
   const created=await coordination.create(principal,people.organizationId,people.schoolId,{sessionId:source.id,kind:'SESSION_SETUP_REVIEW',concern:'OTHER',note:'Review the source configuration without copying protected Attendance content.',dueLocal:null,assigneeAccountId:worker.accountId,assignmentReason:'Assign the fictional source review.',key:command('awaiting','create')});
   const started=await coordination.start(worker,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:created.version,reason:null,key:command('awaiting','start')});
   await coordination.submit(worker,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:started.version,kind:'NO_CHANGE_NEEDED',revision:null,reason:'The authoritative source is configured correctly.',key:command('awaiting','submit')});
   demo.awaitingRequestId=created.requestId;
  }

  stage='returned-request';
  if(!await getRequest(demo.returnedRequestId)){
   const source=pick('SESSION_SETUP_REVIEW','SUBMITTED');
   const created=await coordination.create(principal,people.organizationId,people.schoolId,{sessionId:source.id,kind:'SESSION_SETUP_REVIEW',concern:'WRONG_OFFERING',note:null,dueLocal:null,assigneeAccountId:worker.accountId,assignmentReason:'Assign the fictional returned review.',key:command('returned','create')});
   const started=await coordination.start(worker,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:created.version,reason:null,key:command('returned','start')});
   const submitted=await coordination.submit(worker,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:started.version,kind:'NO_CHANGE_NEEDED',revision:null,reason:'Initial evidence for the configured source.',key:command('returned','submit')});
   await coordination.returnResolution(principal,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:submitted.version,reason:'Add the exact source configuration checked.',key:command('returned','return')});
   demo.returnedRequestId=created.requestId;
  }

  stage='resolved-request';
  if(!await getRequest(demo.resolvedRequestId)){
   const source=pick('SESSION_SETUP_REVIEW','SUBMITTED');
   const created=await coordination.create(principal,people.organizationId,people.schoolId,{sessionId:source.id,kind:'SESSION_SETUP_REVIEW',concern:'OTHER',note:'Confirm that the submitted register needs no setup change.',dueLocal:null,assigneeAccountId:worker.accountId,assignmentReason:'Review the fictional submitted session.',key:demo.resolvedCreateKey});
   const started=await coordination.start(worker,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:created.version,reason:null,key:demo.resolvedStartKey});
   const submitted=await coordination.submit(worker,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:started.version,kind:'NO_CHANGE_NEEDED',revision:null,reason:'The authoritative submitted session is correctly configured.',key:demo.resolvedSubmitKey});
   await coordination.verify(principal,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:submitted.version,reason:null,key:demo.resolvedVerifyKey});
   demo.resolvedRequestId=created.requestId;
  }

  stage='withdrawn-request';
  if(!await getRequest(demo.withdrawnRequestId)){
   const source=pick('SESSION_SETUP_REVIEW','SUBMITTED');
   const created=await coordination.create(principal,people.organizationId,people.schoolId,{sessionId:source.id,kind:'SESSION_SETUP_REVIEW',concern:'DUPLICATE',note:null,dueLocal:null,assigneeAccountId:null,assignmentReason:null,key:command('withdrawn','create')});
   await coordination.withdraw(principal,people.organizationId,people.schoolId,{requestId:created.requestId,expectedVersion:created.version,reason:'The fictional review is no longer required.',key:command('withdrawn','withdraw')});
   demo.withdrawnRequestId=created.requestId;
  }

  stage='bulk-followups';
  demo.fullBatchKey??=command('bulk-full','submit');demo.mixedBatchKey??=command('bulk-mixed','submit');
  const activeMissing=new Set((await db.coordinationRequest.findMany({where:{organizationId:people.organizationId,schoolId:people.schoolId,kind:'MISSING_REGISTER',status:{notIn:['RESOLVED','WITHDRAWN']}},select:{sourceId:true}})).map(item=>item.sourceId)),past=sessions.filter(session=>(session.status==='SCHEDULED'||session.status==='OPEN')&&session.endsAt<now),submitted=sessions.filter(session=>session.status==='SUBMITTED');
  if(!demo.fullBatchId){const eligible=past.filter(session=>!activeMissing.has(session.id)).slice(0,2);if(eligible.length){const result=await coordination.submitBatch(principal,people.organizationId,people.schoolId,{sourceIds:eligible.map(session=>session.id),kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:'Review the selected fictional registers.',dueLocal:null,assigneeAccountId:worker.accountId,assignmentReason:'Assign the eligible fictional bulk follow-ups.',key:demo.fullBatchKey});demo.fullBatchId=result.id;for(const item of eligible)activeMissing.add(item.id);}}
  if(!demo.mixedBatchId){const eligible=past.find(session=>!activeMissing.has(session.id)),duplicate=past.find(session=>activeMissing.has(session.id)),unavailable=submitted.find(session=>!activeMissing.has(session.id)),selected=[eligible,duplicate,unavailable].filter((value):value is NonNullable<typeof value>=>Boolean(value));if(selected.length>=2){const result=await coordination.submitBatch(principal,people.organizationId,people.schoolId,{sourceIds:selected.map(session=>session.id),kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:'Demonstrate honest mixed bulk outcomes with fictional data.',dueLocal:null,assigneeAccountId:null,assignmentReason:null,key:demo.mixedBatchKey});demo.mixedBatchId=result.id;}}

  demo.sourceDate=sessions[0].schoolDate.toISOString().slice(0,10);
  mkdirSync(directory,{recursive:true,mode:0o700});
  writeFileSync(path,`${JSON.stringify({...demo,organizationId:people.organizationId,schoolId:people.schoolId,principalEmail:people.adminEmail,workerEmail:people.teacherEmail},null,2)}\n`,{mode:0o600});
  console.log(`Prepared or preserved Coordination lifecycle and LEA-10 batch examples. Private scenario: ${path}`);
 }catch(error){
  throw new Error(`${stage.toUpperCase()}_${error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:'LOCAL_DEMO_ERROR'}`);
 }finally{
  await coordination.disconnect();
  await access.disconnect();
  await db.$disconnect();
 }
}

main().catch(error=>{console.error(error instanceof Error&&/^[A-Z0-9_-]+$/.test(error.message)?error.message:'COORDINATION_DEMO_ERROR');process.exitCode=1;});
