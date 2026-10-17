import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {assignInput,batchInput,createInput,handoverInput,historyFindingInput,historyInput,informationRequestInput,informationResponseInput,localInstant,resolutionInput} from '../../backend/modules/coordination/domain/requests';
import {createDecisionInboxUseCases,type DecisionOwnerAdapter} from '../../backend/modules/leadership/application/decisions';
import type {CoordinationSourceAdapter} from '../../backend/modules/coordination/contracts/source-adapter';
import {CoordinationSourceRegistry} from '../../backend/modules/coordination/infrastructure/source-registry';

const key=()=>`coordination-${randomUUID()}`;

describe('coordination request contract',()=>{
 it('accepts the approved Attendance request and resolution shapes',()=>{
  expect(createInput({sessionId:randomUUID(),kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:'Register was not submitted.',dueLocal:'2026-10-16T16:30',key:key()})).toMatchObject({kind:'MISSING_REGISTER',concern:'MISSING_REGISTER'});
  expect(createInput({sessionId:randomUUID(),kind:'SESSION_SETUP_REVIEW',concern:'OTHER',note:null,dueLocal:null,assigneeAccountId:randomUUID(),assignmentReason:'Please review the source setup.',key:key()})).toMatchObject({kind:'SESSION_SETUP_REVIEW',assignmentReason:'Please review the source setup.'});
  expect(resolutionInput({requestId:randomUUID(),expectedVersion:3,kind:'NO_CHANGE_NEEDED',revision:null,reason:'The register was submitted before assignment.',key:key()})).toMatchObject({kind:'NO_CHANGE_NEEDED',revision:null});
 expect(resolutionInput({requestId:randomUUID(),expectedVersion:3,kind:'ATTENDANCE_CORRECTION',revision:2,reason:'Correction revision 2 addresses the request.',key:key()})).toMatchObject({kind:'ATTENDANCE_CORRECTION',revision:2});
  const recipientId=randomUUID();expect(createInput({sourceType:'LEARNING_RECIPIENT',sourceId:recipientId,kind:'LEARNING_SUPPORT_REVIEW',concern:'LEARNING_PROGRESS',note:'The published assignment remains incomplete.',dueLocal:'2026-10-20T15:30',assigneeAccountId:randomUUID(),assignmentReason:'Review the permitted status evidence.',key:key()})).toMatchObject({sourceType:'LEARNING_RECIPIENT',sourceId:recipientId,kind:'LEARNING_SUPPORT_REVIEW',concern:'LEARNING_PROGRESS'});
  expect(resolutionInput({requestId:randomUUID(),expectedVersion:3,kind:'LEARNING_POLICY_EVENT',revision:1,reason:'The reviewed extension is now effective.',key:key()})).toMatchObject({kind:'LEARNING_POLICY_EVENT',revision:1});
  const submissionId=randomUUID();expect(createInput({sourceType:'LEARNING_FEEDBACK_SUBMISSION',sourceId:submissionId,kind:'LEARNING_FEEDBACK_FOLLOW_UP',concern:'FEEDBACK_AWAITING',note:'Accepted work is awaiting its first feedback publication.',dueLocal:'2026-10-20T15:30',assigneeAccountId:randomUUID(),assignmentReason:'Coordinate the exact accepted submission.',key:key()})).toMatchObject({sourceType:'LEARNING_FEEDBACK_SUBMISSION',sourceId:submissionId,kind:'LEARNING_FEEDBACK_FOLLOW_UP',concern:'FEEDBACK_AWAITING'});
  expect(resolutionInput({requestId:randomUUID(),expectedVersion:3,kind:'LEARNING_FEEDBACK_PUBLICATION',revision:1,reason:'The first immutable feedback version is published.',key:key()})).toMatchObject({kind:'LEARNING_FEEDBACK_PUBLICATION',revision:1});
 });

 it('rejects mismatched kinds, unknown fields, invalid evidence and unsafe text',()=>{
  expect(()=>createInput({sessionId:randomUUID(),kind:'MISSING_REGISTER',concern:'OTHER',note:null,dueLocal:null,key:key()})).toThrow('VALIDATION');
  expect(()=>createInput({sessionId:randomUUID(),kind:'SESSION_SETUP_REVIEW',concern:'OTHER',note:'ok',dueLocal:null,key:key(),browserAuthority:true})).toThrow('VALIDATION');
  expect(()=>createInput({sessionId:randomUUID(),kind:'SESSION_SETUP_REVIEW',concern:'OTHER',note:'ok',dueLocal:null,assigneeAccountId:randomUUID(),assignmentReason:null,key:key()})).toThrow('VALIDATION');
  expect(()=>createInput({sourceType:'LEARNING_RECIPIENT',sourceId:randomUUID(),kind:'LEARNING_SUPPORT_REVIEW',concern:'LEARNING_PROGRESS',note:null,dueLocal:'2026-10-20T15:30',assigneeAccountId:randomUUID(),assignmentReason:'Missing factual note',key:key()})).toThrow('VALIDATION');
  expect(()=>createInput({sourceType:'LEARNING_RECIPIENT',sourceId:randomUUID(),kind:'SESSION_SETUP_REVIEW',concern:'OTHER',note:'Wrong source pairing',dueLocal:null,key:key()})).toThrow('VALIDATION');
  expect(()=>createInput({sourceType:'LEARNING_FEEDBACK_SUBMISSION',sourceId:randomUUID(),kind:'LEARNING_SUPPORT_REVIEW',concern:'LEARNING_PROGRESS',note:'Wrong source pairing',dueLocal:'2026-10-20T15:30',assigneeAccountId:randomUUID(),assignmentReason:'Wrong source pairing',key:key()})).toThrow('VALIDATION');
  expect(()=>resolutionInput({requestId:randomUUID(),expectedVersion:1,kind:'NO_CHANGE_NEEDED',revision:1,reason:'No change',key:key()})).toThrow('VALIDATION');
 expect(()=>assignInput({requestId:randomUUID(),assigneeAccountId:randomUUID(),dueLocal:null,expectedVersion:1,reason:'line\nbreak',key:key()})).toThrow('VALIDATION');
  expect(()=>batchInput({sourceIds:[],kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:null,dueLocal:null,assigneeAccountId:null,assignmentReason:null,key:key()})).toThrow('VALIDATION');
  expect(()=>batchInput({sourceIds:Array.from({length:51},()=>randomUUID()),kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:null,dueLocal:null,assigneeAccountId:null,assignmentReason:null,key:key()})).toThrow('VALIDATION');
  const duplicate=randomUUID();expect(()=>batchInput({sourceIds:[duplicate,duplicate],kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:null,dueLocal:null,assigneeAccountId:null,assignmentReason:null,key:key()})).toThrow('VALIDATION');
 });

 it('normalizes an explicit bounded bulk selection through the single-request rules',()=>{
  const sourceIds=[randomUUID(),randomUUID()];expect(batchInput({sourceIds,kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:'  Fictional follow-up  ',dueLocal:null,assigneeAccountId:null,assignmentReason:null,key:key()})).toMatchObject({sourceIds,kind:'MISSING_REGISTER',note:'Fictional follow-up'});
 });

 it('binds one bounded handover to distinct owners and explicit request versions',()=>{
  const fromAccountId=randomUUID(),toAccountId=randomUUID(),items=[{requestId:randomUUID(),expectedVersion:2},{requestId:randomUUID(),expectedVersion:4}];
  expect(handoverInput({fromAccountId,toAccountId,items,reason:'  Leadership responsibility changed.  ',key:key()})).toEqual({fromAccountId,toAccountId,items,reason:'Leadership responsibility changed.',key:expect.any(String)});
  expect(()=>handoverInput({fromAccountId,toAccountId:fromAccountId,items,reason:'No self transfer',key:key()})).toThrow('VALIDATION');
  expect(()=>handoverInput({fromAccountId,toAccountId,items:[items[0],items[0]],reason:'Duplicate',key:key()})).toThrow('VALIDATION');
  expect(()=>handoverInput({fromAccountId,toAccountId,items:Array.from({length:51},()=>({requestId:randomUUID(),expectedVersion:1})),reason:'Too many',key:key()})).toThrow('VALIDATION');
 });

 it('accepts only an exact bounded safe-history search',()=>{
  const requestId=randomUUID();expect(historyInput({attribute:'reference',value:requestId,fromDate:'2026-07-19',toDate:'2026-10-16',cursor:null,limit:50})).toMatchObject({attribute:'reference',value:requestId,limit:50});
  expect(historyInput({attribute:'date',value:'ignored',fromDate:'2026-10-01',toDate:'2026-10-16'})).toMatchObject({attribute:'date',value:null,limit:25});
  expect(()=>historyInput({attribute:'date',value:null,fromDate:'2026-07-18',toDate:'2026-10-16'})).toThrow('VALIDATION');
  expect(()=>historyInput({attribute:'actor',value:'not-an-id',fromDate:'2026-10-01',toDate:'2026-10-16'})).toThrow('VALIDATION');
  expect(()=>historyInput({attribute:'date',value:null,fromDate:'2026-10-17',toDate:'2026-10-16'})).toThrow('VALIDATION');
 });

 it('binds an immutable history finding to one exact event',()=>{
  const requestId=randomUUID(),input=historyFindingInput({requestId,eventNumber:3,kind:'ESCALATION',text:'  Review the unresolved operational ownership.  ',key:key()});
  expect(input).toMatchObject({requestId,eventNumber:3,kind:'ESCALATION',text:'Review the unresolved operational ownership.'});
  expect(()=>historyFindingInput({...input,eventNumber:0})).toThrow('VALIDATION');
  expect(()=>historyFindingInput({...input,kind:'NOTE'})).toThrow('VALIDATION');
 });

 it('converts an unambiguous branch-local due time and rejects DST gaps and overlaps',()=>{
  expect(localInstant('2026-10-16T16:30','Asia/Kolkata')?.toISOString()).toBe('2026-10-16T11:00:00.000Z');
  expect(()=>localInstant('2026-03-08T02:30','America/New_York')).toThrow('VALIDATION');
  expect(()=>localInstant('2026-11-01T01:30','America/New_York')).toThrow('VALIDATION');
 });

 it('validates bounded information questions and counterpart responses',()=>{
  const requestId=randomUUID(),informationRequestId=randomUUID();
  expect(informationRequestInput({requestId,expectedVersion:4,question:'  Which source check supports this recommendation?  ',responseDueAt:'2026-10-20T10:30:00.000Z',key:key()})).toMatchObject({requestId,expectedVersion:4,question:'Which source check supports this recommendation?'});
  expect(informationResponseInput({requestId,informationRequestId,expectedRequestVersion:5,expectedInformationVersion:1,response:'  The current immutable revision was checked.  ',key:key()})).toMatchObject({informationRequestId,response:'The current immutable revision was checked.'});
  expect(()=>informationRequestInput({requestId,expectedVersion:4,question:'',responseDueAt:null,key:key()})).toThrow('VALIDATION');
  expect(()=>informationResponseInput({requestId,informationRequestId,expectedRequestVersion:5,expectedInformationVersion:1,response:'x'.repeat(1001),key:key()})).toThrow('VALIDATION');
 });
});

describe('typed decision facade',()=>{
 it('rejects unknown owners and invalid owner commands before dispatch',async()=>{
  const calls:string[]=[],adapter={owner:'COORDINATION_VERIFICATION',list:async()=>({items:[],nextCursor:null,timezone:'Asia/Kolkata'}),get:async()=>{calls.push('get');throw new Error('unexpected');},decide:async()=>{calls.push('decide');throw new Error('unexpected');},status:async()=>{calls.push('status');throw new Error('unexpected');},requestInformation:async()=>{calls.push('requestInformation');throw new Error('unexpected');}} satisfies DecisionOwnerAdapter,facade=createDecisionInboxUseCases([adapter]),identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID(),itemId=randomUUID();
  await expect(facade.get(identity,organizationId,schoolId,'UNKNOWN',itemId)).rejects.toMatchObject({code:'NOT_FOUND'});
  await expect(facade.decide(identity,organizationId,schoolId,'COORDINATION_VERIFICATION',itemId,{action:'RETURN',expectedVersion:1,reason:null,key:key()})).rejects.toMatchObject({code:'VALIDATION'});
 expect(calls).toEqual([]);
 });
 it('normalizes only supported inbox query fields before owner dispatch',async()=>{
  let seen:unknown;const adapter={owner:'COORDINATION_VERIFICATION',list:async(_actor,_organizationId,_schoolId,input)=>{seen=input;return {items:[],nextCursor:null,timezone:'Asia/Kolkata'};},get:async()=>{throw new Error('unexpected');},decide:async()=>{throw new Error('unexpected');},status:async()=>{throw new Error('unexpected');},requestInformation:async()=>{throw new Error('unexpected');}} satisfies DecisionOwnerAdapter,facade=createDecisionInboxUseCases([adapter]),identity={accountId:randomUUID(),tokenVersion:1};
  const queue=await facade.list(identity,randomUUID(),randomUUID(),{reference:'  COORD-00000000-0000-4000-8000-000000000000  ',type:'ATTENDANCE_FOLLOW_UP',state:'READY',due:'NO_DUE_DATE',sort:'submitted',order:'desc',limit:'10'});
  expect(seen).toMatchObject({reference:'COORD-00000000-0000-4000-8000-000000000000',type:'ATTENDANCE_FOLLOW_UP',state:'READY',due:'NO_DUE_DATE',sort:'submitted',order:'desc',limit:10});expect(queue.query).toMatchObject({sort:'submitted',order:'desc'});
  await expect(facade.list(identity,randomUUID(),randomUUID(),{type:'UNKNOWN'})).rejects.toMatchObject({code:'VALIDATION'});await expect(facade.list(identity,randomUUID(),randomUUID(),{due:'TODAY'})).rejects.toMatchObject({code:'VALIDATION'});await expect(facade.list(identity,randomUUID(),randomUUID(),{sort:'title'})).rejects.toMatchObject({code:'VALIDATION'});
 });
 it('validates and dispatches one owner status intent without changing it',async()=>{
  let seen:unknown;const adapter={owner:'COORDINATION_VERIFICATION',list:async()=>({items:[],nextCursor:null,timezone:'UTC'}),get:async()=>{throw new Error('unexpected');},decide:async()=>{throw new Error('unexpected');},status:async(_actor,_organizationId,_schoolId,_itemId,input)=>{seen=input;return {state:'UNKNOWN' as const};},requestInformation:async()=>{throw new Error('unexpected');}} satisfies DecisionOwnerAdapter,facade=createDecisionInboxUseCases([adapter]),identity={accountId:randomUUID(),tokenVersion:1},input={action:'RETURN',expectedVersion:4,reason:'Needs current owner evidence',key:key()};
  await expect(facade.status(identity,randomUUID(),randomUUID(),'COORDINATION_VERIFICATION',randomUUID(),input)).resolves.toEqual({state:'UNKNOWN'});
  expect(seen).toEqual(input);
 });
});

describe('typed Coordination source registry',()=>{
 const attendance={sourceType:'ATTENDANCE_SESSION',requestKinds:['MISSING_REGISTER','SESSION_SETUP_REVIEW'],inspect:async()=>{throw new Error('not called');},verify:async()=>{},eligibleAssignee:async()=>true} satisfies CoordinationSourceAdapter;
 const learning={sourceType:'LEARNING_RECIPIENT',requestKinds:['LEARNING_SUPPORT_REVIEW'],inspect:async()=>{throw new Error('not called');},verify:async()=>{},eligibleAssignee:async()=>true} satisfies CoordinationSourceAdapter;
 const feedback={sourceType:'LEARNING_FEEDBACK_SUBMISSION',requestKinds:['LEARNING_FEEDBACK_FOLLOW_UP'],inspect:async()=>{throw new Error('not called');},verify:async()=>{},eligibleAssignee:async()=>true} satisfies CoordinationSourceAdapter;
 it('resolves only an explicitly registered source and supported request kind',()=>{
  const registry=new CoordinationSourceRegistry([attendance,learning,feedback]);
  expect(registry.resolve('ATTENDANCE_SESSION','MISSING_REGISTER')).toBe(attendance);
  expect(registry.resolve('LEARNING_RECIPIENT','LEARNING_SUPPORT_REVIEW')).toBe(learning);
  expect(registry.resolve('LEARNING_FEEDBACK_SUBMISSION','LEARNING_FEEDBACK_FOLLOW_UP')).toBe(feedback);
  expect(()=>registry.resolve('LEARNING_ASSIGNMENT','MISSING_REGISTER')).toThrow('NOT_FOUND');
  expect(()=>registry.resolve('LEARNING_RECIPIENT','MISSING_REGISTER')).toThrow('NOT_FOUND');
 });
 it('rejects duplicate owner registrations at composition time',()=>{
  expect(()=>new CoordinationSourceRegistry([attendance,attendance])).toThrow('Duplicate Coordination source adapter');
 });
});
