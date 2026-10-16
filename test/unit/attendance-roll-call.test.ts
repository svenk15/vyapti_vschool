import {describe,expect,it} from 'vitest';
import {cancelSessionInput,cancellationPermissions,commandStatusInput,correctSessionInput,openSessionInput,submitSessionInput} from '../../backend/modules/attendance/domain/roll-call';

const id='c6ec3257-35c7-4a4c-942a-c082c4311201',key='3233a2aa-d2f2-4942-9a0e-54d47e62e19f',hash='a'.repeat(64);
describe('ATT-02 roll-call policy',()=>{
 it('requires a positive expected version and stable command key',()=>{expect(openSessionInput({expectedVersion:1,key})).toEqual({expectedVersion:1,key});expect(()=>openSessionInput({expectedVersion:0,key})).toThrow();expect(()=>openSessionInput({expectedVersion:1,key:'not-a-key'})).toThrow();expect(()=>openSessionInput({expectedVersion:1,key,admin:true} as never)).toThrow();});
 it('accepts only unique roster entries with valid status-specific late minutes',()=>{
  expect(submitSessionInput({expectedVersion:2,rosterRevision:hash,key,entries:[{studentId:id,status:'PRESENT'},{studentId:'7b74ad58-c10d-40dc-98ef-1a0c18a03648',status:'LATE',lateMinutes:480}]}).entries).toHaveLength(2);
  expect(()=>submitSessionInput({expectedVersion:2,rosterRevision:hash,key,entries:[{studentId:id,status:'PRESENT'},{studentId:id,status:'ABSENT'}]})).toThrow();
  expect(()=>submitSessionInput({expectedVersion:2,rosterRevision:hash,key,entries:[{studentId:id,status:'LATE',lateMinutes:0}]})).toThrow();
  expect(()=>submitSessionInput({expectedVersion:2,rosterRevision:hash,key,entries:[{studentId:id,status:'PRESENT',lateMinutes:1}]})).toThrow();
  expect(()=>submitSessionInput({expectedVersion:2,rosterRevision:hash,key,entries:[{studentId:id,status:'PRESENT',displayName:'not accepted'}]})).toThrow();
  expect(()=>submitSessionInput({expectedVersion:2,rosterRevision:hash,key,entries:[{studentId:id,status:'PRESENT'}],actorAccountId:id} as never)).toThrow();
  expect(()=>submitSessionInput({expectedVersion:2,rosterRevision:'wrong',key,entries:[{studentId:id,status:'PRESENT'}]})).toThrow();
 });
});
describe('ATT-03 correction policy',()=>{
 it('normalizes reason and accepts a unique changed-status subset',()=>{expect(correctSessionInput({expectedVersion:4,key,reason:'  Registrar correction  ',changes:[{studentId:id,status:'EXCUSED'}]})).toEqual({expectedVersion:4,key,reason:'Registrar correction',changes:[{studentId:id,status:'EXCUSED'}]});});
 it('rejects empty/duplicate/extra changes, no command fields, and invalid reason or late minutes',()=>{
  const base={expectedVersion:4,key,reason:'Valid correction reason',changes:[{studentId:id,status:'ABSENT'}]};
  expect(()=>correctSessionInput({...base,changes:[]})).toThrow();expect(()=>correctSessionInput({...base,changes:[...base.changes,...base.changes]})).toThrow();expect(()=>correctSessionInput({...base,reason:'no'})).toThrow();expect(()=>correctSessionInput({...base,reason:`${'x'.repeat(501)}`})).toThrow();expect(()=>correctSessionInput({...base,changes:[{studentId:id,status:'LATE',lateMinutes:0}]})).toThrow();expect(()=>correctSessionInput({...base,changes:[{studentId:id,status:'ABSENT',lateMinutes:4}]})).toThrow();expect(()=>correctSessionInput({...base,unexpected:true} as never)).toThrow();
 });
});
describe('ATT-04 cancellation and recovery policy',()=>{
 it('selects current permission by state and admits both current capabilities for a canceled-command replay',()=>{expect(cancellationPermissions('SCHEDULED')).toEqual(['class.manage']);expect(cancellationPermissions('OPEN')).toEqual(['class.manage']);expect(cancellationPermissions('SUBMITTED')).toEqual(['attendance.correct']);expect(cancellationPermissions('CANCELLED')).toEqual(['class.manage','attendance.correct']);expect(()=>cancellationPermissions('INVALID')).toThrow();});
 it('normalizes bounded cancellation reason and accepts only allowlisted status commands',()=>{expect(cancelSessionInput({expectedVersion:3,key,reason:'  Approved closure  '})).toEqual({expectedVersion:3,key,reason:'Approved closure'});expect(()=>cancelSessionInput({expectedVersion:0,key,reason:'Approved closure'})).toThrow();expect(()=>cancelSessionInput({expectedVersion:3,key,reason:'nope'})).toThrow();expect(()=>cancelSessionInput({expectedVersion:3,key,reason:'Valid reason',extra:true} as never)).toThrow();expect(commandStatusInput('attendance.submit',key)).toEqual({command:'attendance.submit',key});expect(commandStatusInput('attendance.cancel',key)).toEqual({command:'attendance.cancel',key});expect(()=>commandStatusInput('tenant.admin',key)).toThrow();expect(()=>commandStatusInput('attendance.cancel','not-a-key')).toThrow();});
});
