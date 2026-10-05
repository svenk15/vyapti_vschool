import {describe,expect,it} from 'vitest';
import {validateSchedule,schoolDate} from '../../backend/modules/attendance/domain/schedule';
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
