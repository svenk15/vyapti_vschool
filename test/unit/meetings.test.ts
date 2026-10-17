import {describe,expect,it} from 'vitest';
import {cancelInput,completionInput,meetingFields,participantChangeInput,participantIds,rescheduleInput,responseInput} from '../../backend/modules/events/domain/meetings';
import {createInput} from '../../backend/modules/coordination/domain/requests';

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
 it('validates versioned schedule, removal and cancellation commands',()=>{
  expect(rescheduleInput({expectedVersion:4,startsAt:'2026-10-21T10:00:00+05:30',endsAt:'2026-10-21T10:45:00+05:30',key:'meeting-reschedule-key-01'}).expectedVersion).toBe(4);
  expect(participantChangeInput({participantId:'00000000-0000-4000-8000-000000000001',expectedVersion:4,expectedParticipantVersion:2,key:'meeting-remove-key-00001'}).expectedParticipantVersion).toBe(2);
 expect(cancelInput({expectedVersion:4,key:'meeting-cancel-key-00001'}).expectedVersion).toBe(4);
  expect(createInput({sourceType:'EVENT_MEETING_ACTION',sourceId:'00000000-0000-4000-8000-000000000001',kind:'MEETING_FOLLOW_UP',concern:'OTHER',note:'Track the agreed action.',dueLocal:'2026-10-22T10:00',assigneeAccountId:'00000000-0000-4000-8000-000000000002',assignmentReason:'Exact action owner.',key:'meeting-follow-up-key-01'}).kind).toBe('MEETING_FOLLOW_UP');
 });
});
