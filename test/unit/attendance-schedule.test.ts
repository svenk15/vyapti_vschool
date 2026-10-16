import {describe,expect,it} from 'vitest';
import {validateSchedule,schoolDate} from '../../backend/modules/attendance/domain/schedule';
import {createAttendanceUseCases,type TeacherHistoryQuery} from '../../backend/modules/attendance/application/sessions';
describe('Attendance scheduled occurrence rules',()=>{
 const today='2026-10-05';
 it('uses the school timezone for explicit instants and permits a session whose start has elapsed today',()=>{
  expect(schoolDate(new Date('2026-10-05T03:30:00.000Z'),'Asia/Kolkata')).toBe(today);
  expect(validateSchedule({schoolDate:today,startsAt:'2026-10-05T02:00:00.000Z',endsAt:'2026-10-05T02:45:00.000Z',timezone:'Asia/Kolkata',today})).toMatchObject({schoolDate:today});
 });
 it('rejects local-date mismatches, cross-school-day intervals, missing offsets and past days',()=>{
  for(const input of [
   {schoolDate:today,startsAt:'2026-10-04T17:30:00.000Z',endsAt:'2026-10-04T18:00:00.000Z'},
   {schoolDate:today,startsAt:'2026-10-05T18:00:00.000Z',endsAt:'2026-10-05T19:00:00.000Z'},
   {schoolDate:today,startsAt:'2026-10-05T09:00',endsAt:'2026-10-05T10:00'},
   {schoolDate:'2026-10-04',startsAt:'2026-10-04T04:00:00.000Z',endsAt:'2026-10-04T04:45:00.000Z'},
  ])expect(()=>validateSchedule({...input,timezone:'Asia/Kolkata',today})).toThrow();
 });
});
describe('Teacher attendance history query',()=>{
 it('normalizes approved filters, deterministic ordering and opaque offset pagination',async()=>{let captured:TeacherHistoryQuery|undefined;const service=createAttendanceUseCases({teacherHistory:async(_actor:unknown,_organizationId:string,_schoolId:string,query:TeacherHistoryQuery)=>{captured=query;return {items:[],nextCursor:null};}} as never),identity={accountId:'11111111-1111-4111-8111-111111111111',tokenVersion:1};await service.teacherHistory(identity,'22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333',{q:'  Mathematics  ',by:'subject',status:['SUBMITTED','SUBMITTED'],sort:'class',order:'asc',cursor:Buffer.from('25').toString('base64url')});expect(captured).toEqual({q:'Mathematics',by:'subject',offeringId:null,date:null,statuses:['SUBMITTED'],sort:'class',order:'asc',offset:25,limit:25});});
 it('rejects invalid history dates, status and cursors before repository access',async()=>{const service=createAttendanceUseCases({teacherHistory:async()=>({items:[],nextCursor:null})} as never),args=[{accountId:'11111111-1111-4111-8111-111111111111',tokenVersion:1},'22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333'] as const;expect(()=>service.teacherHistory(...args,{date:'2026-02-30'})).toThrow(expect.objectContaining({code:'VALIDATION'}));expect(()=>service.teacherHistory(...args,{status:'CANCELLED'})).toThrow(expect.objectContaining({code:'VALIDATION'}));expect(()=>service.teacherHistory(...args,{cursor:'%%%'})).toThrow(expect.objectContaining({code:'VALIDATION'}));});
});
