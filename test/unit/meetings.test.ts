import {describe,expect,it} from 'vitest';
import {completionInput,meetingFields,participantIds,responseInput} from '../../backend/modules/events/domain/meetings';

describe('D14 meeting invariants',()=>{
 it('requires a bounded offset-qualified meeting and exact participants',()=>{
  expect(meetingFields({purpose:'Family progress review',agenda:'Review agreed non-sensitive next steps.',startsAt:'2026-10-20T10:00:00+05:30',endsAt:'2026-10-20T10:45:00+05:30'})).toMatchObject({purpose:'Family progress review'});
  expect(()=>meetingFields({purpose:'Review',agenda:'Agenda',startsAt:'2026-10-20T10:00:00+05:30',endsAt:'2026-10-20T10:05:00+05:30'})).toThrow('VALIDATION');
  const id='00000000-0000-4000-8000-000000000001';
  expect(()=>participantIds([id,id])).toThrow('VALIDATION');
 });
 it('keeps responses separate from explicit completion attendance',()=>{
  expect(responseInput({expectedMeetingVersion:2,expectedParticipantVersion:1,response:'DECLINED',key:'meeting-response-key-0001'}).response).toBe('DECLINED');
  expect(()=>completionInput({expectedVersion:3,summary:'Agreed actions.',attendance:[{participantId:'00000000-0000-4000-8000-000000000001',status:'ACCEPTED'}],actions:[],key:'meeting-complete-key-0001'})).toThrow('VALIDATION');
  expect(completionInput({expectedVersion:3,summary:'Agreed actions.',attendance:[{participantId:'00000000-0000-4000-8000-000000000001',status:'ATTENDED'}],actions:[],key:'meeting-complete-key-0001'}).attendance[0].status).toBe('ATTENDED');
 });
});
