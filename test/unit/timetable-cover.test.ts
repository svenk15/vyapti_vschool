import {describe,expect,it} from 'vitest';
import {closeCoverInput,decideCoverInput,proposeCoverInput,respondCoverInput} from '../../backend/modules/academics/domain/timetable-cover';

const occurrenceId='00000000-0000-4000-8000-000000000001';
const teacherId='00000000-0000-4000-8000-000000000002';
const key='00000000-0000-4000-8000-000000000003';

describe('exact occurrence cover rules',()=>{
 it('normalizes the exact proposal and rejects unsafe free text',()=>{
  expect(proposeCoverInput({occurrenceId:occurrenceId.toUpperCase(),substituteTeacherId:teacherId,reason:'  Substitute confirmed for this lesson  ',key})).toEqual({occurrenceId,substituteTeacherId:teacherId,reason:'Substitute confirmed for this lesson',key});
  expect(()=>proposeCoverInput({occurrenceId,substituteTeacherId:teacherId,reason:'bad\nreason',key})).toThrow('VALIDATION');
 });

 it('accepts only the approved decision and response vocabularies with positive versions',()=>{
  expect(decideCoverInput({action:'APPROVE',expectedVersion:1,reason:'Independent approval recorded',key})).toMatchObject({action:'APPROVE',expectedVersion:1});
  expect(respondCoverInput({action:'DECLINE',expectedVersion:2,reason:'A dated clash is now present',key})).toMatchObject({action:'DECLINE',expectedVersion:2});
  expect(closeCoverInput({action:'CANCEL',expectedVersion:3,reason:'Coverage is no longer required',key})).toMatchObject({action:'CANCEL',expectedVersion:3});
  expect(()=>decideCoverInput({action:'ACCEPT',expectedVersion:1,reason:'Invalid approver action',key})).toThrow('VALIDATION');
  expect(()=>respondCoverInput({action:'ACCEPT',expectedVersion:0,reason:'Invalid stale version',key})).toThrow('VALIDATION');
 });
});
