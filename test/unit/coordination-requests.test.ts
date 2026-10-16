import {describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {assignInput,createInput,localInstant,resolutionInput} from '../../backend/modules/coordination/domain/requests';

const key=()=>`coordination-${randomUUID()}`;

describe('coordination request contract',()=>{
 it('accepts the approved Attendance request and resolution shapes',()=>{
  expect(createInput({sessionId:randomUUID(),kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:'Register was not submitted.',dueLocal:'2026-10-16T16:30',key:key()})).toMatchObject({kind:'MISSING_REGISTER',concern:'MISSING_REGISTER'});
  expect(resolutionInput({requestId:randomUUID(),expectedVersion:3,kind:'NO_CHANGE_NEEDED',revision:null,reason:'The register was submitted before assignment.',key:key()})).toMatchObject({kind:'NO_CHANGE_NEEDED',revision:null});
  expect(resolutionInput({requestId:randomUUID(),expectedVersion:3,kind:'ATTENDANCE_CORRECTION',revision:2,reason:'Correction revision 2 addresses the request.',key:key()})).toMatchObject({kind:'ATTENDANCE_CORRECTION',revision:2});
 });

 it('rejects mismatched kinds, unknown fields, invalid evidence and unsafe text',()=>{
  expect(()=>createInput({sessionId:randomUUID(),kind:'MISSING_REGISTER',concern:'OTHER',note:null,dueLocal:null,key:key()})).toThrow('VALIDATION');
  expect(()=>createInput({sessionId:randomUUID(),kind:'SESSION_SETUP_REVIEW',concern:'OTHER',note:'ok',dueLocal:null,key:key(),browserAuthority:true})).toThrow('VALIDATION');
  expect(()=>resolutionInput({requestId:randomUUID(),expectedVersion:1,kind:'NO_CHANGE_NEEDED',revision:1,reason:'No change',key:key()})).toThrow('VALIDATION');
  expect(()=>assignInput({requestId:randomUUID(),assigneeAccountId:randomUUID(),dueLocal:null,expectedVersion:1,reason:'line\nbreak',key:key()})).toThrow('VALIDATION');
 });

 it('converts an unambiguous branch-local due time and rejects DST gaps and overlaps',()=>{
  expect(localInstant('2026-10-16T16:30','Asia/Kolkata')?.toISOString()).toBe('2026-10-16T11:00:00.000Z');
  expect(()=>localInstant('2026-03-08T02:30','America/New_York')).toThrow('VALIDATION');
  expect(()=>localInstant('2026-11-01T01:30','America/New_York')).toThrow('VALIDATION');
 });
});
